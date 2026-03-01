'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '費用はかかりますか？',
    a: '売り手様の初期費用は完全無料です。成約時のみ手数料が発生します。買い手様も登録・情報閲覧は無料で、成約時のみご負担いただきます。',
  },
  {
    q: '赤字の会社でも売れますか？',
    a: 'はい。赤字でも顧客基盤・従業員・設備・ブランドなどを評価し、成約した実績が多数ございます。まずはご相談ください。',
  },
  {
    q: '情報が外部に漏れませんか？',
    a: '買い手候補との接触前に守秘義務契約（NDA）を締結します。社名・代表者名などの詳細情報は、契約締結後のみ開示されます。',
  },
  {
    q: 'どのくらいの期間で売却できますか？',
    a: '最短3日での成約実績があります。約80%のケースで1ヶ月以内に成約しています。',
  },
  {
    q: 'どんな業種でも対応できますか？',
    a: '製造業・IT・飲食・小売・建設・医療など幅広い業種に対応しています。まずはお気軽にご登録ください。',
  },
  {
    q: '買い手はどんな企業ですか？',
    a: '100社以上の法人が登録しており、中小企業から上場企業まで幅広く在籍しています。業種・規模・エリアなど様々な条件の買い手がいます。',
  },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-3xl mx-auto px-4">
        <h2
          className="text-center text-2xl md:text-3xl font-bold text-[#0A1F44] mb-12"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          よくある質問
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F5F7FA] transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-bold text-[#0A1F44] text-sm md:text-base pr-4">
                  Q. {faq.q}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 border-2 border-[#C8A96E] rounded-full flex items-center justify-center text-[#C8A96E] transition-transform ${openIdx === i ? 'rotate-180' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              <div className={`accordion-content ${openIdx === i ? 'open' : ''}`}>
                <div className="px-5 pb-5 pt-1 text-sm text-[#4A5568] leading-relaxed border-t border-gray-100">
                  A. {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
