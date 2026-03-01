'use client'

import { useState } from 'react'
import { submitToGAS } from '@/lib/submitToGAS'

const industries = [
  '製造業', 'IT・Web', '建設業', '飲食業', '小売業', '卸売業',
  '運輸業', '医療・介護', '不動産', 'サービス業', '農業・食品',
  '印刷業', '観光・宿泊', 'エネルギー', 'その他',
]

const revenueOptions = [
  '〜1000万円', '〜5000万円', '〜1億円', '〜5億円', '5億円以上',
]

const acquisitionScales = [
  '〜5000万円', '〜1億円', '〜3億円', '〜10億円', '10億円以上',
]

type FormData = {
  companyName: string
  corporateNumber: string
  representativeName: string
  postalCode: string
  address: string
  phone: string
  email: string
  website: string
  industry: string
  revenue: string
  acquisitionIndustries: string[]
  acquisitionScale: string
}

const initial: FormData = {
  companyName: '', corporateNumber: '', representativeName: '', postalCode: '',
  address: '', phone: '', email: '', website: '', industry: '', revenue: '',
  acquisitionIndustries: [], acquisitionScale: '',
}

export default function BuyerForm() {
  const [form, setForm] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }))

  const toggleIndustry = (ind: string) => {
    setForm(f => ({
      ...f,
      acquisitionIndustries: f.acquisitionIndustries.includes(ind)
        ? f.acquisitionIndustries.filter(i => i !== ind)
        : [...f.acquisitionIndustries, ind],
    }))
  }

  const fetchAddress = async (postal: string) => {
    const clean = postal.replace(/-/g, '')
    if (clean.length !== 7) return
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${clean}`)
      const data = await res.json()
      if (data.results?.[0]) {
        const r = data.results[0]
        setForm(f => ({ ...f, address: `${r.address1}${r.address2}${r.address3}` }))
      }
    } catch {}
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.companyName) e.companyName = '会社名は必須です'
    if (!form.representativeName) e.representativeName = '代表者氏名は必須です'
    if (form.corporateNumber && !/^\d{13}$/.test(form.corporateNumber)) {
      e.corporateNumber = '法人番号は13桁の数字で入力してください'
    }
    if (!form.phone || !/^[\d-]+$/.test(form.phone)) e.phone = '正しい電話番号を入力してください'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '正しいメールアドレスを入力してください'
    if (!form.industry) e.industry = '業種を選択してください'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const submitData = {
      ...form,
      acquisitionIndustries: form.acquisitionIndustries.join('、'),
    }
    const ok = await submitToGAS(submitData as Record<string, string>, 'buyer')
    setLoading(false)
    if (ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-[#F5F7FA] rounded-xl">
        <div className="w-16 h-16 bg-[#2D8A6E] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A1F44] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          ご登録ありがとうございます
        </h3>
        <p className="text-[#4A5568]">
          担当者より2営業日以内にご連絡いたします。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="会社名" required error={errors.companyName}>
          <input
            type="text" value={form.companyName} onChange={set('companyName')}
            className={inputCls(errors.companyName)} placeholder="株式会社〇〇"
          />
        </Field>
        <Field label="法人番号（13桁）" error={errors.corporateNumber}>
          <input
            type="text" value={form.corporateNumber} onChange={set('corporateNumber')}
            className={inputCls(errors.corporateNumber)} placeholder="1234567890123"
            maxLength={13}
          />
        </Field>
      </div>

      <Field label="代表者氏名" required error={errors.representativeName}>
        <input
          type="text" value={form.representativeName} onChange={set('representativeName')}
          className={inputCls(errors.representativeName)} placeholder="山田 太郎"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="郵便番号">
          <input
            type="text" value={form.postalCode}
            onChange={e => { set('postalCode')(e); fetchAddress(e.target.value) }}
            className={inputCls()} placeholder="000-0000" maxLength={8}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="住所">
            <input
              type="text" value={form.address} onChange={set('address')}
              className={inputCls()} placeholder="自動入力されます"
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="電話番号" required error={errors.phone}>
          <input
            type="tel" value={form.phone} onChange={set('phone')}
            className={inputCls(errors.phone)} placeholder="03-0000-0000"
          />
        </Field>
        <Field label="メールアドレス" required error={errors.email}>
          <input
            type="email" value={form.email} onChange={set('email')}
            className={inputCls(errors.email)} placeholder="example@company.jp"
          />
        </Field>
      </div>

      <Field label="ホームページ（任意）">
        <input
          type="url" value={form.website} onChange={set('website')}
          className={inputCls()} placeholder="https://www.example.jp"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="業種" required error={errors.industry}>
          <select value={form.industry} onChange={set('industry')} className={inputCls(errors.industry)}>
            <option value="">選択してください</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="年商">
          <select value={form.revenue} onChange={set('revenue')} className={inputCls()}>
            <option value="">選択してください</option>
            {revenueOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <Field label="買収希望業種（複数選択可）">
        <div className="flex flex-wrap gap-2 mt-1">
          {industries.map(ind => (
            <button
              key={ind}
              type="button"
              onClick={() => toggleIndustry(ind)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                form.acquisitionIndustries.includes(ind)
                  ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                  : 'bg-white text-[#4A5568] border-gray-200 hover:border-[#C8A96E]'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </Field>

      <Field label="買収希望規模">
        <select value={form.acquisitionScale} onChange={set('acquisitionScale')} className={inputCls()}>
          <option value="">選択してください</option>
          {acquisitionScales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0A1F44] hover:bg-[#1E3A6E] disabled:opacity-60 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
      >
        {loading ? '送信中...' : '売却希望企業リストを閲覧する（無料）'}
      </button>
      <p className="text-center text-xs text-[#4A5568]">
        登録は無料です。成約時のみ手数料が発生します。
      </p>
    </form>
  )
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0A1F44] mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#C8A96E] transition-all ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
  }`
}
