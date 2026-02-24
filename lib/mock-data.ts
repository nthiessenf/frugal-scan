import { AnalysisResult, CategorizedTransaction, CategoryBreakdown, Insight, SavingsTip, Subscription, Category, TopMerchant, SpendingSummary } from '@/types';

// Base mock transactions used by the existing \"Load Mock Data\" dev button
// (kept for backwards compatibility)
const mockTransactions: CategorizedTransaction[] = [
  // Dining Out
  { date: '2025-01-03', description: 'CHIPOTLE 1234', amount: 12.45, type: 'debit', category: 'food_dining', merchant: 'Chipotle', confidence: 0.95, isRecurring: false, needsReview: false },
  { date: '2025-01-05', description: 'STARBUCKS STORE 5678', amount: 6.75, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.98, isRecurring: true, needsReview: false },
  { date: '2025-01-07', description: 'UBER EATS', amount: 34.20, type: 'debit', category: 'food_dining', merchant: 'Uber Eats', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-08', description: 'STARBUCKS STORE 5678', amount: 5.50, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.98, isRecurring: true, needsReview: false },
  { date: '2025-01-10', description: 'CHICK-FIL-A #2341', amount: 11.23, type: 'debit', category: 'food_dining', merchant: 'Chick-fil-A', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-12', description: 'DOMINOS PIZZA', amount: 24.99, type: 'debit', category: 'food_dining', merchant: 'Dominos Pizza', confidence: 0.96, isRecurring: false, needsReview: false },
  { date: '2025-01-14', description: 'STARBUCKS STORE 5678', amount: 7.25, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.98, isRecurring: true, needsReview: false },
  { date: '2025-01-15', description: 'THE CHEESECAKE FACTORY', amount: 67.84, type: 'debit', category: 'food_dining', merchant: 'Cheesecake Factory', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-18', description: 'MCDONALDS F1234', amount: 8.99, type: 'debit', category: 'food_dining', merchant: 'McDonalds', confidence: 0.95, isRecurring: false, needsReview: false },
  { date: '2025-01-20', description: 'STARBUCKS STORE 5678', amount: 6.50, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.98, isRecurring: true, needsReview: false },
  
  // Groceries
  { date: '2025-01-02', description: 'WHOLE FOODS MKT', amount: 87.34, type: 'debit', category: 'groceries', merchant: 'Whole Foods', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-06', description: 'HEB GROCERY #234', amount: 124.56, type: 'debit', category: 'groceries', merchant: 'HEB', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-09', description: 'TRADER JOES #567', amount: 67.89, type: 'debit', category: 'groceries', merchant: 'Trader Joes', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-13', description: 'HEB GROCERY #234', amount: 98.23, type: 'debit', category: 'groceries', merchant: 'HEB', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-16', description: 'COSTCO WHSE #1234', amount: 234.67, type: 'debit', category: 'groceries', merchant: 'Costco', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-19', description: 'WHOLE FOODS MKT', amount: 54.32, type: 'debit', category: 'groceries', merchant: 'Whole Foods', confidence: 0.99, isRecurring: false, needsReview: false },
  
  // Shopping
  { date: '2025-01-04', description: 'AMAZON.COM*1A2B3C', amount: 45.99, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-08', description: 'TARGET 00012345', amount: 78.43, type: 'debit', category: 'shopping', merchant: 'Target', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-11', description: 'AMAZON.COM*4D5E6F', amount: 23.49, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-14', description: 'BEST BUY 00001234', amount: 149.99, type: 'debit', category: 'shopping', merchant: 'Best Buy', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-17', description: 'AMAZON.COM*7G8H9I', amount: 67.23, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  
  // Transportation
  { date: '2025-01-03', description: 'SHELL OIL 12345678', amount: 48.50, type: 'debit', category: 'transportation', merchant: 'Shell', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-07', description: 'UBER *TRIP', amount: 18.34, type: 'debit', category: 'transportation', merchant: 'Uber', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-10', description: 'EXXON MOBIL', amount: 52.30, type: 'debit', category: 'transportation', merchant: 'Exxon', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-15', description: 'UBER *TRIP', amount: 24.56, type: 'debit', category: 'transportation', merchant: 'Uber', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-18', description: 'JIFFY LUBE #1234', amount: 89.99, type: 'debit', category: 'transportation', merchant: 'Jiffy Lube', confidence: 0.96, isRecurring: false, needsReview: false },
  
  // Subscriptions
  { date: '2025-01-01', description: 'NETFLIX.COM', amount: 15.99, type: 'debit', category: 'subscriptions', merchant: 'Netflix', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-01', description: 'SPOTIFY USA', amount: 10.99, type: 'debit', category: 'subscriptions', merchant: 'Spotify', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-05', description: 'AMAZON PRIME*1A2B3C', amount: 14.99, type: 'debit', category: 'subscriptions', merchant: 'Amazon Prime', confidence: 0.98, isRecurring: true, needsReview: false },
  { date: '2025-01-08', description: 'OPENAI *CHATGPT', amount: 20.00, type: 'debit', category: 'subscriptions', merchant: 'ChatGPT Plus', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-12', description: 'ADOBE *CREATIVE', amount: 54.99, type: 'debit', category: 'subscriptions', merchant: 'Adobe Creative Cloud', confidence: 0.99, isRecurring: true, needsReview: false },
  
  // Bills & Utilities
  { date: '2025-01-05', description: 'AUSTIN ENERGY', amount: 145.67, type: 'debit', category: 'bills_utilities', merchant: 'Austin Energy', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-10', description: 'ATT*BILL PAYMENT', amount: 89.99, type: 'debit', category: 'bills_utilities', merchant: 'AT&T', confidence: 0.98, isRecurring: true, needsReview: false },
  { date: '2025-01-15', description: 'SPECTRUM CABLE', amount: 79.99, type: 'debit', category: 'bills_utilities', merchant: 'Spectrum', confidence: 0.97, isRecurring: true, needsReview: false },
  
  // Entertainment
  { date: '2025-01-06', description: 'AMC THEATRES', amount: 28.50, type: 'debit', category: 'entertainment', merchant: 'AMC Theatres', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-13', description: 'TOPGOLF AUSTIN', amount: 85.00, type: 'debit', category: 'entertainment', merchant: 'TopGolf', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-19', description: 'STUBHUB *TICKETS', amount: 156.00, type: 'debit', category: 'entertainment', merchant: 'StubHub', confidence: 0.99, isRecurring: false, needsReview: false },
  
  // Health & Fitness
  { date: '2025-01-01', description: 'EQUINOX MEMBERSHIP', amount: 189.00, type: 'debit', category: 'health_fitness', merchant: 'Equinox', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-08', description: 'CVS PHARMACY', amount: 34.56, type: 'debit', category: 'health_fitness', merchant: 'CVS Pharmacy', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-14', description: 'WALGREENS #1234', amount: 23.45, type: 'debit', category: 'health_fitness', merchant: 'Walgreens', confidence: 0.97, isRecurring: false, needsReview: false },
  
  // Income (credits)
  { date: '2025-01-15', description: 'EMPLOYER DIRECT DEP', amount: 4250.00, type: 'credit', category: 'income', merchant: 'Paycheck', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-20', description: 'VENMO CASHOUT', amount: 150.00, type: 'credit', category: 'income', merchant: 'Venmo', confidence: 0.95, isRecurring: false, needsReview: false },
];

// Calculate category breakdown from transactions
function calculateCategoryBreakdown(transactions: CategorizedTransaction[]): CategoryBreakdown[] {
  const categoryTotals: Record<Category, { amount: number; count: number }> = {} as Record<Category, { amount: number; count: number }>;

  transactions
    .filter(t => t.amount > 0 && t.type === 'debit' && t.category !== 'income' && t.category !== 'transfer')
    .forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { amount: 0, count: 0 };
      }
      categoryTotals[t.category].amount += t.amount;
      categoryTotals[t.category].count += 1;
    });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b.amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category: category as Category,
      amount: data.amount,
      percentage: (data.amount / totalSpent) * 100,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Calculate top merchants
function calculateTopMerchants(transactions: CategorizedTransaction[]): TopMerchant[] {
  const merchantTotals: Record<string, { amount: number; count: number; category: Category }> = {};

  transactions
    .filter(t => t.amount > 0 && t.type === 'debit' && t.category !== 'income' && t.category !== 'transfer')
    .forEach(t => {
      const name = t.merchant || t.description;
      if (!merchantTotals[name]) {
        merchantTotals[name] = { amount: 0, count: 0, category: t.category };
      }
      merchantTotals[name].amount += t.amount;
      merchantTotals[name].count += 1;
    });

  return Object.entries(merchantTotals)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      count: data.count,
      category: data.category,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
}

// Mock insights - updated to reflect metrics-driven format
const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    title: 'The Small Purchase Effect',
    description: 'Your 18 purchases under $10 added up to $127.43 this month. That\'s $1,529 per year—small swipes add up faster than you\'d think.',
    severity: 'info',
    category: undefined,
    amount: 127.43,
  },
  {
    id: 'insight-2',
    title: 'Your Coffee Ritual',
    description: 'You visited Starbucks 4 times this month, averaging $6.50 per visit. At $26/month, that\'s $312 annually—almost a nice dinner out every month.',
    severity: 'info',
    category: 'food_dining',
    amount: 26.00,
  },
  {
    id: 'insight-3',
    title: 'The Long Tail of Spending',
    description: 'While your top 10 merchants get the spotlight, 25 other merchants account for 31% of your spending—a reminder that small amounts add up.',
    severity: 'info',
    category: undefined,
    amount: undefined,
  },
  {
    id: 'insight-4',
    title: 'Dining Out vs Groceries',
    description: 'You spend $185.70 on dining out versus $667.01 on groceries—that\'s 0.28x the grocery budget. Dining out is 22% of your total food spending.',
    severity: 'info',
    category: 'food_dining',
    amount: 185.70,
  },
  {
    id: 'insight-5',
    title: 'Annual Subscription Cost',
    description: 'Your 5 subscriptions total $116.96/month. Projected annually, that\'s $1,403.52—enough for a nice vacation or emergency fund boost.',
    severity: 'warning',
    category: 'subscriptions',
    amount: 116.96,
  },
];

// Mock savings tips
const mockTips: SavingsTip[] = [
  {
    id: 'tip-1',
    title: 'Brew coffee at home 2x per week',
    description: 'Replacing 2 Starbucks trips with home coffee could save $50/month ($600/year).',
    potentialSavings: 50,
    difficulty: 'easy',
    timeframe: 'monthly',
  },
  {
    id: 'tip-2',
    title: 'Review Adobe subscription',
    description: 'At $54.99/month, check if you\'re using all Creative Cloud apps. Switching to single-app plan could save $35/month.',
    potentialSavings: 35,
    difficulty: 'medium',
    timeframe: 'monthly',
  },
  {
    id: 'tip-3',
    title: 'Consolidate streaming services',
    description: 'Netflix + Spotify + Prime = $41.97/month. Consider rotating services monthly instead of all at once.',
    potentialSavings: 25,
    difficulty: 'easy',
    timeframe: 'monthly',
  },
];

// Mock subscriptions
const mockSubscriptions: Subscription[] = [
  { name: 'Adobe Creative Cloud', amount: 54.99, frequency: 'monthly', lastCharge: '2025-01-12', category: 'software', confidence: 0.99 },
  { name: 'ChatGPT Plus', amount: 20.00, frequency: 'monthly', lastCharge: '2025-01-08', category: 'software', confidence: 0.99 },
  { name: 'Netflix', amount: 15.99, frequency: 'monthly', lastCharge: '2025-01-01', category: 'streaming', confidence: 0.99 },
  { name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', lastCharge: '2025-01-05', category: 'streaming', confidence: 0.98 },
  { name: 'Spotify', amount: 10.99, frequency: 'monthly', lastCharge: '2025-01-01', category: 'streaming', confidence: 0.99 },
];

// Calculate summary statistics
function calculateSummary(transactions: CategorizedTransaction[]): SpendingSummary {
  const debits = transactions.filter(t => t.type === 'debit' && t.category !== 'income' && t.category !== 'transfer');
  const credits = transactions.filter(t => t.type === 'credit' || t.category === 'income');
  
  const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalSpent;
  const averageTransaction = debits.length > 0 ? totalSpent / debits.length : 0;
  
  const categoryBreakdown = calculateCategoryBreakdown(transactions);
  const topCategory = categoryBreakdown[0]?.category || 'other';
  const topCategoryAmount = categoryBreakdown[0]?.amount || 0;
  
  const subscriptionTotal = mockSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  
  // Calculate period days (from first to last transaction)
  const dates = transactions.map(t => new Date(t.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const periodDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;
  
  return {
    totalSpent,
    totalIncome,
    netCashFlow,
    transactionCount: transactions.length,
    averageTransaction,
    topCategory,
    topCategoryAmount,
    subscriptionTotal,
    periodDays,
  };
}

// Main export: complete mock analysis result (existing dev mock)
export const mockAnalysisResult: AnalysisResult = {
  summary: calculateSummary(mockTransactions),
  categoryBreakdown: calculateCategoryBreakdown(mockTransactions),
  topMerchants: calculateTopMerchants(mockTransactions),
  subscriptions: mockSubscriptions,
  insights: mockInsights,
  tips: mockTips,
  generatedAt: new Date().toISOString(),
  transactions: mockTransactions,
};

// Also export the base arrays for anyone already importing them
export const MOCK_TRANSACTIONS = mockTransactions;
export const MOCK_SUBSCRIPTIONS = mockSubscriptions;

// ---------------------------------------------------------------------------
// Demo-specific dataset for interactive demo / sample analysis
// ---------------------------------------------------------------------------

// Rich, realistic demo dataset for a 30-year-old professional
// All dates are within January 2025
export const DEMO_TRANSACTIONS: CategorizedTransaction[] = [
  // Dining out - heavy spending
  { date: '2025-01-02', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 5.45, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-03', description: 'CHIPOTLE 1234 AUSTIN TX', amount: 13.85, type: 'debit', category: 'food_dining', merchant: 'Chipotle', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-04', description: 'DOORDASH *THAI KITCHEN', amount: 32.40, type: 'debit', category: 'food_dining', merchant: 'DoorDash - Thai Kitchen', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-05', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 4.95, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-06', description: 'LAUNDERETTE AUSTIN TX', amount: 48.60, type: 'debit', category: 'food_dining', merchant: 'Launderette', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-07', description: 'UBER EATS *PIZZA JONES', amount: 27.80, type: 'debit', category: 'food_dining', merchant: 'Uber Eats - Pizza Jones', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-08', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 6.15, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-09', description: 'CHIPOTLE 1234 AUSTIN TX', amount: 14.25, type: 'debit', category: 'food_dining', merchant: 'Chipotle', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-10', description: 'DOORDASH *RAMEN TATSU-YA', amount: 29.90, type: 'debit', category: 'food_dining', merchant: 'DoorDash - Ramen Tatsu-Ya', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-11', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 5.85, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-12', description: 'EL CARMELO TACOS AUSTIN TX', amount: 24.10, type: 'debit', category: 'food_dining', merchant: 'El Carmelo Tacos', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-14', description: 'UBER EATS *SUSHI HOUSE', amount: 38.75, type: 'debit', category: 'food_dining', merchant: 'Uber Eats - Sushi House', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-16', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 5.65, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-18', description: 'CHIPOTLE 1234 AUSTIN TX', amount: 12.95, type: 'debit', category: 'food_dining', merchant: 'Chipotle', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-20', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 6.25, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-22', description: 'DOORDASH *BURGER JOINT', amount: 31.60, type: 'debit', category: 'food_dining', merchant: 'DoorDash - Burger Joint', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-24', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 5.75, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-26', description: 'DATE NIGHT *ITALIAN PLACE', amount: 86.40, type: 'debit', category: 'food_dining', merchant: 'Vespaio', confidence: 0.96, isRecurring: false, needsReview: false },
  { date: '2025-01-29', description: 'STARBUCKS STORE 1024 AUSTIN TX', amount: 7.22, type: 'debit', category: 'food_dining', merchant: 'Starbucks', confidence: 0.99, isRecurring: true, needsReview: false },

  // Groceries - 2–3 main stores
  { date: '2025-01-03', description: 'WHOLE FOODS MKT AUSTIN TX', amount: 128.45, type: 'debit', category: 'groceries', merchant: 'Whole Foods', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-09', description: 'HEB GROCERY #234 AUSTIN TX', amount: 92.30, type: 'debit', category: 'groceries', merchant: 'HEB', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-15', description: 'TRADER JOES #567 AUSTIN TX', amount: 84.12, type: 'debit', category: 'groceries', merchant: 'Trader Joe\'s', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-21', description: 'HEB GROCERY #234 AUSTIN TX', amount: 103.77, type: 'debit', category: 'groceries', merchant: 'HEB', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-28', description: 'WHOLE FOODS MKT AUSTIN TX', amount: 74.88, type: 'debit', category: 'groceries', merchant: 'Whole Foods', confidence: 0.99, isRecurring: false, needsReview: false },

  // Amazon / shopping
  { date: '2025-01-05', description: 'AMAZON.COM*1A2B3C', amount: 62.49, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-12', description: 'AMAZON.COM*4D5E6F', amount: 47.35, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-19', description: 'AMAZON.COM*7G8H9I', amount: 89.90, type: 'debit', category: 'shopping', merchant: 'Amazon', confidence: 0.99, isRecurring: false, needsReview: false },
  { date: '2025-01-23', description: 'TARGET 00012345 AUSTIN TX', amount: 68.24, type: 'debit', category: 'shopping', merchant: 'Target', confidence: 0.98, isRecurring: false, needsReview: false },

  // Gas / transportation
  { date: '2025-01-04', description: 'SHELL OIL 12345678 AUSTIN TX', amount: 46.30, type: 'debit', category: 'transportation', merchant: 'Shell', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-13', description: 'EXXONMOBIL 00098765 AUSTIN TX', amount: 52.85, type: 'debit', category: 'transportation', merchant: 'Exxon', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-22', description: 'SHELL OIL 12345678 AUSTIN TX', amount: 51.90, type: 'debit', category: 'transportation', merchant: 'Shell', confidence: 0.98, isRecurring: false, needsReview: false },

  // Misc purchases
  { date: '2025-01-06', description: 'CVS PHARMACY 03124 AUSTIN TX', amount: 23.17, type: 'debit', category: 'health_fitness', merchant: 'CVS Pharmacy', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-17', description: 'WALGREENS #1234 AUSTIN TX', amount: 18.92, type: 'debit', category: 'health_fitness', merchant: 'Walgreens', confidence: 0.97, isRecurring: false, needsReview: false },
  { date: '2025-01-20', description: 'TARGET 00012345 AUSTIN TX', amount: 42.60, type: 'debit', category: 'shopping', merchant: 'Target', confidence: 0.98, isRecurring: false, needsReview: false },

  // Entertainment
  { date: '2025-01-11', description: 'ALAMO DRAFTHOUSE AUSTIN TX', amount: 38.50, type: 'debit', category: 'entertainment', merchant: 'Alamo Drafthouse', confidence: 0.98, isRecurring: false, needsReview: false },
  { date: '2025-01-25', description: 'STUBHUB *CONCERT TICKETS', amount: 124.00, type: 'debit', category: 'entertainment', merchant: 'StubHub', confidence: 0.99, isRecurring: false, needsReview: false },

  // Bills & utilities (for realism, though not core to the demo story)
  { date: '2025-01-05', description: 'AUSTIN ENERGY', amount: 132.41, type: 'debit', category: 'bills_utilities', merchant: 'Austin Energy', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-09', description: 'XFINITY MOBILE PAYMENT', amount: 72.84, type: 'debit', category: 'bills_utilities', merchant: 'Xfinity', confidence: 0.98, isRecurring: true, needsReview: false },

  // Subscriptions that add up
  { date: '2025-01-01', description: 'NETFLIX.COM', amount: 15.99, type: 'debit', category: 'subscriptions', merchant: 'Netflix', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-01', description: 'SPOTIFY USA', amount: 10.99, type: 'debit', category: 'subscriptions', merchant: 'Spotify', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-02', description: 'APPLE.COM/BILL *ICLOUD', amount: 2.99, type: 'debit', category: 'subscriptions', merchant: 'iCloud', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-03', description: 'NYTIMES SUBSCRIPTION', amount: 19.99, type: 'debit', category: 'subscriptions', merchant: 'New York Times', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-04', description: 'ADOBE *CREATIVE CLOUD', amount: 54.99, type: 'debit', category: 'subscriptions', merchant: 'Adobe Creative Cloud', confidence: 0.99, isRecurring: true, needsReview: false },
  { date: '2025-01-04', description: 'EQUINOX MEMBERSHIP', amount: 135.00, type: 'debit', category: 'health_fitness', merchant: 'Equinox', confidence: 0.99, isRecurring: true, needsReview: false },

  // No income in this demo (credit card view) – but include one small refund for realism
  { date: '2025-01-27', description: 'UBER EATS *REFUND', amount: 18.00, type: 'credit', category: 'income', merchant: 'Uber Eats', confidence: 0.96, isRecurring: false, needsReview: false },
];

// Demo subscriptions derived from DEMO_TRANSACTIONS
export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { name: 'Netflix', amount: 15.99, frequency: 'monthly', lastCharge: '2025-01-01', category: 'streaming', confidence: 0.99 },
  { name: 'Spotify', amount: 10.99, frequency: 'monthly', lastCharge: '2025-01-01', category: 'streaming', confidence: 0.99 },
  { name: 'iCloud', amount: 2.99, frequency: 'monthly', lastCharge: '2025-01-02', category: 'software', confidence: 0.99 },
  { name: 'New York Times', amount: 19.99, frequency: 'monthly', lastCharge: '2025-01-03', category: 'news', confidence: 0.99 },
  { name: 'Adobe Creative Cloud', amount: 54.99, frequency: 'monthly', lastCharge: '2025-01-04', category: 'software', confidence: 0.99 },
  { name: 'Equinox Membership', amount: 135.00, frequency: 'monthly', lastCharge: '2025-01-04', category: 'fitness', confidence: 0.99 },
];

// Demo insights that tell a compelling spending story
const demoInsights: Insight[] = [
  {
    id: 'demo-insight-1',
    title: 'Your Coffee Ritual Adds Up',
    description: 'You visited Starbucks 8 times this month, spending $47.92 in total. That\'s about $575 per year on coffee runs—roughly the cost of a weekend getaway.',
    severity: 'info',
    category: 'food_dining',
    amount: 47.92,
  },
  {
    id: 'demo-insight-2',
    title: 'Delivery Habit vs Groceries',
    description: 'You spent $163.65 on delivery (DoorDash & Uber Eats) across 4 orders, compared to $483.52 at grocery stores. Delivery is 25% of your total food spending for the month.',
    severity: 'warning',
    category: 'food_dining',
    amount: 163.65,
  },
  {
    id: 'demo-insight-3',
    title: 'Subscriptions: A Hidden $2400/Year',
    description: 'Your 6 subscriptions total $239.95 this month. Projected annually, that\'s $2,879—more than a full mortgage payment in many US cities.',
    severity: 'warning',
    category: 'subscriptions',
    amount: 239.95,
  },
  {
    id: 'demo-insight-4',
    title: 'Weekend Spending Spike',
    description: 'Weekend dining and entertainment (Friday–Sunday) totaled $612.47 this month—nearly 40% of your total spending—even though weekends are only 30% of the days.',
    severity: 'info',
    category: 'entertainment',
    amount: 612.47,
  },
  {
    id: 'demo-insight-5',
    title: 'Equinox Is a Top 3 Expense',
    description: 'Your Equinox membership at $135/month is one of your top three recurring charges, larger than your electricity and phone bills combined this month.',
    severity: 'info',
    category: 'health_fitness',
    amount: 135.0,
  },
];

// Demo savings tips tied to the actual merchants
const demoTips: SavingsTip[] = [
  {
    id: 'demo-tip-1',
    title: 'Swap 2 Delivery Nights for Groceries',
    description: 'Replacing two DoorDash/Uber Eats orders ($80–$90) with an extra grocery run could save you about $50/month—or $600/year—without giving up eating out entirely.',
    potentialSavings: 50,
    difficulty: 'medium',
    timeframe: 'monthly',
  },
  {
    id: 'demo-tip-2',
    title: 'Audit Your Creative + News Subscriptions',
    description: 'Adobe Creative Cloud ($54.99) and New York Times ($19.99) together cost $75/month. If you use them less than weekly, consider switching to a cheaper Adobe plan and pausing NYT for 3–6 months.',
    potentialSavings: 40,
    difficulty: 'medium',
    timeframe: 'monthly',
  },
  {
    id: 'demo-tip-3',
    title: 'Right-Size Equinox',
    description: 'If you visit Equinox fewer than 8 times a month, dropping to a cheaper gym at half the price could save ~$70/month—over $800/year—while still keeping you active.',
    potentialSavings: 70,
    difficulty: 'hard',
    timeframe: 'monthly',
  },
  {
    id: 'demo-tip-4',
    title: 'Set a Starbucks Budget',
    description: 'Capping Starbucks at $30/month (about 5 drinks) would reduce your coffee spend by ~$18/month compared to this statement—enough to cover your iCloud and Spotify subscriptions.',
    potentialSavings: 18,
    difficulty: 'easy',
    timeframe: 'monthly',
  },
];

function calculateDemoSummary(transactions: CategorizedTransaction[], subscriptions: Subscription[]): SpendingSummary {
  const debits = transactions.filter(t => t.type === 'debit' && t.category !== 'income' && t.category !== 'transfer');
  const credits = transactions.filter(t => t.type === 'credit' || t.category === 'income');

  const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalSpent;
  const averageTransaction = debits.length > 0 ? totalSpent / debits.length : 0;

  const categoryBreakdown = calculateCategoryBreakdown(transactions);
  const topCategory = categoryBreakdown[0]?.category || 'other';
  const topCategoryAmount = categoryBreakdown[0]?.amount || 0;

  const subscriptionTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  // Period: full calendar month of January 2025
  const periodDays = 31;

  return {
    totalSpent,
    totalIncome,
    netCashFlow,
    transactionCount: transactions.length,
    averageTransaction,
    topCategory,
    topCategoryAmount,
    subscriptionTotal,
    periodDays,
  };
}

function buildDemoAnalysisResult(): AnalysisResult {
  const summary = calculateDemoSummary(DEMO_TRANSACTIONS, DEMO_SUBSCRIPTIONS);
  const categoryBreakdown = calculateCategoryBreakdown(DEMO_TRANSACTIONS);
  const topMerchants = calculateTopMerchants(DEMO_TRANSACTIONS);

  return {
    summary,
    categoryBreakdown,
    topMerchants,
    subscriptions: DEMO_SUBSCRIPTIONS,
    insights: demoInsights,
    tips: demoTips,
    generatedAt: '2025-02-01T12:00:00.000Z',
    transactions: DEMO_TRANSACTIONS,
  };
}

export const DEMO_ANALYSIS_RESULT: AnalysisResult = buildDemoAnalysisResult();

export function getDemoAnalysisResult(): AnalysisResult {
  return DEMO_ANALYSIS_RESULT;
}


