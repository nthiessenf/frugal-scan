// TypeScript interfaces will be added here

// Raw transaction extracted from PDF
export interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

// Result from PDF parsing
export interface ParsedStatement {
  transactions: RawTransaction[];
  bankName: string | null;
  accountType: string | null;
  period: {
    start: string | null;
    end: string | null;
  };
  rawText: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
