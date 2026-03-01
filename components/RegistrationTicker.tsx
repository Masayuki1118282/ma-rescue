'use client'

const registrations = [
  { date: '3月1日',  type: '売却希望', pref: '愛知県', industry: '建設業' },
  { date: '3月1日',  type: '買収希望', pref: '東京都', industry: 'IT・Web' },
  { date: '2月28日', type: '売却希望', pref: '大阪府', industry: '製造業' },
  { date: '2月28日', type: '買収希望', pref: '福岡県', industry: '飲食業' },
  { date: '2月27日', type: '売却希望', pref: '神奈川県', industry: '小売業' },
  { date: '2月27日', type: '買収希望', pref: '北海道', industry: '運輸業' },
  { date: '2月26日', type: '売却希望', pref: '兵庫県', industry: '医療・介護' },
  { date: '2月26日', type: '買収希望', pref: '埼玉県', industry: '建設業' },
  { date: '2月25日', type: '売却希望', pref: '静岡県', industry: 'サービス業' },
  { date: '2月25日', type: '買収希望', pref: '広島県', industry: '製造業' },
  { date: '2月24日', type: '売却希望', pref: '千葉県', industry: '不動産' },
  { date: '2月24日', type: '買収希望', pref: '京都府', industry: 'IT・Web' },
  { date: '2月23日', type: '売却希望', pref: '茨城県', industry: '農業・食品' },
  { date: '2月23日', type: '買収希望', pref: '宮城県', industry: '小売業' },
  { date: '2月22日', type: '売却希望', pref: '岐阜県', industry: '印刷業' },
  { date: '2月22日', type: '買収希望', pref: '栃木県', industry: '運輸業' },
  { date: '2月21日', type: '売却希望', pref: '長野県', industry: '観光・宿泊' },
  { date: '2月21日', type: '買収希望', pref: '岡山県', industry: '医療・介護' },
  { date: '2月20日', type: '売却希望', pref: '新潟県', industry: '製造業' },
  { date: '2月20日', type: '買収希望', pref: '熊本県', industry: 'サービス業' },
]

function TickerCard({ item }: { item: typeof registrations[0] }) {
  const isSeller = item.type === '売却希望'
  return (
    <div
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs mx-3 ${
        isSeller
          ? 'border-[#C8A96E] bg-[#C8A96E]/10'
          : 'border-white/40 bg-white/5'
      }`}
      style={{ minWidth: 'max-content' }}
    >
      <span className="text-white/60">📅 {item.date}</span>
      <span className="text-white/30">|</span>
      <span className={`font-medium ${isSeller ? 'text-[#C8A96E]' : 'text-white'}`}>
        {isSeller ? '🏢' : '🏦'} {item.type}
      </span>
      <span className="text-white/30">|</span>
      <span className="text-white/80">📍 {item.pref}</span>
      <span className="text-white/30">|</span>
      <span className="text-white/80">🏭 {item.industry}</span>
    </div>
  )
}

export default function RegistrationTicker() {
  // データを2セット並べてシームレスなループを実現
  const doubled = [...registrations, ...registrations]

  return (
    <div className="bg-[#0A1F44] border-y border-[#C8A96E]/30 py-4 overflow-hidden">
      <div className="flex items-center gap-4 px-4 mb-3">
        <span className="text-[#C8A96E] font-medium text-sm whitespace-nowrap flex-shrink-0">
          🔔 本日の新規登録
        </span>
        <div className="h-px flex-1 bg-[#C8A96E]/30" />
      </div>

      <div className="marquee-wrapper overflow-hidden">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <TickerCard key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
