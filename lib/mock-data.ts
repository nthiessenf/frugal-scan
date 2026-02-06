import { AnalysisResult, CategorizedTransaction, CategoryBreakdown, Insight, SavingsTip, Subscription, Category, TopMerchant, SpendingSummary } from '@/types';

// Realistic mock transactions (mimics a real bank statement)
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

// Main export: complete mock analysis result
// Note: transactions field is added for drill-down feature, extending the base AnalysisResult type
export const mockAnalysisResult: AnalysisResult & { transactions: CategorizedTransaction[] } = {
  summary: calculateSummary(mockTransactions),
  categoryBreakdown: calculateCategoryBreakdown(mockTransactions),
  topMerchants: calculateTopMerchants(mockTransactions),
  subscriptions: mockSubscriptions,
  insights: mockInsights,
  tips: mockTips,
  generatedAt: new Date().toISOString(),
  transactions: mockTransactions,
};

