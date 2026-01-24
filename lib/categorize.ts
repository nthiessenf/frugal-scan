import { RawTransaction, CategorizedTransaction, Category, Subscription } from '@/types';
import { MERCHANT_KEYWORDS } from './constants';

// Clean up messy merchant names from bank statements
export function cleanMerchantName(description: string): string {
  let name = description;
  
  // Step 1: Remove common payment prefixes
  const prefixes = [
    'APLPAY ', 'APPLE PAY ', 'APPLEPAY ',
    'SQ *', 'SQU*', 'SQUARE ', 
    'TST* ', 'TST ', 'TST*',
    'PP*', 'PAYPAL *', 'PAYPAL*',
    'SP ', 'SP* ', 'SQ ',
    'POS ', 'POS DEBIT ', 'POS PURCHASE ',
    'DEBIT ', 'PURCHASE ', 'CHECKCARD ',
    'ACH ', 'ACH DEBIT ', 'ACH CREDIT ',
    'RECURRING ', 'AUTOPAY ',
    'VISA ', 'MASTERCARD ', 'AMEX ',
    'CREDIT CARD ', 'DEBIT CARD ',
  ];
  
  for (const prefix of prefixes) {
    if (name.toUpperCase().startsWith(prefix)) {
      name = name.substring(prefix.length);
    }
  }
  
  // Step 2: Remove trailing location info (city, state, zip patterns)
  // Remove zip codes (5 digits or 5+4 format)
  name = name.replace(/\s+\d{5}(-\d{4})?\s*$/g, '');
  name = name.replace(/\s+\d{5,}\s*\d*\s*$/g, ''); // Multiple number sequences at end
  
  // Remove state abbreviations at the end (e.g., "TX", "CA", "NY")
  name = name.replace(/\s+[A-Z]{2}\s*$/g, '');
  
  // Remove city + state patterns (e.g., "Austin TX", "New York NY")
  name = name.replace(/\s+(Austin|Houston|Dallas|San Antonio|Round Rock|Cedar Park|Fremont|New York|Los Angeles|Chicago|Phoenix|Seattle|Denver|Boston|Atlanta|Miami|Portland|San Francisco|San Diego|Las Vegas|Orlando|Tampa|Nashville|Charlotte|Minneapolis|Detroit|Cleveland|Pittsburgh|Baltimore|Philadelphia|Washington|Richmond|Raleigh|Durham|Kansas City|St Louis|Indianapolis|Columbus|Cincinnati|Milwaukee|Sacramento|San Jose|Oakland|Berkeley|Palo Alto|Mountain View|Sunnyvale|Cupertino|Santa Clara|Menlo Park|Redwood City|Foster City|Burlingame|San Mateo|Daly City|South San Francisco|Emeryville|Alameda|Hayward|Fremont|Newark|Union City|Milpitas|Santa Cruz|Monterey|Carmel|Salinas|Fresno|Bakersfield|Modesto|Stockton|Riverside|Anaheim|Irvine|Long Beach|Pasadena|Glendale|Burbank|Santa Monica|Venice|Malibu|Beverly Hills|Hollywood|West Hollywood|Culver City|Inglewood|Torrance|Huntington Beach|Newport Beach|Laguna Beach|Costa Mesa|Santa Ana|Garden Grove|Fullerton|Ontario|Pomona|Rancho Cucamonga|Fontana|Moreno Valley|Corona|Temecula|Murrieta|Oceanside|Carlsbad|Escondido|El Cajon|Chula Vista|National City|Imperial Beach)\s+[A-Z]{2}\s*$/gi, '');
  
  // Remove common suffixes
  const suffixes = [
    ' 888BESTBUY', ' 800-', ' 888-', ' 877-', ' 866-',
    ' WWW.', ' HTTP', ' .COM', ' .NET', ' .ORG',
    ' MERCHANDISE', ' PAYMENT', ' PURCHASE',
    ' /BILL', ' NA PA', ' NA ', 
    ' INSURANCE SALES', ' SALES',
    ' + ', ' # ', ' #',
  ];
  
  for (const suffix of suffixes) {
    const idx = name.toUpperCase().indexOf(suffix);
    if (idx > 3) { // Keep at least some characters
      name = name.substring(0, idx);
    }
  }
  
  // Step 3: Remove reference numbers (sequences of 6+ digits)
  name = name.replace(/\s+\d{6,}\s*/g, ' ');
  name = name.replace(/\s*#\d+/g, '');
  name = name.replace(/\s+-\s+\d+/g, '');
  
  // Step 4: Clean up extra whitespace and special characters
  name = name.replace(/\s+/g, ' ').trim();
  name = name.replace(/^[^a-zA-Z0-9]+/, ''); // Remove leading special chars
  name = name.replace(/[^a-zA-Z0-9]+$/, ''); // Remove trailing special chars
  
  // Step 5: Handle specific known merchants that come through badly
  const merchantMappings: Record<string, string> = {
    'TST': 'Toast Restaurant',
    'TSTA': 'Toast Restaurant', 
    'BRGHTWHL': 'Brightwheel',
    'BRGHTWHL M': 'Brightwheel',
    'BRGHTWHEEL': 'Brightwheel',
    'HEB': 'H-E-B',
    'H-E-B': 'H-E-B',
    'AMZN': 'Amazon',
    'AMAZON MARKETPLACE': 'Amazon',
    'AMAZON MKTPLACE': 'Amazon',
    'AMZN MKTP': 'Amazon',
    'WHOLEFDS': 'Whole Foods',
    'WHOLE FOODS': 'Whole Foods',
    'WHOLEFOODS': 'Whole Foods',
    'CHICK-FIL': 'Chick-fil-A',
    'CHICKFILA': 'Chick-fil-A',
    'MCDONALDS': "McDonald's",
    'MCDONALD\'S': "McDonald's",
    'STARBUCKS': 'Starbucks',
    'SBUX': 'Starbucks',
    'WALGREENS': 'Walgreens',
    'WALGREE': 'Walgreens',
    'CVS': 'CVS Pharmacy',
    'CVS/PHARM': 'CVS Pharmacy',
    'TARGET': 'Target',
    'TARGT': 'Target',
    'WALMART': 'Walmart',
    'WAL-MART': 'Walmart',
    'COSTCO': 'Costco',
    'COSTCO WHSE': 'Costco',
    'UBER EATS': 'Uber Eats',
    'UBEREATS': 'Uber Eats',
    'UBER': 'Uber',
    'LYFT': 'Lyft',
    'DOORDASH': 'DoorDash',
    'GRUBHUB': 'Grubhub',
    'POSTMATES': 'Postmates',
    'NETFLIX': 'Netflix',
    'SPOTIFY': 'Spotify',
    'HULU': 'Hulu',
    'DISNEY PLUS': 'Disney+',
    'DISNEY+': 'Disney+',
    'APPLE.COM': 'Apple',
    'APLPAY APPLE': 'Apple',
    'GOOGLE': 'Google',
    'MICROSOFT': 'Microsoft',
    'ADOBE': 'Adobe',
    'DROPBOX': 'Dropbox',
  };
  
  // Check if cleaned name matches a known mapping
  const upperName = name.toUpperCase().trim();
  for (const [key, value] of Object.entries(merchantMappings)) {
    if (upperName === key || upperName.startsWith(key + ' ')) {
      return value;
    }
  }
  
  // Step 6: Title case the result
  name = name
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Keep certain words lowercase
      if (['and', 'the', 'of', 'in', 'at', 'by', 'for'].includes(word) && name.indexOf(word) !== 0) {
        return word;
      }
      // Keep abbreviations uppercase
      if (word.length <= 2) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  
  // Step 7: Final cleanup - limit length
  if (name.length > 30) {
    // Try to cut at a word boundary
    const truncated = name.substring(0, 30);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 15) {
      name = truncated.substring(0, lastSpace);
    } else {
      name = truncated;
    }
  }
  
  return name || 'Unknown Merchant';
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

