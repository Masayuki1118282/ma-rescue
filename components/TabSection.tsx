'use client'

import { useState, useEffect } from 'react'
import SellerForm from './SellerForm'
import BuyerForm from './BuyerForm'

const sellerPoints = [
  {
    q: '赤字でも売れる？',
    a: '業種・将来性・従業員数で評価。赤字でも高額成約事例多数あります。財務数値だけでなく、顧客リスト・ブランド・立地など多角的に評価します。',
  },
  {
    q: '安心・安全の取引',
    a: '提携司法書士が譲渡契約をサポート。TelegramやSignalなどへの誘導は一切なく、よくある詐欺・トラブルに巻き込まれない安全な取引環境を提供。売買契約の締結から譲渡完了まで責任を持って一貫対応します。',
  },
  {
    q: '時間がない',
    a: '最短3日、平均1ヶ月以内に成約。独自のマッチングネットワークで、通常数ヶ月かかる手続きを大幅に短縮します。',
  },
]

const buyerPoints = [
  {
    icon: '🏭',
    title: '様々な業種・規模に対応',
    desc: '製造業・IT・飲食・小売など幅広い業種の案件を掲載。ご希望の条件に合わせてご案内します。',
  },
  {
    icon: '⚡',
    title: 'スピーディな情報提供',
    desc: '新規掲載企業の情報をメールでいち早くお届け。毎月新しい売却希望案件が届きます。',
  },
  {
    icon: '¥',
    title: '完全無料で登録',
    desc: '買い手登録は初期費用0円。成約時のみ手数料が発生します。リスクなく始められます。',
  },
]

export default function TabSection() {
  const [tab, setTab] = useState<'seller' | 'buyer'>('seller')

  useEffect(() => {
    const handler = (e: Event) => {
      setTab((e as CustomEvent<'seller' | 'buyer'>).detail)
    }
    window.addEventListener('ma:setTab', handler)
    return () => window.removeEventListener('ma:setTab', handler)
  }, [])

  return (
    <section id="tab-section" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* タブ */}
        <div className="flex rounded-xl overflow-hidden border border-[#0A1F44]/20 mb-10 shadow-sm">
          <button
            onClick={() => setTab('seller')}
            className={`flex-1 py-4 text-base font-bold transition-all ${
              tab === 'seller'
                ? 'bg-[#0A1F44] text-white'
                : 'bg-white text-[#4A5568] hover:bg-[#F5F7FA]'
            }`}
          >
            売りたい方へ
          </button>
          <button
            onClick={() => setTab('buyer')}
            className={`flex-1 py-4 text-base font-bold transition-all ${
              tab === 'buyer'
                ? 'bg-[#0A1F44] text-white'
                : 'bg-white text-[#4A5568] hover:bg-[#F5F7FA]'
            }`}
          >
            買いたい方へ
          </button>
        </div>

        {tab === 'seller' ? (
          <div>
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-[#0A1F44] mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                あなたの会社の情報を登録するだけ。<br />
                100社以上の買い手候補に届きます。
              </h2>
            </div>

            {/* 不安 → 解決 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {sellerPoints.map((p, i) => (
                <div key={i} className="bg-[#F5F7FA] rounded-xl p-5 border-l-4 border-[#C8A96E]">
                  <p className="font-bold text-[#0A1F44] mb-2">「{p.q}」</p>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{p.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 md:p-8">
              <h3
                className="text-xl font-bold text-[#0A1F44] mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                無料で売り手登録する
              </h3>
              <SellerForm />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-[#0A1F44] mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                売却希望企業の情報をいち早く受け取る。<br />
                毎月、新しい売却希望案件が届きます。
              </h2>
            </div>

            {/* メリット */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {buyerPoints.map((p, i) => (
                <div key={i} className="bg-[#F5F7FA] rounded-xl p-5 text-center">
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <p className="font-bold text-[#0A1F44] mb-2">{p.title}</p>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 md:p-8">
              <h3
                className="text-xl font-bold text-[#0A1F44] mb-6"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                無料で買い手登録する（法人のみ）
              </h3>
              <BuyerForm />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
