import { RawTransaction, CategorizedTransaction, Category, Subscription } from '@/types';
import { MERCHANT_KEYWORDS } from './constants';

// Clean up messy merchant names from bank statements
export function cleanMerchantName(description: string): string {
  let name = description;

  // Step 1: Remove common payment prefixes (case-insensitive)
  const prefixPatterns = [
    /^APLPAY\s+/i,
    /^APPLE PAY\s+/i,
    /^SQ\s*\*\s*/i,
    /^SQU\*\s*/i,
    /^TST\*\s*/i,
    /^PP\*\s*/i,
    /^PAYPAL\s*\*?\s*/i,
    /^SP\s+/i,
    /^POS\s+(DEBIT\s+|PURCHASE\s+)?/i,
    /^DEBIT\s+(CARD\s+)?/i,
    /^PURCHASE\s+/i,
    /^CHECKCARD\s+\d*\s*/i,
    /^ACH\s+(DEBIT\s+|CREDIT\s+)?/i,
    /^RECURRING\s+/i,
    /^AUTOPAY\s+/i,
    /^VISA\s+/i,
    /^MASTERCARD\s+/i,
    /^AMEX\s+/i,
  ];

  for (const pattern of prefixPatterns) {
    name = name.replace(pattern, '');
  }

  // Step 2: Remove asterisk followed by anything (e.g., "M*", "*5s76hpyc9bxf")
  name = name.replace(/\s*\*[^\s]*\s*/g, ' ');
  name = name.replace(/\*+/g, ' ');

  // Step 3: Remove phone numbers
  name = name.replace(/\+?1?\d{10,}/g, '');
  name = name.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '');

  // Step 4: Remove toll-free numbers and their prefixes (888bestbuy, 800-, etc.)
  name = name.replace(/\b(888|877|800|866|855)[a-zA-Z0-9]+\b/gi, '');
  name = name.replace(/\b(888|877|800|866|855)[-\s]?\d+\b/g, '');

  // Step 5: Remove URL patterns
  name = name.replace(/https?:\/\/[^\s]+/gi, '');
  name = name.replace(/www\.[^\s]+/gi, '');
  name = name.replace(/\.com\/[^\s]*/gi, '');
  name = name.replace(/\.com\b/gi, '');
  name = name.replace(/\.net\b/gi, '');
  name = name.replace(/\.org\b/gi, '');
  name = name.replace(/\/bill\b/gi, '');

  // Step 6: Remove common junk words
  name = name.replace(/\bsubscr(iption)?\b/gi, '');
  name = name.replace(/\bpurchase\b/gi, '');
  name = name.replace(/\bpayment\b/gi, '');
  name = name.replace(/\bmerchandise\b/gi, '');
  name = name.replace(/\bna pa\b/gi, '');
  name = name.replace(/\binc\.?\b/gi, '');
  name = name.replace(/\bllc\.?\b/gi, '');
  name = name.replace(/\bcorp\.?\b/gi, '');

  // Step 7: Remove zip codes (5 digits, optionally with +4)
  name = name.replace(/\b\d{5}(-\d{4})?\b/g, '');

  // Step 8: Remove state abbreviations (2 capital letters at word boundary, common ones)
  const states = 'AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC';
  name = name.replace(new RegExp(`\\b(${states})\\b`, 'g'), '');

  // Step 9: Remove common city names (after merchant name)
  const cities = [
    'Austin', 'Houston', 'Dallas', 'San Antonio', 'Round Rock', 'Cedar Park',
    'New York', 'Los Angeles', 'Chicago', 'Phoenix', 'Seattle', 'Denver',
    'Boston', 'Atlanta', 'Miami', 'Portland', 'San Francisco', 'San Diego',
    'Fremont', 'San Jose', 'Palo Alto', 'Mountain View', 'Cupertino',
  ].join('|');
  name = name.replace(new RegExp(`\\b(${cities})\\b`, 'gi'), '');

  // Step 10: Remove reference numbers (sequences of 6+ digits)
  name = name.replace(/\b\d{6,}\b/g, '');
  name = name.replace(/#\d+/g, '');

  // Step 11: Clean up whitespace, dashes, and special characters
  name = name.replace(/[-–—]+/g, ' ');
  name = name.replace(/\s+/g, ' ');
  name = name.trim();
  name = name.replace(/^[^a-zA-Z0-9]+/, '');
  name = name.replace(/[^a-zA-Z0-9'&]+$/, '');

  // Step 12: Handle known abbreviations (very conservative - only unreadable ones)
  const abbreviations: Record<string, string> = {
    'BRGHTWHL': 'Brightwheel',
    'AMZN': 'Amazon',
    'AMZN MKTP': 'Amazon',
    'AMAZON MARKETPLACE': 'Amazon',
    'AMAZON MKTPLACE': 'Amazon',
    'WM SUPERCENTER': 'Walmart',
    'WALMRT': 'Walmart',
    'WHOLEFDS': 'Whole Foods',
    'WHOLEFOODS': 'Whole Foods',
    'SBUX': 'Starbucks',
    'CHKFILA': 'Chick-fil-A',
    'CHICKFILA': 'Chick-fil-A',
    'MCDONALD': "McDonald's",
    'CVS/PHARM': 'CVS',
    'WALGREEN': 'Walgreens',
    'TST': 'Toast',
    'HEB': 'H-E-B',
    'H E B': 'H-E-B',
  };

  const upperName = name.toUpperCase().trim();
  for (const [abbrev, fullName] of Object.entries(abbreviations)) {
    if (upperName === abbrev) {
      return fullName;
    }
    if (upperName.startsWith(abbrev + ' ')) {
      name = fullName + name.substring(abbrev.length);
      break;
    }
    // Also check if the abbreviation appears at the start
    if (upperName.startsWith(abbrev)) {
      name = fullName + name.substring(abbrev.length);
      break;
    }
  }

  // Step 13: Title case
  name = name
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map((word, index) => {
      if (index > 0 && ['and', 'the', 'of', 'in', 'at', 'by', 'for'].includes(word)) {
        return word;
      }
      if (word.length <= 2 && word.toUpperCase() === word) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  // Step 14: Remove duplicate words (e.g., "Austin Austin")
  const words = name.split(' ');
  const deduped: string[] = [];
  for (const word of words) {
    if (deduped.length === 0 || deduped[deduped.length - 1].toLowerCase() !== word.toLowerCase()) {
      deduped.push(word);
    }
  }
  name = deduped.join(' ');

  // Step 15: Limit length
  if (name.length > 30) {
    const truncated = name.substring(0, 30);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 10) {
      name = truncated.substring(0, lastSpace);
    } else {
      name = truncated;
    }
  }

  // Step 16: Final cleanup
  name = name.trim();
  
  return name || 'Unknown';
}

// Determine category based on merchant keywords
export function categorizeTransaction(transaction: RawTransaction): CategorizedTransaction {
  const merchant = cleanMerchantName(transaction.description);
  const lowerMerchant = merchant.toLowerCase();
  const lowerDesc = transaction.description.toLowerCase();

  // Check for income first (credits are often income)
  if (transaction.type === 'credit') {
    const incomeKeywords = ['payroll', 'direct deposit', 'salary', 'refund', 'cashback', 'cash back', 'rebate', 'reimbursement', 'payment received', 'thank you'];
    if (incomeKeywords.some(kw => lowerDesc.includes(kw))) {
      return {
        ...transaction,
        category: 'income',
        merchant,
        isRecurring: false,
        needsReview: transaction.confidence < 0.8,
      };
    }
  }

  // Check both cleaned merchant name AND original description against keywords
  for (const [keyword, category] of Object.entries(MERCHANT_KEYWORDS)) {
    if (lowerMerchant.includes(keyword) || lowerDesc.includes(keyword)) {
      return {
        ...transaction,
        category,
        merchant,
        isRecurring: category === 'subscriptions',
        needsReview: transaction.confidence < 0.8,
      };
    }
  }

  // Default to other
  return {
    ...transaction,
    category: 'other',
    merchant,
    isRecurring: false,
    needsReview: true, // Flag uncategorized for potential review
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
  // Known subscription services (whitelist approach for accuracy)
  const knownSubscriptions: Record<string, { category: Subscription['category'], minAmount?: number }> = {
    'netflix': { category: 'streaming' },
    'spotify': { category: 'streaming' },
    'hulu': { category: 'streaming' },
    'disney': { category: 'streaming' },
    'hbo': { category: 'streaming' },
    'apple tv': { category: 'streaming' },
    'apple music': { category: 'streaming' },
    'apple one': { category: 'streaming' },
    'youtube premium': { category: 'streaming' },
    'amazon prime': { category: 'streaming' },
    'audible': { category: 'streaming' },
    'paramount': { category: 'streaming' },
    'peacock': { category: 'streaming' },
    'espn': { category: 'streaming' },
    'adobe': { category: 'software' },
    'microsoft 365': { category: 'software' },
    'dropbox': { category: 'software' },
    'icloud': { category: 'software' },
    'google one': { category: 'software' },
    'chatgpt': { category: 'software' },
    'openai': { category: 'software' },
    'notion': { category: 'software' },
    'figma': { category: 'software' },
    'canva': { category: 'software' },
    'github': { category: 'software' },
    '1password': { category: 'software' },
    'nordvpn': { category: 'software' },
    'planet fitness': { category: 'fitness' },
    'equinox': { category: 'fitness' },
    'orangetheory': { category: 'fitness' },
    'peloton': { category: 'fitness' },
    'ymca': { category: 'fitness' },
    'nytimes': { category: 'news' },
    'new york times': { category: 'news' },
    'wsj': { category: 'news' },
    'washington post': { category: 'news' },
    'the athletic': { category: 'news' },
    'xbox': { category: 'gaming' },
    'playstation': { category: 'gaming' },
    'nintendo': { category: 'gaming' },
    'game pass': { category: 'gaming' },
  };

  // Explicitly NOT subscriptions (blacklist)
  const notSubscriptions = [
    'amex travel', 'chase travel', 'hotel', 'airline', 'airbnb', 'vrbo',
    'restaurant', 'cafe', 'coffee', 'grocery', 'target', 'walmart', 'amazon',
    'best buy', 'gas', 'shell', 'chevron', 'uber', 'lyft', 'doordash',
    'grubhub', 'houndstooth', 'faherty', 'four seasons', 'toyota', 'insurance',
    'electric', 'water', 'rent', 'mortgage', 'us mobile', 'at&t', 'verizon',
    't-mobile', 'comcast', 'spectrum',
    // Education & Childcare - not discretionary
    'brightwheel', 'daycare', 'childcare', 'preschool', 'school', 'tuition',
    // Other non-discretionary
    'medical', 'doctor', 'hospital', 'pharmacy', 'cvs', 'walgreens',
  ];

  const subscriptions: Subscription[] = [];
  const merchantGroups: Map<string, CategorizedTransaction[]> = new Map();

  // Group debit transactions by merchant
  transactions
    .filter(t => t.type === 'debit')
    .forEach(t => {
      const key = t.merchant.toLowerCase();

      // Skip if in blacklist
      if (notSubscriptions.some(ns => key.includes(ns))) {
        return;
      }

      if (!merchantGroups.has(key)) {
        merchantGroups.set(key, []);
      }
      merchantGroups.get(key)!.push(t);
    });

  // Analyze each merchant group
  merchantGroups.forEach((txns, merchantKey) => {
    let subscriptionCategory: Subscription['category'] | null = null;
    let minAmount = 0;

    // Check if it's a known subscription
    for (const [known, config] of Object.entries(knownSubscriptions)) {
      if (merchantKey.includes(known)) {
        subscriptionCategory = config.category;
        minAmount = config.minAmount || 0;
        break;
      }
    }

    // If not a known subscription, skip (be conservative)
    if (!subscriptionCategory) {
      return;
    }

    // Get the most recent transaction
    const sortedTxns = [...txns].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const mostRecent = sortedTxns[0];

    // Skip if below minimum amount
    if (mostRecent.amount < minAmount) {
      return;
    }

    subscriptions.push({
      name: cleanMerchantName(mostRecent.description),
      amount: mostRecent.amount,
      frequency: 'monthly',
      lastCharge: mostRecent.date,
      category: subscriptionCategory,
      confidence: txns.length >= 2 ? 0.9 : 0.7,
    });
  });

  // Sort by amount descending (highest subscriptions first)
  return subscriptions.sort((a, b) => b.amount - a.amount);
}

