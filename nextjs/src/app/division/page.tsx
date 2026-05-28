import Link from 'next/link'
import DivisionList from './DivisionList'

export const metadata = {
  title: 'Danh sách Bộ phận',
}

export default function DivisionPage() {
  return (
    <div className="min-h-screen p-8 bg-surface-container-lowest">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold text-on-surface">Danh sách Bộ phận</h1>
        <Link 
          href="/division/new" 
          className="h-10 px-4 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full flex items-center transition-colors"
        >
          Thêm Bộ phận
        </Link>
      </div>
      <DivisionList />
    </div>
  )
}

