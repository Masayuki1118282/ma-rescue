import type { Metadata } from 'next'
import { Noto_Serif_JP, Noto_Sans_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'M&Aレスキュー｜最短3日・スピード売却なら',
  description: '最短3日・約8割が1ヶ月以内に成約。赤字企業でも高額売却実績多数。100社以上の買い手候補が登録するM&Aマッチングプラットフォーム。完全無料で査定。',
  keywords: 'M&A,会社売却,事業承継,会社買収,M&Aマッチング,中小企業,スピード売却',
  openGraph: {
    title: 'M&Aレスキュー｜最短3日・スピード売却なら',
    description: '最短3日・約8割が1ヶ月以内に成約。赤字企業でも高額売却実績多数。100社以上の買い手候補が登録するM&Aマッチングプラットフォーム。',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
