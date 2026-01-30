import { PDFDocument } from 'pdf-lib';

export interface PdfChunk {
  chunkIndex: number;
  totalChunks: number;
  base64: string;
  pageRange: { start: number; end: number };
}

export async function splitPdfIntoChunks(
  pdfBase64: string,
  pagesPerChunk: number = 4
): Promise<PdfChunk[]> {
  const pdfBytes = Buffer.from(pdfBase64, 'base64');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  
  const chunks: PdfChunk[] = [];
  const totalChunks = Math.ceil(totalPages / pagesPerChunk);
  
  for (let i = 0; i < totalPages; i += pagesPerChunk) {
    const chunkDoc = await PDFDocument.create();
    const startPage = i;
    const endPage = Math.min(i + pagesPerChunk, totalPages);
    
    const pageIndices = Array.from(
      { length: endPage - startPage },
      (_, idx) => startPage + idx
    );
    const copiedPages = await chunkDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => chunkDoc.addPage(page));
    
    const chunkBytes = await chunkDoc.save();
    const chunkBase64 = Buffer.from(chunkBytes).toString('base64');
    
    chunks.push({
      chunkIndex: chunks.length,
      totalChunks,
      base64: chunkBase64,
      pageRange: { start: startPage + 1, end: endPage }
    });
  }
  
  console.log(`Split PDF into ${chunks.length} chunks of ~${pagesPerChunk} pages each`);
  return chunks;
}

export async function getPdfPageCount(pdfBase64: string): Promise<number> {
  const pdfBytes = Buffer.from(pdfBase64, 'base64');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc.getPageCount();
}

