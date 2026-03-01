'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: '最短3日', label: '最速成約実績', numeric: false },
  { value: 80, suffix: '%', label: '1ヶ月以内成約率', numeric: true },
  { value: 100, suffix: '社以上', label: '登録買い手企業数', numeric: true },
  { value: '0円', label: '売り手の初期費用', numeric: false },
]

function CountUp({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function StatCard({ stat, index, sectionVisible }: {
  stat: typeof stats[0]
  index: number
  sectionVisible: boolean
}) {
  return (
    <div
      className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-700"
      style={{
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div
        className="text-3xl md:text-4xl font-black text-[#0A1F44] mb-2"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {stat.numeric ? (
          <CountUp target={stat.value as number} suffix={stat.suffix || ''} />
        ) : (
          <span>{stat.value}</span>
        )}
      </div>
      <div className="w-8 h-0.5 bg-[#C8A96E] mx-auto mb-2" />
      <p className="text-sm text-[#4A5568]">{stat.label}</p>
    </div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#F5F7FA] py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-center text-2xl md:text-3xl font-bold text-[#0A1F44] mb-12"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          数字で見る実績
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} sectionVisible={sectionVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
