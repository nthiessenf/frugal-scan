import { NextRequest, NextResponse } from 'next/server';
import { parseStatementWithClaude } from '@/lib/parse-with-claude';
import { validateParsedStatement, validateTransactionSchema } from '@/lib/validate-transactions';
import { ApiResponse, ParsedStatement } from '@/types';
import { getPdfPageCount } from '@/lib/pdf-chunker';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getProFromRequest } from '@/lib/pro-session';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB (under Vercel's 4.5MB request limit); real statements are typically well under 2MB
const MAX_PAGES = 30; // ~8 Claude chunk calls at 4 pages/chunk

export async function POST(request: NextRequest) {
  const timings: Record<string, number> = {};
  const startTotal = Date.now();
  
  try {
    // Rate limit before reading the body (per verified Pro subscription, else per IP).
    const pro = await getProFromRequest(request);
    const limited = await enforceRateLimit(request, 'parse', { proSubscriptionId: pro.isPro ? pro.payload?.s : null });
    if (limited) return limited;

    // Reject oversized bodies early when the client declares a length.
    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File too large. Maximum size is 4MB.' },
        { status: 413 }
      );
    }

    // Log: Start file processing
    const startFileProcess = Date.now();
    
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
    
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File too large. Maximum size is 4MB.' },
        { status: 413 }
      );
    }
    
    if (file.size < 1024) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File appears to be empty or corrupted.' },
        { status: 400 }
      );
    }
    
    timings['1_file_processing'] = Date.now() - startFileProcess;
    
    // Log: Start base64 conversion
    const startBase64 = Date.now();
    
    const buffer = Buffer.from(await file.arrayBuffer());

    // file.type is client-controlled; verify the actual PDF magic bytes.
    if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid file type. Please upload a PDF.' },
        { status: 400 }
      );
    }

    // Page cap before any Claude call (each 4 pages = one Claude request).
    let pageCount: number;
    try {
      pageCount = await getPdfPageCount(buffer.toString('base64'));
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Could not read PDF. Please ensure it\'s a valid bank statement.' },
        { status: 400 }
      );
    }
    if (pageCount > MAX_PAGES) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Statement too long. Maximum is ${MAX_PAGES} pages.` },
        { status: 413 }
      );
    }
    const base64 = buffer.toString('base64');
    
    timings['2_base64_conversion'] = Date.now() - startBase64;
    
    console.log(`[parse-statement] Processing file, size: ${file.size} bytes`);
    
    // Log: Start Claude API call
    const startClaude = Date.now();
    
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
    
    timings['3_claude_api_call'] = Date.now() - startClaude;
    
    // Log: Start validation
    const startValidation = Date.now();
    
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
    
    timings['4_validation'] = Date.now() - startValidation;
    
    // Log total time
    timings['5_total'] = Date.now() - startTotal;
    
    console.log('=== PARSE-STATEMENT TIMING ===');
    console.log(JSON.stringify(timings, null, 2));
    console.log('==============================');
    
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
