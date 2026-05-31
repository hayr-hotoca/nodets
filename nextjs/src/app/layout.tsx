'use client'

import { useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import QueryProvider from '../providers/QueryProvider'
import ModalExample, { ModalExampleRef } from '../components/ModalExample'

const metadata = {
  title: 'Phiếu Nhập Kho - Hệ thống Quản lý',
  description: 'Hệ thống quản lý phiếu nhập kho',
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
        <QueryProvider>
          <nav className="bg-blue-600 text-white p-4 flex flex-wrap gap-4 items-center font-medium shadow-md">
            <a
              href="/division"
              className="hover:text-blue-200 transition-colors"
            >
              Danh sách Bộ phận
            </a>
            <a
              href="/division/new"
              className="hover:text-blue-200 transition-colors"
            >
              Thêm Bộ phận
            </a>
            <a
              href="/goods-received-note"
              className="hover:text-blue-200 transition-colors"
            >
              Lập Phiếu Nhập Kho
            </a>

            <button
              type="button"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
              onClick={openModal}
            >
              Open Modal
            </button>
          </nav>

          {children}
          <Toaster position="top-right" />
          <ModalExample ref={modalExampleRef} />
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
