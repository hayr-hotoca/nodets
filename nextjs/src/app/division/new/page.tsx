import DivisionForm from '../../../modules/division/components/DivisionForm'

export const metadata = {
  title: 'Thêm Bộ phận',
}

export default function NewDivisionPage() {
  return (
    <div className="min-h-screen p-8 bg-surface-container-lowest">
      <DivisionForm />
    </div>
  )
}
