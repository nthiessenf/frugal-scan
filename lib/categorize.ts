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
    'brightwheel': { category: 'other', minAmount: 100 },
  };

  // Explicitly NOT subscriptions (blacklist)
  const notSubscriptions = [
    'amex travel', 'chase travel', 'hotel', 'airline', 'airbnb', 'vrbo',
    'restaurant', 'cafe', 'coffee', 'grocery', 'target', 'walmart', 'amazon',
    'best buy', 'gas', 'shell', 'chevron', 'uber', 'lyft', 'doordash',
    'grubhub', 'houndstooth', 'faherty', 'four seasons', 'toyota', 'insurance',
    'electric', 'water', 'rent', 'mortgage', 'us mobile', 'at&t', 'verizon',
    't-mobile', 'comcast', 'spectrum',
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
      name: mostRecent.merchant,
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

