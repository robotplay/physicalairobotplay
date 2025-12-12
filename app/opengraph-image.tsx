import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Physical AI Robot Play';
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
          fontSize: 128,
          background: 'linear-gradient(135deg, #0052FF 0%, #FF6B00 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20, fontWeight: 'bold' }}>
          Physical AI Robot Play
        </div>
        <div style={{ fontSize: 32, textAlign: 'center' }}>
          코드가 현실이 되는 곳
        </div>
        <div style={{ fontSize: 28, marginTop: 20, opacity: 0.9 }}>
          천안 코딩 로봇 교육
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}












