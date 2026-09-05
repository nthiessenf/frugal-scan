export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FrugalScan',
  url: 'https://frugalscan.com',
  logo: 'https://frugalscan.com/icon',
  description:
    'FrugalScan is a privacy-first personal finance app that analyzes bank statement PDFs using AI to provide spending insights without requiring users to link their bank accounts.',
  sameAs: [] as string[],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FrugalScan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Upload your bank statement PDF and get AI-powered spending insights in 60 seconds. No account linking required. Privacy-first personal finance analysis.',
  url: 'https://frugalscan.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'AI-powered PDF parsing with 99.7% accuracy',
    'Automatic transaction categorization',
    'Subscription detection',
    'Personalized spending insights',
    'Privacy-first - no bank account linking',
    'No data storage - your statement is never saved',
  ],
};

/** Single source of truth for on-page FAQ + FAQPage JSON-LD */
export const FAQ_ITEMS = [
  {
    question: 'How does FrugalScan work?',
    answer:
      'Upload your bank or credit card statement PDF. Our AI analyzes it to categorize transactions, detect subscriptions, and find spending patterns. You get clear charts and actionable recommendations in about 60 seconds.',
  },
  {
    question: 'Is FrugalScan safe and private?',
    answer:
      'Yes. FrugalScan never stores your bank statement or transaction data. Your PDF is processed securely and immediately discarded. We never ask you to link your bank account.',
  },
  {
    question: 'What banks does FrugalScan support?',
    answer:
      'FrugalScan supports PDF statements from all major banks and credit card companies. Our AI can read and understand virtually any bank statement format.',
  },
  {
    question: 'How much does FrugalScan cost?',
    answer:
      'You get 3 free analyses to start. FrugalScan Pro is $4.99/month or $39/year for unlimited analyses and extra insights.',
  },
  {
    question: 'How accurate is FrugalScan?',
    answer:
      'FrugalScan achieves 99.7% accuracy in transaction extraction using advanced AI that reads your PDF directly, understanding context and handling edge cases like refunds and foreign currency.',
  },
] as const;

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question' as const,
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: item.answer,
    },
  })),
};
