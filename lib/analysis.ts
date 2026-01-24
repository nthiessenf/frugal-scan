import { 
  CategorizedTransaction, 
  Subscription, 
  SpendingSummary, 
  CategoryBreakdown, 
  TopMerchant,
  Category 
} from '@/types';
import { CATEGORIES } from './constants';

// Calculate high-level spending summary
export function calculateSummary(
  transactions: CategorizedTransaction[], 
  subscriptions: Subscription[]
): SpendingSummary {
  const debits = transactions.filter(t => t.type === 'debit');
  const credits = transactions.filter(t => t.type === 'credit');
  
  const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalSpent;
  
  const transactionCount = transactions.length;
  const averageTransaction = debits.length > 0 ? totalSpent / debits.length : 0;
  
  // Find top spending category (exclude income and transfer)
  const categoryTotals = new Map<Category, number>();
  for (const t of debits) {
    if (t.category !== 'income' && t.category !== 'transfer') {
      categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
    }
  }
  
  let topCategory: Category = 'other';
  let topCategoryAmount = 0;
  for (const [category, amount] of categoryTotals) {
    if (amount > topCategoryAmount) {
      topCategory = category;
      topCategoryAmount = amount;
    }
  }
  
  // Calculate subscription total (monthly equivalent)
  const subscriptionTotal = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'yearly') return sum + sub.amount / 12;
    if (sub.frequency === 'weekly') return sum + sub.amount * 4;
    return sum + sub.amount;
  }, 0);
  
  // Calculate period days
  const dates = transactions.map(t => new Date(t.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const periodDays = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
  
  return {
    totalSpent,
    totalIncome,
    netCashFlow,
    transactionCount,
    averageTransaction,
    topCategory,
    topCategoryAmount,
    subscriptionTotal,
    periodDays,
  };
}

// Get spending breakdown by category
export function getCategoryBreakdown(transactions: CategorizedTransaction[]): CategoryBreakdown[] {
  const debits = transactions.filter(t => t.type === 'debit');
  const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals = new Map<Category, { amount: number; count: number }>();
  
  for (const t of debits) {
    const current = categoryTotals.get(t.category) || { amount: 0, count: 0 };
    categoryTotals.set(t.category, {
      amount: current.amount + t.amount,
      count: current.count + 1,
    });
  }
  
  const breakdown: CategoryBreakdown[] = [];
  
  for (const [category, data] of categoryTotals) {
    // Skip income and transfer for spending breakdown
    if (category === 'income' || category === 'transfer') continue;
    
    breakdown.push({
      category,
      amount: data.amount,
      percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0,
      transactionCount: data.count,
    });
  }
  
  // Sort by amount descending
  return breakdown.sort((a, b) => b.amount - a.amount);
}

// Get top merchants by spending
export function getTopMerchants(
  transactions: CategorizedTransaction[], 
  limit: number = 10
): TopMerchant[] {
  const debits = transactions.filter(t => t.type === 'debit');
  
  const merchantTotals = new Map<string, { amount: number; count: number; category: Category }>();
  
  for (const t of debits) {
    const key = t.merchant.toLowerCase();
    const current = merchantTotals.get(key) || { amount: 0, count: 0, category: t.category };
    merchantTotals.set(key, {
      amount: current.amount + t.amount,
      count: current.count + 1,
      category: current.category,
    });
  }
  
  const merchants: TopMerchant[] = [];
  
  for (const [name, data] of merchantTotals) {
    merchants.push({
      name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      amount: data.amount,
      count: data.count,
      category: data.category,
    });
  }
  
  // Sort by amount descending and return top N
  return merchants.sort((a, b) => b.amount - a.amount).slice(0, limit);
}

// Helper to get category label
export function getCategoryLabel(category: Category): string {
  const info = CATEGORIES.find(c => c.id === category);
  return info?.label || 'Other';
}

// Helper to get category color
export function getCategoryColor(category: Category): string {
  const info = CATEGORIES.find(c => c.id === category);
  return info?.color || '#64748b';
}

