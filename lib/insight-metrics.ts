import { CategorizedTransaction, Category, Subscription } from '@/types';
import { CATEGORIES, MONEY_LEAK_KEYWORDS } from './constants';

export interface InsightMetrics {
  // Frequency analysis
  merchantFrequency: { name: string; visits: number; total: number; avgPerVisit: number }[];
  mostFrequentMerchant: { name: string; visits: number; total: number };
  
  // Small purchases (the "it's just $5" effect)
  smallPurchases: { 
    under5: { count: number; total: number };
    under10: { count: number; total: number };
    under20: { count: number; total: number };
  };
  
  // Long tail analysis
  longTail: {
    merchantsOutsideTop10: number;
    spendingOutsideTop10: number;
    percentageOutsideTop10: number;
  };
  
  // Category relationships
  categoryRatios: {
    diningVsGroceries: number | null;  // e.g., 2.5 means dining is 2.5x groceries
    discretionaryPercent: number;       // % of spending on non-essentials
  };
  
  // Transaction patterns
  largestTransaction: { merchant: string; amount: number };
  averageTransactionByCategory: { category: string; average: number }[];
  
  // Annualized projections
  projectedAnnual: {
    totalSpending: number;
    subscriptions: number;
    topCategory: { name: string; annual: number };
  };

  // Money leaks (fee-type transactions regardless of category)
  moneyLeaks: {
    items: { merchant: string; amount: number; type: string; label: string; date: string }[];
    totalAmount: number;
    projectedAnnual: number;
  };

  // Spending by day of week
  dayOfWeek: {
    breakdown: { day: string; total: number; count: number; average: number }[];
    highestDay: { day: string; total: number };
    lowestDay: { day: string; total: number };
    weekendTotal: number;
    weekdayTotal: number;
    weekendVsWeekdayRatio: number | null;
  };

  // Top 10 largest individual debits
  topLargestTransactions: { merchant: string; amount: number; date: string; category: string }[];
}

// Categories considered "essential" vs "discretionary"
const ESSENTIAL_CATEGORIES: Category[] = ['groceries', 'bills_utilities', 'transportation', 'health_fitness'];
const DISCRETIONARY_CATEGORIES: Category[] = ['food_dining', 'shopping', 'entertainment', 'subscriptions', 'travel'];

export function calculateInsightMetrics(
  transactions: CategorizedTransaction[],
  subscriptions: Subscription[],
  periodDays: number
): InsightMetrics {
  const debits = transactions.filter(t => t.type === 'debit');
  const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
  
  // Merchant frequency analysis
  const merchantMap = new Map<string, { visits: number; total: number }>();
  
  debits.forEach(t => {
    const key = t.merchant.toLowerCase();
    const current = merchantMap.get(key) || { visits: 0, total: 0 };
    merchantMap.set(key, {
      visits: current.visits + 1,
      total: current.total + t.amount,
    });
  });
  
  const merchantFrequency = Array.from(merchantMap.entries())
    .map(([name, data]) => ({
      name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      visits: data.visits,
      total: data.total,
      avgPerVisit: data.total / data.visits,
    }))
    .sort((a, b) => b.visits - a.visits);
  
  const mostFrequentMerchant = merchantFrequency[0] || { name: '', visits: 0, total: 0 };
  
  // Small purchases analysis
  const smallPurchases = {
    under5: { count: 0, total: 0 },
    under10: { count: 0, total: 0 },
    under20: { count: 0, total: 0 },
  };
  
  debits.forEach(t => {
    const amount = t.amount;
    if (amount < 5) {
      smallPurchases.under5.count++;
      smallPurchases.under5.total += amount;
    }
    if (amount < 10) {
      smallPurchases.under10.count++;
      smallPurchases.under10.total += amount;
    }
    if (amount < 20) {
      smallPurchases.under20.count++;
      smallPurchases.under20.total += amount;
    }
  });
  
  // Long tail analysis (merchants outside top 10)
  const merchantTotals = Array.from(merchantMap.entries())
    .map(([name, data]) => ({ name, total: data.total }))
    .sort((a, b) => b.total - a.total);
  
  const top10Total = merchantTotals.slice(0, 10).reduce((sum, m) => sum + m.total, 0);
  const spendingOutsideTop10 = totalSpent - top10Total;
  const merchantsOutsideTop10 = merchantTotals.length - 10;
  
  // Category ratios
  const categoryTotals = new Map<Category, number>();
  debits.forEach(t => {
    if (t.category !== 'income' && t.category !== 'transfer') {
      categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
    }
  });
  
  const diningAmount = categoryTotals.get('food_dining') || 0;
  const groceriesAmount = categoryTotals.get('groceries') || 0;
  const diningVsGroceries = groceriesAmount > 0 ? diningAmount / groceriesAmount : null;
  
  // Discretionary spending percentage
  const discretionaryTotal = DISCRETIONARY_CATEGORIES.reduce(
    (sum, cat) => sum + (categoryTotals.get(cat) || 0),
    0
  );
  const discretionaryPercent = totalSpent > 0 ? (discretionaryTotal / totalSpent) * 100 : 0;
  
  // Largest transaction
  const largestTxn = debits.reduce((max, t) => 
    t.amount > max.amount ? { merchant: t.merchant, amount: t.amount } : max,
    { merchant: '', amount: 0 }
  );
  
  // Average transaction by category
  const categoryCounts = new Map<Category, { total: number; count: number }>();
  debits.forEach(t => {
    if (t.category !== 'income' && t.category !== 'transfer') {
      const current = categoryCounts.get(t.category) || { total: 0, count: 0 };
      categoryCounts.set(t.category, {
        total: current.total + t.amount,
        count: current.count + 1,
      });
    }
  });
  
  const averageTransactionByCategory = Array.from(categoryCounts.entries())
    .map(([category, data]) => {
      const categoryInfo = CATEGORIES.find(c => c.id === category);
      return {
        category: categoryInfo?.label || category,
        average: data.count > 0 ? data.total / data.count : 0,
      };
    })
    .sort((a, b) => b.average - a.average);
  
  // Annualized projections
  const daysPerYear = 365;
  const periodMultiplier = daysPerYear / periodDays;
  
  const subscriptionTotal = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'yearly') return sum + sub.amount / 12;
    if (sub.frequency === 'weekly') return sum + sub.amount * 4;
    return sum + sub.amount;
  }, 0);
  
  const topCategoryEntry = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])[0];
  const topCategoryInfo = topCategoryEntry 
    ? CATEGORIES.find(c => c.id === topCategoryEntry[0])
    : null;
  
  const projectedAnnual = {
    totalSpending: totalSpent * periodMultiplier,
    subscriptions: subscriptionTotal * 12,
    topCategory: {
      name: topCategoryInfo?.label || 'Other',
      annual: (topCategoryEntry?.[1] || 0) * periodMultiplier,
    },
  };

  // Money leaks - scan debit descriptions for fee-type keywords
  const moneyLeakItems: { merchant: string; amount: number; type: string; label: string; date: string }[] = [];
  debits.forEach(t => {
    const searchText = `${t.description} ${t.merchant}`.toLowerCase();
    const match = MONEY_LEAK_KEYWORDS.find(kw => searchText.includes(kw.pattern.toLowerCase()));
    if (match) {
      moneyLeakItems.push({
        merchant: t.merchant,
        amount: t.amount,
        type: match.type,
        label: match.label,
        date: t.date,
      });
    }
  });
  const moneyLeaksTotal = moneyLeakItems.reduce((sum, i) => sum + i.amount, 0);
  const moneyLeaks = {
    items: moneyLeakItems.sort((a, b) => b.amount - a.amount),
    totalAmount: moneyLeaksTotal,
    projectedAnnual: moneyLeaksTotal * periodMultiplier,
  };

  // Day of week - spending by day
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayTotals = new Map<number, { total: number; count: number }>();
  for (let i = 0; i < 7; i++) {
    dayTotals.set(i, { total: 0, count: 0 });
  }
  debits.forEach(t => {
    const date = new Date(t.date);
    const dayOfWeek = date.getDay();
    const current = dayTotals.get(dayOfWeek)!;
    dayTotals.set(dayOfWeek, {
      total: current.total + t.amount,
      count: current.count + 1,
    });
  });
  const breakdown = dayNames.map((day, i) => {
    const data = dayTotals.get(i)!;
    return {
      day,
      total: data.total,
      count: data.count,
      average: data.count > 0 ? data.total / data.count : 0,
    };
  });
  const sortedByTotal = [...breakdown].sort((a, b) => b.total - a.total);
  const weekendTotal = (dayTotals.get(0)?.total || 0) + (dayTotals.get(6)?.total || 0);
  const weekdayTotal = [1, 2, 3, 4, 5].reduce((sum, d) => sum + (dayTotals.get(d)?.total || 0), 0);
  const weekendDays = 2;
  const weekdayDays = 5;
  const weekendAvgPerDay = weekendDays > 0 ? weekendTotal / weekendDays : 0;
  const weekdayAvgPerDay = weekdayDays > 0 ? weekdayTotal / weekdayDays : 0;
  const dayOfWeek = {
    breakdown,
    highestDay: { day: sortedByTotal[0]?.day || 'Sunday', total: sortedByTotal[0]?.total ?? 0 },
    lowestDay: { day: sortedByTotal[6]?.day || 'Saturday', total: sortedByTotal[6]?.total ?? 0 },
    weekendTotal,
    weekdayTotal,
    weekendVsWeekdayRatio: weekdayAvgPerDay > 0 ? weekendAvgPerDay / weekdayAvgPerDay : null,
  };

  // Top 10 largest transactions
  const topLargestTransactions = [...debits]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map(t => {
      const categoryInfo = CATEGORIES.find(c => c.id === t.category);
      return {
        merchant: t.merchant,
        amount: t.amount,
        date: t.date,
        category: categoryInfo?.label || 'Other',
      };
    });

  return {
    merchantFrequency: merchantFrequency.slice(0, 20), // Top 20 for context
    mostFrequentMerchant,
    smallPurchases,
    longTail: {
      merchantsOutsideTop10: Math.max(0, merchantsOutsideTop10),
      spendingOutsideTop10,
      percentageOutsideTop10: totalSpent > 0 ? (spendingOutsideTop10 / totalSpent) * 100 : 0,
    },
    categoryRatios: {
      diningVsGroceries,
      discretionaryPercent,
    },
    largestTransaction: largestTxn,
    averageTransactionByCategory,
    projectedAnnual,
    moneyLeaks,
    dayOfWeek,
    topLargestTransactions,
  };
}
