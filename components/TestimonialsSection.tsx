'use client'

import { useState, useEffect, useRef } from 'react'

const sellers = [
  {
    name: '田中 正雄（仮名）',
    attr: '64歳・建設業・愛知県',
    revenue: '年商 約8,000万円',
    quote: 'まさか3週間で売れるとは思わなかった。しかも赤字だったのに。',
    body: '後継者もおらず、廃業を考えていたところM&Aレスキューを知りました。半信半疑で登録したところ、すぐに数社から問い合わせが。最終的に3週間で成約。従業員も全員引き継いでもらえ、本当に登録して良かったです。',
  },
  {
    name: '鈴木 久美子（仮名）',
    attr: '51歳・飲食業・大阪府',
    revenue: '年商 約3,000万円',
    quote: 'コロナで赤字続きでも、ちゃんと買ってもらえた。',
    body: 'コロナ禍から立て直せず、もう限界と思っていました。赤字でも売れるのか不安でしたが、店舗の立地と常連客の多さを評価してもらい、想定以上の価格で成約しました。もっと早く相談すれば良かったです。',
  },
  {
    name: '山本 浩二（仮名）',
    attr: '58歳・製造業・静岡県',
    revenue: '年商 約2億円',
    quote: '秘密が守られたまま話が進んだのが一番助かった。',
    body: '従業員や取引先に知られずに進められるか心配でしたが、NDA締結後に相手先と接触するという仕組みが安心でした。最終的に社員は全員残り、経営もスムーズに引き継がれています。',
  },
]

const buyers = [
  {
    name: '佐藤 健一（仮名）',
    attr: '42歳・IT会社代表・東京都',
    revenue: '',
    quote: '探していた業種の企業がすぐ見つかった。',
    body: '既存事業との相乗効果を狙える製造業の会社を探していました。登録後すぐに条件に合う企業情報が届き、2ヶ月で成約。仲介業者経由より圧倒的にスピーディでした。',
  },
  {
    name: '中村 靖夫（仮名）',
    attr: '55歳・不動産会社代表・神奈川県',
    revenue: '',
    quote: '複数の候補から選べるのが良かった。',
    body: 'M&Aは初めてでしたが、担当者が親切に説明してくれました。複数の売却希望企業を比較しながら検討できたので、納得のいく選択ができました。初期費用もかからず助かりました。',
  },
  {
    name: '渡辺 誠（仮名）',
    attr: '48歳・建設会社代表・福岡県',
    revenue: '',
    quote: '地方でもこれだけ案件があるとは思わなかった。',
    body: '地方だと案件が少ないと思っていましたが、予想以上の数の売却希望企業が登録されていました。地元での事業拡大にうまく活用できています。',
  },
]

function TestimonialCard({
  t,
  index,
  sectionVisible,
}: {
  t: typeof sellers[0]
  index: number
  sectionVisible: boolean
}) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-700"
      style={{
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${index * 160}ms`,
      }}
    >
      <div className="flex text-[#C8A96E] text-sm mb-3">{'★'.repeat(5)}</div>
      <p className="text-[#0A1F44] font-bold text-base mb-3 leading-snug">
        「{t.quote}」
      </p>
      <p className="text-sm text-[#4A5568] leading-relaxed mb-4">{t.body}</p>
      <div className="border-t border-gray-100 pt-3">
        <p className="font-bold text-sm text-[#0A1F44]">{t.name}</p>
        <p className="text-xs text-[#4A5568]">{t.attr}</p>
        {t.revenue && <p className="text-xs text-[#C8A96E]">{t.revenue}</p>}
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [tab, setTab] = useState<'seller' | 'buyer'>('seller')
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const list = tab === 'seller' ? sellers : buyers

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // タブ切り替え時にアニメーションをリセット
  const handleTabChange = (t: 'seller' | 'buyer') => {
    setSectionVisible(false)
    setTab(t)
    setTimeout(() => setSectionVisible(true), 50)
  }

  return (
    <section ref={sectionRef} className="py-20 bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-center text-2xl md:text-3xl font-bold text-[#0A1F44] mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          実際に登録された方の声
        </h2>
        <p className="text-center text-[#4A5568] mb-8">
          全国の経営者から寄せられた実績です（仮名）
        </p>

        {/* タブ */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => handleTabChange('seller')}
              className={`px-6 py-2.5 text-sm font-medium transition-all ${
                tab === 'seller' ? 'bg-[#0A1F44] text-white' : 'bg-white text-[#4A5568] hover:bg-gray-50'
              }`}
            >
              売り手の声
            </button>
            <button
              onClick={() => handleTabChange('buyer')}
              className={`px-6 py-2.5 text-sm font-medium transition-all ${
                tab === 'buyer' ? 'bg-[#0A1F44] text-white' : 'bg-white text-[#4A5568] hover:bg-gray-50'
              }`}
            >
              買い手の声
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((t, i) => (
            <TestimonialCard key={`${tab}-${i}`} t={t} index={i} sectionVisible={sectionVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
