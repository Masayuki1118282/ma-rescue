import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#2D8A6E] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl">✓</span>
        </div>
        <h1
          className="text-2xl font-bold text-[#0A1F44] mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ご登録ありがとうございます
        </h1>
        <p className="text-[#4A5568] mb-8 leading-relaxed">
          担当者より2営業日以内にご連絡いたします。<br />
          しばらくお待ちください。
        </p>
        <Link
          href="/"
          className="inline-block bg-[#0A1F44] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#1E3A6E] transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}
