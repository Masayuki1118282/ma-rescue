'use client'

import { useEffect, useRef, useState } from 'react'

const TITLE = 'M&Aは、ご縁です。'

export default function EnSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [bodyVisible, setBodyVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // タイプライター: inView になったら1文字ずつ表示
  useEffect(() => {
    if (!inView) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setCharCount(i)
      if (i >= TITLE.length) {
        clearInterval(timer)
        // タイトル完了後に本文フェードイン
        setTimeout(() => setBodyVisible(true), 200)
      }
    }, 110)
    return () => clearInterval(timer)
  }, [inView])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1E3A6E 100%)' }}
    >
      {/* ゴールドグロー */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {/* タイプライター見出し */}
        <h2
          className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight min-h-[1.2em]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {TITLE.slice(0, charCount)}
          {charCount < TITLE.length && inView && (
            <span className="inline-block w-0.5 h-[0.8em] bg-[#C8A96E] ml-0.5 animate-pulse align-middle" />
          )}
        </h2>

        {/* 中見出し */}
        <p
          className="text-xl md:text-2xl text-[#C8A96E] font-bold mb-10 transition-all duration-700"
          style={{
            fontFamily: 'var(--font-serif)',
            opacity: bodyVisible ? 1 : 0,
            transform: bodyVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          出会いは、登録した人にしか訪れない。
        </p>

        {/* 本文 */}
        <div
          className="text-white/80 leading-relaxed text-base md:text-lg space-y-4 mb-10 text-left md:text-center transition-all duration-700"
          style={{
            opacity: bodyVisible ? 1 : 0,
            transform: bodyVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '100ms',
          }}
        >
          <p>
            会社を売ること、買うこと。<br />
            どちらも「いつか」ではなく「今」動いた人だけが、<br className="hidden md:block" />
            その機会を手にすることができます。
          </p>
          <p>
            登録は無料です。<br />
            情報を出したくなければ、いつでも取り消せます。<br />
            でも、何もしなければ、その出会いは永遠に来ません。
          </p>
          <p>
            今日、一歩を踏み出した経営者が、<br />
            明日、想像以上の未来を手にしているかもしれない。
          </p>
        </div>

        {/* 強調ブロック */}
        <div
          className="border border-[#C8A96E]/50 rounded-xl px-6 py-5 mb-10 bg-[#C8A96E]/5 transition-all duration-700"
          style={{
            opacity: bodyVisible ? 1 : 0,
            transform: bodyVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms',
          }}
        >
          <p className="text-white font-bold mb-2">
            📊 今この瞬間も、あなたの会社を探している企業がいます。
          </p>
          <p className="text-[#C8A96E] text-sm">
            登録社数 <span className="font-black text-lg">100社以上</span>
            　｜　今月の新規登録 <span className="font-black text-lg">38社</span>
          </p>
        </div>

        {/* CTAボタン */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 transition-all duration-700"
          style={{
            opacity: bodyVisible ? 1 : 0,
            transform: bodyVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms',
          }}
        >
          <button
            onClick={() => scrollTo('tab-section')}
            className="btn-gold-shimmer w-full sm:w-auto bg-[#C8A96E] hover:bg-[#b8976a] text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            今すぐ無料で売り手登録する
          </button>
          <button
            onClick={() => scrollTo('tab-section')}
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:-translate-y-1"
          >
            買い手として登録する
          </button>
        </div>

        {/* 補足 */}
        <p
          className="text-white/50 text-sm transition-all duration-700"
          style={{
            opacity: bodyVisible ? 1 : 0,
            transitionDelay: '400ms',
          }}
        >
          登録は5分で完了。費用は一切かかりません。<br />
          秘密は厳守されます。いつでも取り消しできます。
        </p>
      </div>
    </section>
  )
}
