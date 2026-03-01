'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'ai' | 'user'; text: string }
type Step = 'industry' | 'revenue' | 'profit' | 'years' | 'employees' | 'result'

const industryOptions = [
  '製造業', 'IT・Web', '建設業', '飲食業', '小売業',
  '運輸業', '医療・介護', '不動産', 'サービス業', 'その他',
]
const revenueOptions = [
  { label: '〜1000万円', value: 1000 },
  { label: '〜5000万円', value: 5000 },
  { label: '〜1億円', value: 10000 },
  { label: '〜5億円', value: 50000 },
  { label: '5億円以上', value: 100000 },
]
const profitOptions = [
  { label: '赤字', value: 0.3 },
  { label: '〜500万円', value: 0.8 },
  { label: '〜1000万円', value: 1.2 },
  { label: '1000万円以上', value: 2.0 },
]
const industryBonus: Record<string, number> = {
  'IT・Web': 1.5, '製造業': 1.1, '医療・介護': 1.2, '不動産': 1.0,
  '建設業': 1.0, '飲食業': 0.8, '小売業': 0.85, '運輸業': 0.9,
  'サービス業': 0.95, 'その他': 1.0,
}

function formatManEn(v: number) {
  return v >= 10000 ? `${(v / 10000).toFixed(1)}億円` : `${v.toLocaleString()}万円`
}

const CLOSED_KEY   = 'chat_widget_closed'
const BALLOON_KEY  = 'chat_balloon_dismissed'

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [showBalloon, setShowBalloon] = useState(false)
  const [messages, setMessages]   = useState<Message[]>([
    { role: 'ai', text: 'こんにちは！無料査定を始めます。まず、業種を教えてください。' },
  ])
  const [step, setStep]     = useState<Step>('industry')
  const [data, setData]     = useState({ industry: '', revenue: 0, profit: 0, years: '', employees: '' })
  const [inputVal, setInputVal] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 1.5秒後に吹き出し表示（sessionStorageで抑制）
  useEffect(() => {
    if (sessionStorage.getItem(BALLOON_KEY)) return
    const t = setTimeout(() => setShowBalloon(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // 3秒後にチャット自動オープン（一度閉じたら抑制）
  useEffect(() => {
    if (sessionStorage.getItem(CLOSED_KEY)) return
    const t = setTimeout(() => {
      setOpen(true)
      setShowBalloon(false)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  // ヘッダー「無料査定」からのオープン指示
  useEffect(() => {
    const handler = () => {
      setOpen(true)
      setShowBalloon(false)
    }
    window.addEventListener('ma:openChat', handler)
    return () => window.removeEventListener('ma:openChat', handler)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem(CLOSED_KEY, '1')
  }
  const handleToggle = () => {
    if (open) { handleClose() }
    else { setOpen(true); setShowBalloon(false) }
  }
  const dismissBalloon = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBalloon(false)
    sessionStorage.setItem(BALLOON_KEY, '1')
  }

  const addAI  = (text: string) => setMessages(m => [...m, { role: 'ai', text }])
  const addUser = (text: string) => setMessages(m => [...m, { role: 'user', text }])

  const selectIndustry = (ind: string) => {
    addUser(ind); setData(d => ({ ...d, industry: ind }))
    setStep('revenue'); addAI('ありがとうございます。直近の年商はどのくらいですか？')
  }
  const selectRevenue = (opt: typeof revenueOptions[0]) => {
    addUser(opt.label); setData(d => ({ ...d, revenue: opt.value }))
    setStep('profit'); addAI('営業利益はいかがでしょうか？')
  }
  const selectProfit = (opt: typeof profitOptions[0]) => {
    addUser(opt.label); setData(d => ({ ...d, profit: opt.value }))
    setStep('years'); addAI('創業から何年経ちますか？（数字で入力）')
  }
  const submitYears = () => {
    const v = inputVal.trim(); if (!v || isNaN(Number(v))) return
    addUser(`${v}年`); setData(d => ({ ...d, years: v }))
    setInputVal(''); setStep('employees'); addAI('従業員数を教えてください。（数字で入力）')
  }
  const submitEmployees = () => {
    const v = inputVal.trim(); if (!v || isNaN(Number(v))) return
    addUser(`${v}人`); setInputVal('')
    const bonus = industryBonus[data.industry] ?? 1.0
    const base  = data.revenue * data.profit * bonus
    const low   = Math.round(base * 0.8)
    const high  = Math.round(base * 1.3)
    setStep('result')
    addAI(
      `ありがとうございます！概算査定額をお伝えします。\n\n` +
      `📊 想定売却価格レンジ\n━━━━━━━━━━━\n` +
      `${formatManEn(low)} 〜 ${formatManEn(high)}\n━━━━━━━━━━━\n\n` +
      `※上記はあくまで簡易概算です。詳細な査定は専門家にお任せください。`
    )
  }
  const reset = () => {
    setMessages([{ role: 'ai', text: 'こんにちは！無料査定を始めます。まず、業種を教えてください。' }])
    setStep('industry'); setData({ industry: '', revenue: 0, profit: 0, years: '', employees: '' })
    setInputVal('')
  }

  return (
    <>
      {/* ─── 右下固定エリア ─── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* 吹き出し（チャット閉じ時のみ表示） */}
        {showBalloon && !open && (
          <div
            className="relative cursor-pointer select-none"
            onClick={handleToggle}
            style={{
              animation: 'slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {/* 吹き出し本体 */}
            <div className="bg-white border-2 border-[#C8A96E] rounded-2xl rounded-br-none px-4 py-3 shadow-xl max-w-[200px]">
              {/* バツボタン */}
              <button
                onClick={dismissBalloon}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs leading-none transition-colors"
                aria-label="閉じる"
              >
                ×
              </button>

              <p className="text-[#0A1F44] font-bold text-sm leading-snug mb-1">
                📊 無料で売却価格を査定！
              </p>
              <p className="text-[#4A5568] text-xs leading-relaxed">
                質問に答えるだけで<br />概算価格がわかります
              </p>
              <div className="mt-2 text-[10px] text-[#C8A96E] font-bold">
                ▶ 今すぐ試す（無料）
              </div>
            </div>
          </div>
        )}

        {/* メインボタン */}
        <div className="relative">
          {/* 拍動リング（吹き出し表示中のみ） */}
          {showBalloon && !open && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#C8A96E] opacity-30 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-[#C8A96E] opacity-20 animate-ping" style={{ animationDelay: '0.4s' }} />
            </>
          )}

          <button
            onClick={handleToggle}
            className="relative w-16 h-16 rounded-full shadow-2xl flex flex-col items-center justify-center gap-0.5 hover:scale-105 transition-all duration-200"
            style={{
              background: open
                ? '#1E3A6E'
                : 'linear-gradient(135deg, #0A1F44 0%, #1E3A6E 100%)',
              border: '2px solid #C8A96E',
            }}
            aria-label="AI査定チャットを開く"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" className="w-6 h-6">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-[#C8A96E] font-bold leading-none" style={{ fontSize: 9 }}>AI査定</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── チャットウィンドウ ─── */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden border border-[#1E3A6E] flex flex-col"
          style={{ height: 480, animation: 'slideInUp 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          {/* ヘッダー */}
          <div className="bg-[#0A1F44] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C8A96E]/20 border border-[#C8A96E]/50 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">AI 無料売却査定</p>
                <p className="text-white/50 text-xs">質問に答えるだけで概算価格がわかります</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={reset} className="text-white/40 hover:text-white text-xs underline">
                リセット
              </button>
              <button onClick={handleClose} className="text-white/40 hover:text-white" aria-label="閉じる">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* メッセージ */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F7FA]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-6 h-6 bg-[#0A1F44] rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" className="w-3 h-3">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#0A1F44] text-white rounded-br-none'
                      : 'bg-white text-[#0A1F44] shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* 入力エリア */}
          <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3">
            {step === 'industry' && (
              <div className="flex flex-wrap gap-1.5">
                {industryOptions.map(ind => (
                  <button key={ind} onClick={() => selectIndustry(ind)}
                    className="text-xs bg-[#F5F7FA] border border-gray-200 text-[#0A1F44] px-2.5 py-1.5 rounded-full hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all">
                    {ind}
                  </button>
                ))}
              </div>
            )}
            {step === 'revenue' && (
              <div className="flex flex-wrap gap-1.5">
                {revenueOptions.map(opt => (
                  <button key={opt.label} onClick={() => selectRevenue(opt)}
                    className="text-xs bg-[#F5F7FA] border border-gray-200 text-[#0A1F44] px-2.5 py-1.5 rounded-full hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {step === 'profit' && (
              <div className="flex flex-wrap gap-1.5">
                {profitOptions.map(opt => (
                  <button key={opt.label} onClick={() => selectProfit(opt)}
                    className="text-xs bg-[#F5F7FA] border border-gray-200 text-[#0A1F44] px-2.5 py-1.5 rounded-full hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {(step === 'years' || step === 'employees') && (
              <div className="flex gap-2">
                <input type="number" value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (step === 'years' ? submitYears() : submitEmployees())}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
                  placeholder={step === 'years' ? '例：20' : '例：10'} min="0" />
                <button onClick={step === 'years' ? submitYears : submitEmployees}
                  className="bg-[#0A1F44] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A6E] transition-colors">
                  送信
                </button>
              </div>
            )}
            {step === 'result' && (
              <button
                onClick={() => document.getElementById('tab-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-[#C8A96E] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#b8976a] transition-colors">
                詳細査定を依頼する（無料）
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
