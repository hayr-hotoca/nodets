'use client'

import { useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import QueryProvider from '../providers/QueryProvider'
import ModalExample, { ModalExampleRef } from '../components/ModalExample'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { AuthGuard } from '../components/auth/AuthGuard'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Navigation = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  if (!isAuthenticated || pathname === '/login') return null

  return (
    <nav className="bg-primary-container text-on-primary-container p-4 flex flex-wrap gap-4 items-center font-medium shadow-md">
      <div className="flex-1 flex gap-4">
        <Link href="/division" className="hover:text-primary transition-colors">
          Danh sách Bộ phận
        </Link>
        <Link href="/division/new" className="hover:text-primary transition-colors">
          Thêm Bộ phận
        </Link>
        <Link href="/goods-received-note" className="hover:text-primary transition-colors">
          Lập Phiếu Nhập Kho
        </Link>
        <button
          type="button"
          className="px-4 py-2 bg-secondary text-on-secondary rounded-lg transition-colors hover:opacity-90"
          onClick={onOpenModal}
        >
          Open Modal
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-[12px] opacity-70">Xin chào,</span>
          <span className="font-bold">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Đăng xuất"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </nav>
  )
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const modalExampleRef = useRef<ModalExampleRef>(null)

  const openModal = () => {
    modalExampleRef.current?.openModal()
  }

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <QueryProvider>
            <AuthGuard>
              <Navigation onOpenModal={openModal} />
              {children}
              <Toaster position="top-right" />
              <ModalExample ref={modalExampleRef} />
            </AuthGuard>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
