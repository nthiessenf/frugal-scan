import { ParsedStatement, ValidationResult } from '@/types';

export function validateTransactionSchema(transaction: unknown): boolean {
  if (!transaction || typeof transaction !== 'object') return false;
  
  const t = transaction as Record<string, unknown>;
  
  if (typeof t.date !== 'string') return false;
  if (typeof t.description !== 'string') return false;
  if (typeof t.amount !== 'number') return false;
  if (t.type !== 'debit' && t.type !== 'credit') return false;
  if (typeof t.confidence !== 'number') return false;
  
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(t.date)) return false;
  
  if (t.amount < 0) return false;
  if (t.confidence < 0 || t.confidence > 1) return false;
  if ((t.description as string).trim().length === 0) return false;
  
  return true;
}

export function validateParsedStatement(parsed: ParsedStatement): ValidationResult {
  const warnings: string[] = [];
  
  const calculatedDebits = parsed.transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const calculatedCredits = parsed.transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  let totalDebitsMatch: boolean | null = null;
  let totalCreditsMatch: boolean | null = null;
  let discrepancyAmount: number | null = null;
  
  if (parsed.statementTotals.totalDebits !== null) {
    const diff = Math.abs(parsed.statementTotals.totalDebits - calculatedDebits);
    totalDebitsMatch = diff <= 1;
    if (!totalDebitsMatch) {
      discrepancyAmount = diff;
      warnings.push(
        `Debit total mismatch: statement shows $${parsed.statementTotals.totalDebits.toFixed(2)}, ` +
        `but extracted transactions sum to $${calculatedDebits.toFixed(2)}`
      );
    }
  }
  
  if (parsed.statementTotals.totalCredits !== null) {
    const diff = Math.abs(parsed.statementTotals.totalCredits - calculatedCredits);
    totalCreditsMatch = diff <= 1;
    if (!totalCreditsMatch) {
      if (discrepancyAmount === null) discrepancyAmount = diff;
      warnings.push(
        `Credit total mismatch: statement shows $${parsed.statementTotals.totalCredits.toFixed(2)}, ` +
        `but extracted transactions sum to $${calculatedCredits.toFixed(2)}`
      );
    }
  }
  
  const lowConfidenceCount = parsed.parsingMetadata.lowConfidenceCount;
  if (lowConfidenceCount > 0) {
    warnings.push(
      `${lowConfidenceCount} transaction(s) have low confidence and may need review`
    );
  }
  
  const missingDates = parsed.transactions.filter(
    (t) => !t.date || t.date === 'null'
  ).length;
  if (missingDates > 0) {
    warnings.push(`${missingDates} transaction(s) are missing dates`);
  }
  
  const isValid = 
    (totalDebitsMatch === null || totalDebitsMatch) &&
    (totalCreditsMatch === null || totalCreditsMatch);
  
  return {
    isValid,
    totalDebitsMatch,
    totalCreditsMatch,
    discrepancyAmount,
    warnings,
  };
}

