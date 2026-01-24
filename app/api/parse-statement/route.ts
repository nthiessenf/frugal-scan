import { NextRequest, NextResponse } from 'next/server';
import { parseStatementWithClaude } from '@/lib/parse-with-claude';
import { validateParsedStatement, validateTransactionSchema } from '@/lib/validate-transactions';
import { ApiResponse, ParsedStatement } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid file type. Please upload a PDF.' },
        { status: 400 }
      );
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }
    
    if (file.size < 1024) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File appears to be empty or corrupted.' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    
    console.log(`[parse-statement] Processing file: ${file.name}, size: ${file.size} bytes`);
    
    let parsed: ParsedStatement;
    try {
      parsed = await parseStatementWithClaude(base64);
    } catch (error) {
      console.error('[parse-statement] Claude parsing error:', error);
      return NextResponse.json<ApiResponse<null>>(
        { 
          success: false, 
          error: 'Could not read PDF. Please ensure it\'s a valid bank statement.' 
        },
        { status: 400 }
      );
    }
    
    const invalidTransactions = parsed.transactions.filter(
      (t) => !validateTransactionSchema(t)
    );
    
    if (invalidTransactions.length > 0) {
      console.warn(
        `[parse-statement] ${invalidTransactions.length} invalid transactions removed`
      );
      parsed.transactions = parsed.transactions.filter((t) =>
        validateTransactionSchema(t)
      );
      parsed.parsingMetadata.totalTransactionsFound = parsed.transactions.length;
    }
    
    const validation = validateParsedStatement(parsed);
    
    const totalTime = Date.now() - startTime;
    console.log(
      `[parse-statement] Complete. ` +
      `Transactions: ${parsed.transactions.length}, ` +
      `Valid: ${validation.isValid}, ` +
      `Warnings: ${validation.warnings.length}, ` +
      `Time: ${totalTime}ms`
    );
    
    return NextResponse.json<ApiResponse<ParsedStatement>>({
      success: true,
      data: parsed,
      validation,
    });
    
  } catch (error) {
    console.error('[parse-statement] Unexpected error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
