import { NextRequest, NextResponse } from 'next/server';
import { CategorizedTransaction, Subscription, AnalysisResult, ApiResponse, Insight, SavingsTip } from '@/types';
import { calculateSummary, getCategoryBreakdown, getTopMerchants } from '@/lib/analysis';
import { generateInsights } from '@/lib/claude-insights';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { transactions, subscriptions } = body as {
      transactions: CategorizedTransaction[];
      subscriptions: Subscription[];
    };
    
    // Validate input
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Please provide transaction data' },
        { status: 400 }
      );
    }
    
    if (transactions.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No transactions to analyze' },
        { status: 400 }
      );
    }
    
    console.log(`[analyze] Processing ${transactions.length} transactions`);
    
    // Calculate statistics
    const summary = calculateSummary(transactions, subscriptions || []);
    const categoryBreakdown = getCategoryBreakdown(transactions);
    const topMerchants = getTopMerchants(transactions, 10);
    
    console.log(`[analyze] Summary: spent=$${summary.totalSpent.toFixed(2)}, income=$${summary.totalIncome.toFixed(2)}`);
    
    // Generate AI insights
    let insights: Insight[] = [];
    let tips: SavingsTip[] = [];
    
    try {
      const aiResponse = await generateInsights(
        summary,
        categoryBreakdown,
        topMerchants,
        subscriptions || []
      );
      insights = aiResponse.insights;
      tips = aiResponse.tips;
      console.log(`[analyze] Generated ${insights.length} insights and ${tips.length} tips`);
    } catch (error) {
      console.error('[analyze] Failed to generate insights:', error);
      // Continue without insights - still return the data
      insights = [{
        id: 'fallback-1',
        title: 'Analysis Complete',
        description: `We analyzed ${transactions.length} transactions totaling $${summary.totalSpent.toFixed(2)} in spending.`,
        severity: 'info' as const,
      }];
      tips = [];
    }
    
    const result: AnalysisResult = {
      summary,
      categoryBreakdown,
      topMerchants,
      subscriptions: subscriptions || [],
      insights,
      tips,
      generatedAt: new Date().toISOString(),
    };
    
    const totalTime = Date.now() - startTime;
    console.log(`[analyze] Complete in ${totalTime}ms`);
    
    return NextResponse.json<ApiResponse<AnalysisResult>>({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error('[analyze] Unexpected error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}

