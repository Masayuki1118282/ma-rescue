'use client'

import { useState, useRef, useEffect } from 'react'
import { submitToGAS } from '@/lib/submitToGAS'

type Message = { role: 'ai' | 'user'; text: string }

// ─── フェーズ1: 査定 ───────────────────────────────
// ─── フェーズ2: 連絡先収集 ────────────────────────
// ─── フェーズ3: 登録完了 ──────────────────────────
type Step =
  | 'industry' | 'revenue' | 'profit' | 'employees' | 'founded'  // 査定
  | 'result'                                                        // 概算表示
  | 'companyName' | 'repName' | 'phone' | 'email'                  // 連絡先
  | 'confirm' | 'done'                                              // 確認・完了

interface ChatData {
  industry: string
  revenueLabel: string; revenue: number
  profitLabel: string;  profit: number
  employees: string
  founded: string
  companyName: string
  repName: string
  phone: string
  email: string
}

const INIT_DATA: ChatData = {
  industry: '', revenueLabel: '', revenue: 0,
  profitLabel: '', profit: 0,
  employees: '', founded: '',
  companyName: '', repName: '', phone: '', email: '',
}

const industryOptions = [
  '製造業', 'IT・Web', '建設業', '飲食業', '小売業',
  '運輸業', '医療・介護', '不動産', 'サービス業', 'その他',
]
const revenueOptions = [
  { label: '〜1000万円', value: 1000 },
  { label: '〜5000万円', value: 5000 },
  { label: '〜1億円',    value: 10000 },
  { label: '〜5億円',    value: 50000 },
  { label: '5億円以上',  value: 100000 },
]
const profitOptions = [
  { label: '赤字',         value: 0.3 },
  { label: '〜500万円',    value: 0.8 },
  { label: '〜1000万円',   value: 1.2 },
  { label: '1000万円以上', value: 2.0 },
]
const industryBonus: Record<string, number> = {
  'IT・Web': 1.5, '製造業': 1.1, '医療・介護': 1.2, '不動産': 1.0,
  '建設業': 1.0,  '飲食業': 0.8, '小売業': 0.85,   '運輸業': 0.9,
  'サービス業': 0.95, 'その他': 1.0,
}

function fmt(v: number) {
  return v >= 10000 ? `${(v / 10000).toFixed(1)}億円` : `${v.toLocaleString()}万円`
}

const CLOSED_KEY  = 'chat_widget_closed'
const BALLOON_KEY = 'chat_balloon_dismissed'

// ─── AIアイコン ────────────────────────────────────
function AIIcon() {
  return (
    <div className="w-6 h-6 bg-[#0A1F44] rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" className="w-3 h-3">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [showBalloon, setShowBalloon] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)
  const [messages, setMessages]   = useState<Message[]>([
    { role: 'ai', text: 'こんにちは！まず業種を教えてください。' },
  ])
  const [step, setStep]     = useState<Step>('industry')
  const [data, setData]     = useState<ChatData>(INIT_DATA)
  const [inputVal, setInputVal] = useState('')
  const [inputError, setInputError] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // モバイル判定
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 吹き出し：1.5秒後（sessionStorage抑制）
  useEffect(() => {
    if (sessionStorage.getItem(BALLOON_KEY)) return
    const t = setTimeout(() => setShowBalloon(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // チャット自動オープン：3秒後（sessionStorage抑制）
  useEffect(() => {
    if (sessionStorage.getItem(CLOSED_KEY)) return
    const t = setTimeout(() => { setOpen(true); setShowBalloon(false) }, 3000)
    return () => clearTimeout(t)
  }, [])

  // ヘッダー「無料査定」からのイベント
  useEffect(() => {
    const handler = () => { setOpen(true); setShowBalloon(false) }
    window.addEventListener('ma:openChat', handler)
    return () => window.removeEventListener('ma:openChat', handler)
  }, [])

  // 新メッセージで末尾へスクロール
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [messages])

  // テキスト入力後にフォーカス
  useEffect(() => {
    const textSteps: Step[] = ['companyName', 'repName', 'phone', 'email', 'employees', 'founded']
    if (open && textSteps.includes(step)) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [step, open])

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem(CLOSED_KEY, '1')
  }
  const handleToggle = () => {
    if (open) handleClose()
    else { setOpen(true); setShowBalloon(false) }
  }
  const dismissBalloon = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBalloon(false)
    sessionStorage.setItem(BALLOON_KEY, '1')
  }

  const addAI  = (text: string) => setMessages(m => [...m, { role: 'ai', text }])
  const addUser = (text: string) => setMessages(m => [...m, { role: 'user', text }])

  // ─── フェーズ1: 査定 ─────────────────────────────
  const selectIndustry = (ind: string) => {
    addUser(ind)
    setData(d => ({ ...d, industry: ind }))
    setStep('revenue')
    addAI('直近の年商はどのくらいですか？')
  }

  const selectRevenue = (opt: typeof revenueOptions[0]) => {
    addUser(opt.label)
    setData(d => ({ ...d, revenue: opt.value, revenueLabel: opt.label }))
    setStep('profit')
    addAI('営業利益はいかがでしょうか？')
  }

  const selectProfit = (opt: typeof profitOptions[0]) => {
    addUser(opt.label)
    setData(d => ({ ...d, profit: opt.value, profitLabel: opt.label }))
    setStep('employees')
    addAI('従業員数を教えてください。（数字で入力）')
  }

  const submitEmployees = () => {
    const v = inputVal.trim()
    if (!v || isNaN(Number(v)) || Number(v) < 0) {
      setInputError('正しい人数を入力してください')
      return
    }
    addUser(`${v}人`)
    setData(d => ({ ...d, employees: v }))
    setInputVal(''); setInputError('')
    setStep('founded')
    addAI('創業年度を西暦で教えてください。（例：2005）')
  }

  const submitFounded = () => {
    const v = inputVal.trim()
    const year = Number(v)
    if (!v || isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      setInputError('正しい西暦を入力してください')
      return
    }
    addUser(`${v}年`)
    const d = { ...data, founded: v }
    setData(d)
    setInputVal(''); setInputError('')

    // 概算計算
    const bonus = industryBonus[d.industry] ?? 1.0
    const base  = d.revenue * d.profit * bonus
    const low   = Math.round(base * 0.8)
    const high  = Math.round(base * 1.3)
    setStep('result')
    addAI(
      `ありがとうございます！概算査定額をお伝えします。\n\n` +
      `📊 想定売却価格レンジ\n━━━━━━━━━━━\n` +
      `${fmt(low)} 〜 ${fmt(high)}\n━━━━━━━━━━━\n\n` +
      `※簡易概算です。詳細査定をご希望の方は\nご連絡先をご入力ください。`
    )
  }

  // ─── フェーズ2: 連絡先収集 ───────────────────────
  const startContact = () => {
    setStep('companyName')
    addAI('会社名を教えてください。')
  }

  const submitCompanyName = () => {
    const v = inputVal.trim()
    if (!v) { setInputError('会社名を入力してください'); return }
    addUser(v)
    setData(d => ({ ...d, companyName: v }))
    setInputVal(''); setInputError('')
    setStep('repName')
    addAI('代表者のお名前を教えてください。')
  }

  const submitRepName = () => {
    const v = inputVal.trim()
    if (!v) { setInputError('お名前を入力してください'); return }
    addUser(v)
    setData(d => ({ ...d, repName: v }))
    setInputVal(''); setInputError('')
    setStep('phone')
    addAI('電話番号を教えてください。')
  }

  const submitPhone = () => {
    const v = inputVal.trim()
    if (!v || !/^[\d-]+$/.test(v)) {
      setInputError('正しい電話番号を入力してください')
      return
    }
    addUser(v)
    setData(d => ({ ...d, phone: v }))
    setInputVal(''); setInputError('')
    setStep('email')
    addAI('メールアドレスを教えてください。')
  }

  const submitEmail = () => {
    const v = inputVal.trim()
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setInputError('正しいメールアドレスを入力してください')
      return
    }
    addUser(v)
    setData(d => ({ ...d, email: v }))
    setInputVal(''); setInputError('')
    setStep('confirm')
    addAI('ありがとうございます！以下の内容でご登録できます。\n下のボタンを押してください。')
  }

  // ─── フェーズ3: GAS送信 ──────────────────────────
  const handleRegister = async () => {
    setSending(true)
    const payload: Record<string, string> = {
      companyName:    data.companyName,
      repName:        data.repName,
      phone:          data.phone,
      email:          data.email,
      industry:       data.industry,
      revenue:        data.revenueLabel,
      profit:         data.profitLabel,
      employees:      data.employees,
      founded:        data.founded,
      source:         'ai_chat',
    }
    const ok = await submitToGAS(payload, 'seller')
    setSending(false)
    setStep('done')
    addAI(
      ok
        ? 'ご登録ありがとうございます。\n担当者より2営業日以内にご連絡いたします。'
        : '送信中にエラーが発生しました。お手数ですがフォームよりご登録ください。'
    )
  }

  const reset = () => {
    setMessages([{ role: 'ai', text: 'こんにちは！まず業種を教えてください。' }])
    setStep('industry'); setData(INIT_DATA); setInputVal(''); setInputError('')
  }

  // ─── 入力ステップかどうか ────────────────────────
  const isTextStep = (s: Step): boolean =>
    ['employees', 'founded', 'companyName', 'repName', 'phone', 'email'].includes(s)

  const getInputType = (): string => {
    if (step === 'phone')  return 'tel'
    if (step === 'email')  return 'email'
    if (['employees', 'founded'].includes(step)) return 'number'
    return 'text'
  }

  const getInputMode = (): 'numeric' | 'tel' | 'email' | 'text' => {
    if (['employees', 'founded'].includes(step)) return 'numeric'
    if (step === 'phone')  return 'tel'
    if (step === 'email')  return 'email'
    return 'text'
  }

  const getPlaceholder = (): string => {
    const map: Partial<Record<Step, string>> = {
      employees:   '例：10',
      founded:     '例：2005',
      companyName: '株式会社〇〇',
      repName:     '山田 太郎',
      phone:       '090-0000-0000',
      email:       'example@example.com',
    }
    return map[step] ?? ''
  }

  const handleTextSubmit = () => {
    setInputError('')
    switch (step) {
      case 'employees':   submitEmployees(); break
      case 'founded':     submitFounded();   break
      case 'companyName': submitCompanyName(); break
      case 'repName':     submitRepName();   break
      case 'phone':       submitPhone();     break
      case 'email':       submitEmail();     break
    }
  }

  return (
    <>
      {/* ─── 右下固定エリア ─── */}
      <div className="fixed bottom-6 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">

        {/* 吹き出し */}
        {showBalloon && !open && (
          <div
            className="relative cursor-pointer select-none"
            onClick={handleToggle}
            style={{ animation: 'slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <div className="bg-white border-2 border-[#C8A96E] rounded-2xl rounded-br-none px-4 py-3 shadow-xl max-w-[200px]">
              <button
                onClick={dismissBalloon}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs leading-none transition-colors"
                aria-label="閉じる"
              >×</button>
              <p className="text-[#0A1F44] font-bold text-sm leading-snug mb-1">📊 無料で売却価格を査定！</p>
              <p className="text-[#4A5568] text-xs leading-relaxed">質問に答えるだけで<br />概算価格がわかります</p>
              <div className="mt-2 text-[10px] text-[#C8A96E] font-bold">▶ 今すぐ試す（無料）</div>
            </div>
          </div>
        )}

        {/* メインボタン */}
        <div className="relative">
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
              background: open ? '#1E3A6E' : 'linear-gradient(135deg, #0A1F44 0%, #1E3A6E 100%)',
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
          className={`fixed z-50 shadow-2xl overflow-hidden border border-[#1E3A6E] flex flex-col ${
            isMobile
              ? 'inset-0 w-full rounded-none'
              : 'bottom-28 right-6 w-[340px] max-w-[calc(100vw-1.5rem)] rounded-2xl'
          }`}
          style={{
            height: isMobile ? '100dvh' : 'min(500px, calc(100dvh - 120px))',
            animation: 'slideInUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
          }}
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
              <button onClick={reset} className="text-white/40 hover:text-white text-xs underline">リセット</button>
              <button onClick={handleClose} className="text-white/40 hover:text-white" aria-label="閉じる">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* メッセージ（スクロール領域） */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F7FA] overscroll-contain">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && <AIIcon />}
                <div
                  className={`max-w-[78%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
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

          {/* ─── 入力エリア（flex-shrink-0 で常に画面内に固定） ─── */}
          <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3">

            {/* 業種 */}
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

            {/* 年商 */}
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

            {/* 利益 */}
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

            {/* テキスト・数値入力 */}
            {isTextStep(step) && (
              <div className="space-y-1.5">
                {inputError && (
                  <p className="text-red-500 text-xs px-1">{inputError}</p>
                )}
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type={getInputType()}
                    inputMode={getInputMode()}
                    value={inputVal}
                    onChange={e => { setInputVal(e.target.value); setInputError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#C8A96E]"
                    placeholder={getPlaceholder()}
                  />
                  <button
                    onClick={handleTextSubmit}
                    className="bg-[#0A1F44] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A6E] transition-colors flex-shrink-0"
                  >
                    送信
                  </button>
                </div>
              </div>
            )}

            {/* 概算結果 → 詳細査定へ誘導 */}
            {step === 'result' && (
              <button onClick={startContact}
                className="w-full bg-[#C8A96E] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#b8976a] transition-colors">
                詳細査定・買い手マッチングに進む
              </button>
            )}

            {/* 登録確認ボタン */}
            {step === 'confirm' && (
              <button
                onClick={handleRegister}
                disabled={sending}
                className="w-full bg-[#0A1F44] disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#1E3A6E] transition-colors"
              >
                {sending ? '送信中...' : '登録する（無料）'}
              </button>
            )}

            {/* 完了後 → フォームへ */}
            {step === 'done' && (
              <button
                onClick={() => document.getElementById('tab-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-[#C8A96E] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#b8976a] transition-colors">
                詳細フォームから登録する
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
