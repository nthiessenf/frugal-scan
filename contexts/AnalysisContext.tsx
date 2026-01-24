'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, ParsedStatement, ValidationResult } from '@/types';

interface AnalysisContextType {
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult | null) => void;
  parsedStatement: ParsedStatement | null;
  setParsedStatement: (statement: ParsedStatement | null) => void;
  validationResult: ValidationResult | null;
  setValidationResult: (result: ValidationResult | null) => void;
  clearAll: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [parsedStatement, setParsedStatement] = useState<ParsedStatement | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const clearAll = () => {
    setResult(null);
    setParsedStatement(null);
    setValidationResult(null);
  };

  return (
    <AnalysisContext.Provider value={{
      result,
      setResult,
      parsedStatement,
      setParsedStatement,
      validationResult,
      setValidationResult,
      clearAll,
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
}

