import { Toaster } from 'react-hot-toast'
import './globals.css'
import QueryProvider from '../providers/QueryProvider'

export const metadata = {
  title: 'Phiếu Nhập Kho - Hệ thống Quản lý',
  description: 'Hệ thống quản lý phiếu nhập kho',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="vi">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </head>
    <body>
      <QueryProvider>
        {children}
        <Toaster position="top-right" />
      </QueryProvider>
    </body>
  </html>
)

export default RootLayout
