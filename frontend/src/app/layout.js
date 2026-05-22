import './globals.css';

export const metadata = {
  title: '百邑酒世界 · 个性化精品酒类平台',
  description: '酱香型白酒、威士忌、干邑白兰地、红酒、茗茶、精品雪茄｜百邑酒世界，品味非凡',
  keywords: '茅台,白酒,威士忌,红酒,干邑,百邑酒世界,O2O,酒类配送',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0A0806',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="color-scheme" content="dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
