'use client'

import { useEffect, useRef, useState } from 'react'

const features = [
  {
    dir: 'left' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '最短3日、約8割が1ヶ月以内に成約',
    desc: '独自のマッチングネットワークで、通常数ヶ月かかるM&A手続きを大幅に短縮。急いでいる方のための専門チームが対応します。',
  },
  {
    dir: 'up' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: '赤字企業・債務超過でも成約実績あり',
    desc: '売上高だけでなく、顧客リスト・従業員・ブランド・立地など多角的な視点で企業価値を評価。予想以上の価格がつくことも。',
  },
  {
    dir: 'right' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '完全秘密厳守・M&A専門家が伴走',
    desc: '買い手企業との接触前に守秘義務契約を締結。専門アドバイザーが成約まで全プロセスをサポートします。',
  },
]

const animClass = {
  left:  'slide-in-left',
  up:    'slide-in-up',
  right: 'slide-in-right',
}

function FeatureCard({
  f,
  index,
}: {
  f: typeof features[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`text-center group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-2xl p-6 ${
        visible ? animClass[f.dir] : 'opacity-0'
      }`}
      style={{ animationDelay: visible ? `${index * 0.12}s` : undefined }}
    >
      <div className="w-16 h-16 bg-[#0A1F44] text-[#C8A96E] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-[#1E3A6E] group-hover:shadow-lg group-hover:shadow-[#C8A96E]/20">
        {f.icon}
      </div>
      <div className="w-8 h-0.5 bg-[#C8A96E] mx-auto mb-4 transition-all duration-300 group-hover:w-16" />
      <h3
        className="text-lg font-bold text-[#0A1F44] mb-3 leading-snug"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {f.title}
      </h3>
      <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
    </div>
  )
}

export default function FeatureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-center text-2xl md:text-3xl font-bold text-[#0A1F44] mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          M&Aレスキューが選ばれる3つの理由
        </h2>
        <p className="text-center text-[#4A5568] mb-12">
          急いでいても、安心して任せられる理由があります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
