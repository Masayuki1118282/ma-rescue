export default function Footer() {
  return (
    <footer className="bg-[#0A1F44] text-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div>
            <h3
              className="text-2xl font-black mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <span className="text-[#C8A96E]">M&A</span>レスキュー
            </h3>
            <p className="text-white/60 text-sm">急いでいても、高く売れる。</p>
          </div>
          <div className="text-sm text-white/60 space-y-1">
            <p>〒502-3217 岐阜県関市下有知492-1</p>
            <p>株式会社ソウゾウ</p>
            <p>Email: <a href="mailto:info@souzou-gifu.com" className="hover:text-[#C8A96E] transition-colors">info@souzou-gifu.com</a></p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-white/50">
            <a href="/privacy" className="hover:text-[#C8A96E] transition-colors">プライバシーポリシー</a>
            <a href="/terms" className="hover:text-[#C8A96E] transition-colors">利用規約</a>
            <a href="https://souzou-gifu.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8A96E] transition-colors">会社概要</a>
          </div>
          <p className="text-white/30 text-sm">
            © 2025 M&Aレスキュー All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
