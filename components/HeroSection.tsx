'use client'

import { useEffect, useState } from 'react'

// 固定パーティクル（hydration mismatch回避）
const PARTICLES = [
  { id: 0,  size: 3, x: 10,  y: 20, dur: 12, delay: 0   },
  { id: 1,  size: 4, x: 85,  y: 15, dur: 10, delay: 1.5 },
  { id: 2,  size: 2, x: 45,  y: 70, dur: 14, delay: 3   },
  { id: 3,  size: 5, x: 72,  y: 40, dur: 9,  delay: 0.5 },
  { id: 4,  size: 3, x: 25,  y: 85, dur: 11, delay: 2   },
  { id: 5,  size: 4, x: 60,  y: 10, dur: 13, delay: 4   },
  { id: 6,  size: 2, x: 90,  y: 75, dur: 15, delay: 1   },
  { id: 7,  size: 3, x: 15,  y: 55, dur: 10, delay: 3.5 },
  { id: 8,  size: 5, x: 50,  y: 30, dur: 12, delay: 2.5 },
  { id: 9,  size: 2, x: 80,  y: 90, dur: 9,  delay: 0.8 },
  { id: 10, size: 4, x: 35,  y: 45, dur: 14, delay: 4.5 },
  { id: 11, size: 3, x: 5,   y: 65, dur: 11, delay: 1.2 },
  { id: 12, size: 2, x: 55,  y: 90, dur: 13, delay: 3.8 },
  { id: 13, size: 4, x: 95,  y: 35, dur: 10, delay: 2.2 },
  { id: 14, size: 3, x: 20,  y: 8,  dur: 16, delay: 0.3 },
]

const BADGES = [
  { icon: '¥', text: '初期費用0円' },
  { icon: '🔒', text: '秘密厳守' },
  { icon: '⚡', text: '最短3日成約' },
  { icon: '🤝', text: '専門家が伴走' },
]

export default function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A1F44 0%, #1E3A6E 60%, #0A1F44 100%)',
      }}
    >
      {/* 幾何学グリッド */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C8A96E" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 浮遊パーティクル */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#C8A96E] pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ゴールドグロー */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)' }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24">
        {/* 上部バッジ */}
        <div
          className="inline-flex items-center gap-2 bg-white/10 border border-[#C8A96E]/40 rounded-full px-5 py-2 mb-10 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <span className="w-2 h-2 bg-[#C8A96E] rounded-full animate-pulse" />
          <span className="text-[#C8A96E] text-sm font-medium">100社以上の買い手候補が登録中</span>
        </div>

        {/* ─── キャッチコピー（世界トップ0.1%品質） ─── */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight transition-all duration-700"
          style={{
            fontFamily: 'var(--font-serif)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: '200ms',
          }}
        >
          今日登録して、<br />
          <span className="text-[#C8A96E]">最短3日で売れる。</span>
        </h1>

        {/* サブコピー */}
        <p
          className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '420ms',
          }}
        >
          100社以上の買い手が、今この瞬間もあなたの会社を探しています。<br className="hidden md:block" />
          約8割が1ヶ月以内に成約。費用は一切かかりません。
        </p>

        {/* CTAボタン */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '620ms',
          }}
        >
          <button
            onClick={() => scrollTo('tab-section')}
            className="btn-gold-shimmer w-full sm:w-auto bg-[#C8A96E] hover:bg-[#b8976a] text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            売却価格を無料で調べる
          </button>
          <button
            onClick={() => scrollTo('tab-section')}
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:-translate-y-1"
          >
            買収候補リストを見る
          </button>
        </div>

        {/* 安心ポイント バッジ */}
        <div
          className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-3 mt-10 transition-all duration-700 max-w-sm md:max-w-none mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '820ms',
          }}
        >
          {BADGES.map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 border border-[#C8A96E] bg-white/10 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-medium text-white w-full md:w-auto"
            >
              <span className="text-[#C8A96E] font-bold text-base leading-none">{b.icon}</span>
              <span className="text-[14px] leading-none">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
