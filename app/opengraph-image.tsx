import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FrugalScan - See Where Your Money Really Goes';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Logo/Icon area */}
        <div
          style={{
            fontSize: '80px',
            marginBottom: '20px',
          }}
        >
          💰
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#1d1d1f',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          FrugalScan
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: '#6e6e73',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          See where your money really goes
        </div>
        
        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              color: '#86868b',
            }}
          >
            🔒 Privacy-First
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              color: '#86868b',
            }}
          >
            ⚡ 60 Seconds
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              color: '#86868b',
            }}
          >
            💳 No Account Linking
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
