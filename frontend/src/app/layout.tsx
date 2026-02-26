import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { supabase } from '@/lib/supabase';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
});

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = 'Gia phả họ Lê';
  const defaultDesc = 'Gia phả dòng họ — Quản lý gia phả & kết nối cộng đồng';

  let title = defaultTitle;
  let subtitle = '';

  try {
    const { data } = await supabase.from('system_settings').select('key, value').in('key', ['site_title', 'site_subtitle']);
    if (data) {
      const titleRow = data.find((d) => d.key === 'site_title');
      const subtitleRow = data.find((d) => d.key === 'site_subtitle');
      if (titleRow) title = titleRow.value;
      if (subtitleRow) subtitle = subtitleRow.value;
    }
  } catch (err) {
    // ignore
  }

  const fullTitle = subtitle ? `${title} - ${subtitle}` : title;

  return {
    title: fullTitle,
    description: defaultDesc,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
