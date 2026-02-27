import { NextRequest, NextResponse } from 'next/server';
import { CategorizedTransaction, Subscription, AnalysisResult, ApiResponse, Insight, SavingsTip, MoneyLeak, SubscriptionAudit } from '@/types';
import { calculateSummary, getCategoryBreakdown, getTopMerchants } from '@/lib/analysis';
import { generateInsights } from '@/lib/claude-insights';

export async function POST(request: NextRequest) {
  console.log('\n\n🚀 ===== ANALYZE API ROUTE CALLED =====');
  const timings: Record<string, number> = {};
  const startTotal = Date.now();
  
  try {
    // Log: Start request parsing
    const startParse = Date.now();
    
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
    
    timings['1_request_parsing'] = Date.now() - startParse;
    
    console.log(`[analyze] Processing ${transactions.length} transactions`);
    
    // Calculate statistics
    const startStats = Date.now();
    const summary = calculateSummary(transactions, subscriptions || []);
    const categoryBreakdown = getCategoryBreakdown(transactions);
    const topMerchants = getTopMerchants(transactions, 10);
    timings['2_statistics_calculation'] = Date.now() - startStats;
    
    console.log(`[analyze] Summary: spent=$${summary.totalSpent.toFixed(2)}, income=$${summary.totalIncome.toFixed(2)}`);
    
    // Generate AI insights
    let insights: Insight[] = [];
    let tips: SavingsTip[] = [];
    let moneyLeaks: MoneyLeak[] = [];
    let subscriptionAudit: SubscriptionAudit[] = [];
    let enhancedTips: AnalysisResult['enhancedTips'];
    
    // Log: Start Claude insights call
    const startClaude = Date.now();
    
    try {
      console.log('[analyze] About to call generateInsights...');
      const aiResponse = await generateInsights(
        summary,
        categoryBreakdown,
        topMerchants,
        subscriptions || [],
        transactions
      );
      insights = aiResponse.insights;
      tips = aiResponse.tips;
      moneyLeaks = aiResponse.moneyLeaks;
      enhancedTips = {
        quickWins: aiResponse.enhancedTips.quickWins,
        worthTheEffort: aiResponse.enhancedTips.worthTheEffort,
        bigMoves: aiResponse.enhancedTips.bigMoves,
        totalMonthlySavings: aiResponse.enhancedTips.totalMonthlySavings,
        totalAnnualSavings: aiResponse.enhancedTips.totalAnnualSavings,
      };
      console.log('[analyze] generateInsights succeeded');
      console.log(`[analyze] Generated ${insights.length} insights and ${tips.length} tips`);
    } catch (error) {
      console.error('[analyze] generateInsights FAILED:', error);
      console.error('[analyze] Error message:', error instanceof Error ? error.message : String(error));
      console.error('[analyze] Error stack:', error instanceof Error ? error.stack : 'N/A');
      // Continue without insights - still return the data
      insights = [{
        id: 'fallback-1',
        title: 'Analysis Complete',
        description: `We analyzed ${transactions.length} transactions totaling $${summary.totalSpent.toFixed(2)} in spending.`,
        severity: 'info' as const,
      }];
      tips = [];
      enhancedTips = {
        quickWins: [],
        worthTheEffort: [],
        bigMoves: [],
        totalMonthlySavings: 0,
        totalAnnualSavings: 0,
      };
      moneyLeaks = [];
    }
    
    timings['3_claude_insights_call'] = Date.now() - startClaude;

    // Calculate subscription audit (monthly and annual costs) - always run
    subscriptionAudit = (subscriptions || []).map(s => {
      const monthlyAmount = s.frequency === 'yearly' ? s.amount / 12 : s.frequency === 'weekly' ? s.amount * 4 : s.amount;
      const annualCost = s.frequency === 'yearly' ? s.amount : s.frequency === 'weekly' ? s.amount * 52 : s.amount * 12;
      return {
        name: s.name,
        monthlyAmount,
        annualCost,
        category: s.category,
      };
    });
    
    // Log: Start response formatting
    const startFormat = Date.now();
    
    const result: AnalysisResult = {
      summary,
      categoryBreakdown,
      topMerchants,
      subscriptions: subscriptions || [],
      insights,
      tips,
      generatedAt: new Date().toISOString(),
      transactions,
      moneyLeaks,
      subscriptionAudit,
      enhancedTips,
    };

    console.log('[analyze] Enhanced fields:', {
      hasMoneyLeaks: !!moneyLeaks?.length,
      moneyLeaksCount: moneyLeaks?.length || 0,
      hasEnhancedTips: !!enhancedTips,
      quickWinsCount: enhancedTips?.quickWins?.length || 0,
      worthTheEffortCount: enhancedTips?.worthTheEffort?.length || 0,
      bigMovesCount: enhancedTips?.bigMoves?.length || 0,
      totalAnnualSavings: enhancedTips?.totalAnnualSavings || 0,
      subscriptionAuditCount: subscriptionAudit?.length || 0,
    });
    
    timings['4_response_formatting'] = Date.now() - startFormat;
    
    // Log total time
    timings['5_total'] = Date.now() - startTotal;
    
    console.log('=== ANALYZE TIMING ===');
    console.log(JSON.stringify(timings, null, 2));
    console.log('======================');
    
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

