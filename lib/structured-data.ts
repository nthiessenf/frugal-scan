export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FrugalScan',
  url: 'https://frugalscan.com',
  logo: 'https://frugalscan.com/icon.png',
  description: 'FrugalScan is a privacy-first personal finance app that analyzes bank statement PDFs using AI to provide spending insights without requiring users to link their bank accounts.',
  sameAs: [],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FrugalScan',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description: 'Upload your bank statement PDF and get AI-powered spending insights in 60 seconds. No account linking required. Privacy-first personal finance analysis.',
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

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does FrugalScan work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your bank or credit card statement PDF. Our AI analyzes it to categorize transactions, detect subscriptions, and find spending patterns. You get clear charts and actionable recommendations in about 60 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FrugalScan safe and private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. FrugalScan never stores your bank statement or transaction data. Your PDF is processed securely and immediately discarded. We never ask you to link your bank account.',
      },
    },
    {
      '@type': 'Question',
      name: 'What banks does FrugalScan support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FrugalScan supports PDF statements from all major banks and credit card companies. Our AI can read and understand virtually any bank statement format.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does FrugalScan cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FrugalScan is currently free to use during our beta period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is FrugalScan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FrugalScan achieves 99.7% accuracy in transaction extraction using advanced AI that reads your PDF directly, understanding context and handling edge cases like refunds and foreign currency.',
      },
    },
  ],
};
