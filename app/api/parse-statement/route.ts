import { NextRequest, NextResponse } from 'next/server';
import { parseStatement } from '@/lib/parse-pdf';
import { ApiResponse, ParsedStatement } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ParsedStatement>>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Please upload a PDF.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    console.log('PDF upload:', { fileName: file.name, fileSize: file.size });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await parseStatement(buffer);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse PDF. Please ensure it is a valid bank statement.' }, { status: 500 });
  }
}
