'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

import {
  Product,
  Warehouse,
  Division,
  Unit,
  CreateGRNDto,
  GRNProductDto,
} from '../../../shared/types/api'
import FormField from '../../../shared/components/FormField'
import AccountingSection from './AccountingSection'
import SignatureSection from './SignatureSection'
import numberToWords from '../../../shared/utils/number-to-words'

/* eslint-disable */
const GRNForm = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateGRNDto>>({
    receipt_date: new Date().toISOString().split('T')[0],
    debit_amount: 0,
    credit_amount: 0,
    source_documents: 0,
    preparer_name: '',
    deliverer_name: '',
    storekeeper_name: '',
    chief_accountant_name: '',
    products: [{ product_id: 0, qty_actual: 0, qty_document: 0, unit_price: 0 }],
  })

  // ─── Data Fetching with React Query ─────────────────────
  const { data: whData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/warehouses')
      return res.json()
    },
  })

  const { data: divData } = useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/divisions')
      return res.json()
    },
  })

  const { data: prodData } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/products')
      return res.json()
    },
  })

  const warehouses: Warehouse[] = whData?.data || []
  const divisions: Division[] = divData?.data || []
  const productsList: Product[] = prodData?.data || []

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductChange = (index: number, field: keyof GRNProductDto, value: any) => {
    const updatedProducts = [...(formData.products || [])]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...(prev.products || []), { product_id: 0, qty_actual: 0, qty_document: 0, unit_price: 0 }],
    }))
  }

  const removeProduct = (index: number) => {
    const updatedProducts = (formData.products || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const calculateTotal = () => (formData.products || []).reduce((sum, p) => sum + (p.qty_actual * p.unit_price), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/goods-received-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Tạo phiếu nhập kho thành công!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error?.message || 'Có lỗi xảy ra khi tạo phiếu.')
      }
    } catch (error) {
      toast.error('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = calculateTotal()

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-4 mt-stack-md flex flex-col gap-stack-lg">
      <div className="bg-white rounded-xl paper-shadow p-stack-md flex flex-col gap-stack-lg border border-outline-variant">

        <section className="grid grid-cols-1 gap-stack-md">
          <div className="grid grid-cols-2 gap-stack-md">
            <FormField label="NGÀY LẬP">
              <input
                name="receipt_date"
                value={formData.receipt_date || ''}
                onChange={(e) => handleChange('receipt_date', e.target.value)}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                type="date"
                required
              />
            </FormField>
            <div className="grid grid-cols-2 gap-stack-md">
              <FormField label="NỢ">
                <input
                  name="debit_amount"
                  value={formData.debit_amount || 0}
                  onChange={(e) => handleChange('debit_amount', parseFloat(e.target.value) || 0)}
                  className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                  type="number"
                />
              </FormField>
              <FormField label="CÓ">
                <input
                  name="credit_amount"
                  value={formData.credit_amount || 0}
                  onChange={(e) => handleChange('credit_amount', parseFloat(e.target.value) || 0)}
                  className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                  type="number"
                />
              </FormField>
            </div>
          </div>

          <FormField label="KHO HÀNG">
            <select
              name="warehouse_id"
              value={formData.warehouse_id || ''}
              onChange={(e) => handleChange('warehouse_id', parseInt(e.target.value, 10))}
              className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
              required
            >
              <option value="">Chọn kho...</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>{wh.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="BỘ PHẬN / PHÒNG BAN">
            <select
              name="division_id"
              value={formData.division_id || ''}
              onChange={(e) => handleChange('division_id', parseInt(e.target.value, 10))}
              className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="">Chọn bộ phận...</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>{div.name}</option>
              ))}
            </select>
          </FormField>
        </section>

        <hr className="border-outline-variant" />

        <section className="flex flex-col gap-stack-md">
          <FormField label="HỌ TÊN NGƯỜI GIAO">
            <input
              name="deliverer_name"
              value={formData.deliverer_name || ''}
              onChange={(e) => handleChange('deliverer_name', e.target.value)}
              className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
              placeholder="Nhập tên người giao hàng..."
              type="text"
            />
          </FormField>
        </section>

        <hr className="border-outline-variant" />

        <section className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-center">
            <h2 className="font-title-sm text-title-sm text-primary uppercase">Danh mục vật tư</h2>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-1 text-secondary font-label-caps text-label-caps"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              {' '}
              THÊM
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {(formData.products || []).map((p, index) => {
              const selectedProduct = productsList.find((pl) => pl.id === p.product_id)
              return (
                <div key={`${p.product_id}-${index}`} className="border border-outline-variant rounded-lg p-4 bg-white relative">
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="absolute top-2 right-2 text-error"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField label="VẬT TƯ">
                      <select
                        value={p.product_id || ''}
                        onChange={(e) => handleProductChange(index, 'product_id', parseInt(e.target.value, 10))}
                        className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                        required
                      >
                        <option value="">Chọn vật tư...</option>
                        {productsList.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    {selectedProduct && (
                      <div className="flex gap-4 items-end pb-2">
                        <div className="flex flex-col">
                          <span className="text-outline text-[10px] uppercase font-bold">Mã số</span>
                          <span className="font-bold text-primary">{selectedProduct.code}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-outline text-[10px] uppercase font-bold">ĐVT</span>
                          <span className="font-bold text-primary">{selectedProduct.calculation_unit || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-surface p-3 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-outline text-[10px] uppercase font-bold">Theo chứng từ</span>
                      <input
                        value={p.qty_document || 0}
                        onChange={(e) => handleProductChange(index, 'qty_document', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                        type="number"
                        step="0.001"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-outline text-[10px] uppercase font-bold">Thực nhập</span>
                      <input
                        value={p.qty_actual || 0}
                        onChange={(e) => handleProductChange(index, 'qty_actual', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                        type="number"
                        step="0.001"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-outline text-[10px] uppercase font-bold">Đơn giá</span>
                      <input
                        value={p.unit_price || 0}
                        onChange={(e) => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-outline text-[10px] uppercase font-bold mr-2">Thành tiền:</span>
                    <span className="font-bold text-secondary">
                      {(p.qty_actual * p.unit_price).toLocaleString('vi-VN')}
                      {' '}
                      VNĐ
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <AccountingSection
          total={totalAmount}
          totalInWords={numberToWords(totalAmount)}
          sourceDocs={formData.source_documents || 0}
          onSourceDocsChange={(val) => handleChange('source_documents', val)}
        />

        <SignatureSection
          preparer={formData.preparer_name || ''}
          deliverer={formData.deliverer_name || ''}
          storekeeper={formData.storekeeper_name || ''}
          accountant={formData.chief_accountant_name || ''}
          onPreparerChange={(val) => handleChange('preparer_name', val)}
          onDelivererChange={(val) => handleChange('deliverer_name', val)}
          onStorekeeperChange={(val) => handleChange('storekeeper_name', val)}
          onAccountantChange={(val) => handleChange('chief_accountant_name', val)}
        />
      </div>

      <div className="flex flex-col gap-stack-sm mb-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu phiếu'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full bg-transparent text-on-surface-variant border border-outline-variant font-bold py-4 rounded-xl hover:bg-surface-container transition-colors"
        >
          Hủy bỏ
        </button>
      </div>
    </form>
  )
}

export default GRNForm
