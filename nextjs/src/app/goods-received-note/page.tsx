import GRNForm from '../../components/GRNForm'

const GoodsReceivedNotePage = () => (
  <div className="bg-surface text-on-surface min-h-screen pb-24">
    {/* Top App Bar */}
    <header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-gutter h-16 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          <button type="button" className="active:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-primary dark:text-inverse-primary truncate">Phiếu Nhập Kho</h1>
        </div>
        <button type="button" className="active:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary dark:text-inverse-primary">print</span>
        </button>
      </div>
    </header>

    <main>
      <GRNForm />
    </main>

    {/* Bottom Navigation Bar */}
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        <div className="flex flex-col items-center justify-center text-outline dark:text-outline-variant active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps">Trang chủ</span>
        </div>
        <div className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-bold active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
          <span className="font-label-caps text-label-caps">Nhập kho</span>
        </div>
        <div className="flex flex-col items-center justify-center text-outline dark:text-outline-variant active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps">Quét mã</span>
        </div>
        <div className="flex flex-col items-center justify-center text-outline dark:text-outline-variant active:scale-95 transition-transform cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-caps text-label-caps">Cài đặt</span>
        </div>
      </div>
    </nav>
  </div>
)

export default GoodsReceivedNotePage
