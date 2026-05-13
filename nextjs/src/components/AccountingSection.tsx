'use client'

import React from 'react'

interface AccountingSectionProps {
  total: number
  totalInWords: string
  sourceDocs: number
  onSourceDocsChange: (val: number) => void
}

const AccountingSection: React.FC<AccountingSectionProps> = ({
  total,
  totalInWords,
  sourceDocs,
  onSourceDocsChange,
}) => (
  <section className="bg-surface-container text-on-surface-variant rounded-xl p-stack-md flex flex-col gap-3 border border-outline-variant">
    <div className="flex justify-between items-center">
      <span className="font-title-sm uppercase text-primary">Thành tiền</span>
      <div className="text-right">
        <span className="font-headline-md font-bold text-secondary">
          {total.toLocaleString('vi-VN')}
          {' '}
          VNĐ
        </span>
      </div>
    </div>
    <div className="bg-white p-2 rounded text-[12px] italic border border-outline-variant">
      <span className="text-on-surface-variant/80 font-bold">Bằng chữ: </span>
      <span className="text-primary">{totalInWords || 'Không đồng.'}</span>
    </div>
    <div className="flex flex-col gap-1 mt-2">
      <label htmlFor="source-docs" className="font-label-caps text-label-caps text-on-surface-variant uppercase">
        SỐ CHỨNG TỪ GỐC KÈM THEO
        <input
          id="source-docs"
          value={sourceDocs}
          onChange={(e) => onSourceDocsChange(parseInt(e.target.value, 10) || 0)}
          className="border border-outline-variant rounded p-1 w-20 focus:ring-1 focus:ring-secondary mt-1 block"
          type="number"
        />
      </label>
    </div>
  </section>
)

export default AccountingSection
