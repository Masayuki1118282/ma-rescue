'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToTab = (tab: 'seller' | 'buyer') => {
    document.getElementById('tab-section')?.scrollIntoView({ behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('ma:setTab', { detail: tab }))
    setMenuOpen(false)
  }

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('ma:openChat'))
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A1F44] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <span
          className="text-xl font-bold text-white cursor-pointer"
          style={{ fontFamily: 'var(--font-serif)' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-[#C8A96E]">M&A</span>レスキュー
        </span>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <button onClick={() => goToTab('seller')} className="hover:text-[#C8A96E] transition-colors">
            売りたい方へ
          </button>
          <button onClick={() => goToTab('buyer')} className="hover:text-[#C8A96E] transition-colors">
            買いたい方へ
          </button>
          <button
            onClick={openChat}
            className="bg-[#C8A96E] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#b8976a] transition-colors"
          >
            無料査定
          </button>
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <div className="space-y-1">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A1F44] border-t border-[#1E3A6E] px-4 py-4 space-y-3">
          <button onClick={() => goToTab('seller')} className="block w-full text-left text-white py-2 hover:text-[#C8A96E]">
            売りたい方へ
          </button>
          <button onClick={() => goToTab('buyer')} className="block w-full text-left text-white py-2 hover:text-[#C8A96E]">
            買いたい方へ
          </button>
          <button
            onClick={openChat}
            className="block w-full bg-[#C8A96E] text-white py-2 px-4 rounded text-center font-medium"
          >
            無料査定
          </button>
        </div>
      )}
    </header>
  )
}
