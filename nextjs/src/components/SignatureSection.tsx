'use client'

import React from 'react'

interface SignatureSectionProps {
  preparer: string
  deliverer: string
  storekeeper: string
  accountant: string
  onPreparerChange: (val: string) => void
  onDelivererChange: (val: string) => void
  onStorekeeperChange: (val: string) => void
  onAccountantChange: (val: string) => void
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  preparer,
  deliverer,
  storekeeper,
  accountant,
  onPreparerChange,
  onDelivererChange,
  onStorekeeperChange,
  onAccountantChange,
}) => (
  <section className="grid grid-cols-2 gap-stack-md py-4">
    <div className="flex flex-col items-center text-center gap-2">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">NGƯỜI LẬP PHIẾU</span>
      <input
        value={preparer}
        onChange={(e) => onPreparerChange(e.target.value)}
        className="border-outline-variant rounded-lg font-body-sm p-1 w-full text-center"
        placeholder="Họ tên..."
      />
    </div>
    <div className="flex flex-col items-center text-center gap-2">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">NGƯỜI GIAO HÀNG</span>
      <input
        disabled
        value={deliverer}
        onChange={(e) => onDelivererChange(e.target.value)}
        className="border-outline-variant rounded-lg font-body-sm p-1 w-full text-center"
        placeholder="Họ tên..."
      />
    </div>
    <div className="flex flex-col items-center text-center gap-2">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">THỦ KHO</span>
      <input
        value={storekeeper}
        onChange={(e) => onStorekeeperChange(e.target.value)}
        className="border-outline-variant rounded-lg font-body-sm p-1 w-full text-center"
        placeholder="Họ tên..."
      />
    </div>
    <div className="flex flex-col items-center text-center gap-2">
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">KẾ TOÁN TRƯỞNG</span>
      <input
        value={accountant}
        onChange={(e) => onAccountantChange(e.target.value)}
        className="border-outline-variant rounded-lg font-body-sm p-1 w-full text-center"
        placeholder="Họ tên..."
      />
    </div>
  </section>
)

export default SignatureSection
