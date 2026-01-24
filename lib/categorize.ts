import { RawTransaction, CategorizedTransaction, Category, Subscription } from '@/types';
import { MERCHANT_KEYWORDS } from './constants';

// Clean up messy merchant names from bank statements
export function cleanMerchantName(description: string): string {
  let cleaned = description;
  
  // Remove common bank prefixes
  const prefixes = [
    'POS DEBIT',
    'POS PURCHASE',
    'PURCHASE AUTHORIZED ON \\d{2}/\\d{2}',
    'RECURRING PAYMENT AUTHORIZED ON \\d{2}/\\d{2}',
    'CHECKCARD \\d{4}',
    'ACH RECURRING',
    'ACH DEBIT',
    'DEBIT CARD PURCHASE',
    'VISA DEBIT',
    'PENDING',
  ];
  
  for (const prefix of prefixes) {
    cleaned = cleaned.replace(new RegExp(prefix, 'gi'), '');
  }
  
  // Remove card numbers (Card XXXX or Card 3394)
  cleaned = cleaned.replace(/card\s*\d{4}/gi, '');
  
  // Remove reference numbers (S followed by 15+ digits)
  cleaned = cleaned.replace(/S\d{15,}/g, '');
  
  // Remove long number sequences (8+ digits)
  cleaned = cleaned.replace(/\d{8,}/g, '');
  
  // Remove state abbreviations at end (TX, CA, NY, etc.)
  cleaned = cleaned.replace(/\s+[A-Z]{2}\s*$/g, '');
  
  // Remove common suffixes
  cleaned = cleaned.replace(/\s+(LLC|INC|CORP|CO|LTD)\.?\s*/gi, ' ');
  
  // Remove URLs
  cleaned = cleaned.replace(/(WWW\.)?\S+\.(COM|NET|ORG)/gi, '');
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Take first meaningful part (before weird codes)
  const parts = cleaned.split(/[*#\\]/);
  cleaned = parts[0].trim();
  
  // Title case
  cleaned = cleaned
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // If we cleaned too aggressively, use first 30 chars of original
  if (cleaned.length < 3) {
    cleaned = description.slice(0, 30).trim();
  }
  
  return cleaned;
}

// Determine category based on merchant keywords
export function categorizeTransaction(transaction: RawTransaction): CategorizedTransaction {
  const description = transaction.description.toLowerCase();
  const merchant = cleanMerchantName(transaction.description);
  
  // Check for income patterns first
  const incomePatterns = ['payroll', 'direct deposit', 'salary', 'deposit from', 'tax refund', 'irs treas'];
  if (transaction.type === 'credit') {
    for (const pattern of incomePatterns) {
      if (description.includes(pattern)) {
        return {
          ...transaction,
          category: 'income',
          merchant,
          isRecurring: false,
          needsReview: transaction.confidence < 0.8,
        };
      }
    }
  }
  
  // Check for transfer patterns
  const transferPatterns = ['transfer', 'zelle', 'venmo', 'paypal', 'cash app', 'wise'];
  for (const pattern of transferPatterns) {
    if (description.includes(pattern)) {
      return {
        ...transaction,
        category: 'transfer',
        merchant,
        isRecurring: false,
        needsReview: transaction.confidence < 0.8,
      };
    }
  }
  
  // Check against merchant keywords
  for (const [keyword, category] of Object.entries(MERCHANT_KEYWORDS)) {
    if (description.includes(keyword.toLowerCase())) {
      return {
        ...transaction,
        category,
        merchant,
        isRecurring: false,
        needsReview: transaction.confidence < 0.8,
      };
    }
  }
  
  // Default to 'other' if no match
  return {
    ...transaction,
    category: transaction.type === 'credit' ? 'income' : 'other',
    merchant,
    isRecurring: false,
    needsReview: transaction.confidence < 0.8,
  };
}

// Categorize all transactions
export function categorizeAll(transactions: RawTransaction[]): CategorizedTransaction[] {
  return transactions
    .map(categorizeTransaction)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Detect recurring subscriptions
export function detectSubscriptions(transactions: CategorizedTransaction[]): Subscription[] {
  const subscriptions: Subscription[] = [];
  
  // Group transactions by cleaned merchant name
  const merchantGroups = new Map<string, CategorizedTransaction[]>();
  
  for (const t of transactions) {
    if (t.type !== 'debit') continue;
    
    const key = t.merchant.toLowerCase();
    if (!merchantGroups.has(key)) {
      merchantGroups.set(key, []);
    }
    merchantGroups.get(key)!.push(t);
  }
  
  // Analyze each merchant for recurring patterns
  for (const [merchantKey, txns] of merchantGroups) {
    if (txns.length < 2) continue;
    
    // Sort by date
    txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Check if amounts are similar (within $2)
    const amounts = txns.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const amountsConsistent = amounts.every(a => Math.abs(a - avgAmount) <= 2);
    
    if (!amountsConsistent) continue;
    
    // Calculate average interval between charges
    const intervals: number[] = [];
    for (let i = 1; i < txns.length; i++) {
      const days = (new Date(txns[i].date).getTime() - new Date(txns[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // Determine frequency
    let frequency: 'weekly' | 'monthly' | 'yearly';
    if (avgInterval <= 10) {
      frequency = 'weekly';
    } else if (avgInterval <= 45) {
      frequency = 'monthly';
    } else if (avgInterval <= 380) {
      frequency = 'yearly';
    } else {
      continue; // Not a subscription
    }
    
    // Determine subscription category
    const desc = merchantKey.toLowerCase();
    let subCategory: Subscription['category'] = 'other';
    
    if (['netflix', 'hulu', 'disney', 'hbo', 'max', 'prime video', 'spotify', 'apple music', 'youtube'].some(s => desc.includes(s))) {
      subCategory = 'streaming';
    } else if (['adobe', 'microsoft', 'dropbox', 'notion', 'figma', 'canva', 'openai', 'chatgpt', 'github'].some(s => desc.includes(s))) {
      subCategory = 'software';
    } else if (['gym', 'fitness', 'peloton', 'equinox', 'planet'].some(s => desc.includes(s))) {
      subCategory = 'fitness';
    } else if (['news', 'times', 'post', 'journal', 'magazine'].some(s => desc.includes(s))) {
      subCategory = 'news';
    } else if (['xbox', 'playstation', 'nintendo', 'steam', 'game'].some(s => desc.includes(s))) {
      subCategory = 'gaming';
    }
    
    subscriptions.push({
      name: txns[0].merchant,
      amount: avgAmount,
      frequency,
      lastCharge: txns[txns.length - 1].date,
      category: subCategory,
      confidence: amountsConsistent ? 0.9 : 0.7,
    });
  }
  
  // Sort by amount descending
  return subscriptions.sort((a, b) => b.amount - a.amount);
}

