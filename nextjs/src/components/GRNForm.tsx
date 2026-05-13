'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import {
  Product,
  Warehouse,
  Division,
  Unit,
  CreateGRNDto,
  GRNProductDto,
} from '../types/api'
import FormField from './FormField'
import AccountingSection from './AccountingSection'
import SignatureSection from './SignatureSection'
import numberToWords from '../utils/number-to-words'

/* eslint-disable */
const GRNForm = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<CreateGRNDto>>({
    receipt_date: new Date().toISOString().split('T')[0],
    debit_amount: 0,
    credit_amount: 0,
    source_documents: 0,
    preparer_name: '',
    deliverer_name: '',
    storekeeper_name: '',
    chief_accountant_name: '',
    ref_doc_type: '',
    ref_doc_number: '',
    ref_doc_date: '',
    ref_doc_issuer: '',
    products: [{
      id: Date.now(),
      product_id: 0,
      qty_actual: 0,
      qty_document: 0,
      unit_price: 0,
    }],
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true)
      try {
        const [whRes, unitRes, divRes, prodRes] = await Promise.all([
          fetch('http://localhost:3001/api/warehouses'),
          fetch('http://localhost:3001/api/units'),
          fetch('http://localhost:3001/api/divisions'),
          fetch('http://localhost:3001/api/products'),
        ])

        const whData = await whRes.json()
        const unitData = await unitRes.json()
        const divData = await divRes.json()
        const prodData = await prodRes.json()

        setWarehouses(whData.data || [])
        setUnits(unitData.data || [])
        setDivisions(divData.data || [])
        setProductsList(prodData.data || [])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', error)
      } finally {
        setIsDataLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (name: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductChange = (
    index: number,
    field: keyof GRNProductDto,
    value: number,
  ) => {
    const updatedProducts = [...(formData.products || [])]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...(prev.products || []),
        {
          id: Date.now(),
          product_id: 0,
          qty_actual: 0,
          qty_document: 0,
          unit_price: 0,
        },
      ],
    }))
  }

  const removeProduct = (index: number) => {
    const updatedProducts = (formData.products || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const calculateTotal = () => (
    (formData.products || []).reduce((sum, p) => sum + (p.qty_actual * p.unit_price), 0)
  )

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
        toast.error(errorData.error?.message
          + ' - '
          + errorData.error?.details.map((d: { message: string }) => d.message).join(', ')
          + ' - '
          + errorData.error?.details.map((d: { field: string }) => d.field).join(', ')
          || 'Có lỗi xảy ra khi tạo phiếu.')
      }
    } catch (error) {
      toast.error('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  const selectedWarehouse = warehouses.find((w) => w.id == formData.warehouse_id)
  const totalAmount = calculateTotal()

  return (
    <>
      {isDataLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-all duration-300">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-outline-variant animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-secondary/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-black text-secondary uppercase tracking-[0.2em] text-sm animate-pulse">
                api data loading
              </p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      )}

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

          <FormField label="ĐƠN VỊ">
            <select
              name="unit_id"
              value={selectedUnitId || ''}
              onChange={(e) => {
                const unitId = e.target.value ? parseInt(e.target.value, 10) : null
                setSelectedUnitId(unitId)
                // Reset division when unit changes
                handleChange('division_id', undefined)
              }}
              className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="">Chọn đơn vị...</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </FormField>

          {selectedUnitId && (
            <FormField label="BỘ PHẬN / PHÒNG BAN">
              <select
                name="division_id"
                value={formData.division_id || ''}
                onChange={(e) => handleChange('division_id', parseInt(e.target.value, 10))}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
              >
                <option value="">Chọn bộ phận...</option>
                {divisions
                  .filter((div) => !selectedUnitId || div.unit_id == selectedUnitId)
                  .map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
              </select>
            </FormField>
          )}
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md">
            <FormField label="THEO">
              <input
                name="ref_doc_type"
                value={formData.ref_doc_type || ''}
                onChange={(e) => handleChange('ref_doc_type', e.target.value)}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Loại chứng từ (HĐ, ĐH...)"
                type="text"
              />
            </FormField>
            <FormField label="SỐ">
              <input
                name="ref_doc_number"
                value={formData.ref_doc_number || ''}
                onChange={(e) => handleChange('ref_doc_number', e.target.value)}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Số chứng từ..."
                type="text"
              />
            </FormField>
            <FormField label="NGÀY">
              <input
                name="ref_doc_date"
                value={formData.ref_doc_date || ''}
                onChange={(e) => handleChange('ref_doc_date', e.target.value)}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                type="date"
              />
            </FormField>
            <FormField label="CỦA">
              <input
                name="ref_doc_issuer"
                value={formData.ref_doc_issuer || ''}
                onChange={(e) => handleChange('ref_doc_issuer', e.target.value)}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Đơn vị phát hành..."
                type="text"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md items-start items-center">
            <FormField label="NHẬP TẠI KHO">
              <select
                name="warehouse_id"
                value={formData.warehouse_id || ''}
                onChange={(e) => handleChange('warehouse_id', parseInt(e.target.value, 10))}
                className="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                required
              >
                <option value="">Chọn kho...</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </FormField>

            {selectedWarehouse && (
              <div className="flex gap-4 mt-7">
                {selectedWarehouse.location && (
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px] uppercase font-bold">Địa điểm</span>
                    <span className="font-bold text-primary">
                      {selectedWarehouse.location}
                    </span>
                  </div>
                )}
                {selectedWarehouse.address && (
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px] uppercase font-bold">Địa chỉ</span>
                    <span className="font-bold text-primary">
                      {selectedWarehouse.address}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
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
              <span>THÊM</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {(formData.products || []).map((p, index) => {
              const selectedProduct = productsList.find((pl) => pl.id == p.product_id)

              return (
                <div key={p.id || index} className="border border-outline-variant rounded-lg p-4 bg-white relative">
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
                        className={[
                          'border-outline-variant rounded-lg font-body-md text-body-md',
                          'p-2 focus:ring-secondary focus:border-secondary w-full',
                        ].join(' ')}
                        required
                      >
                        <option value="">Chọn vật tư...</option>
                        {productsList.map((prod) => (
                          <option
                            disabled={!!(formData.products?.length
                              && formData.products.find((pd) => pd.product_id == prod.id))}
                            key={prod.id}
                            value={prod.id}
                          >
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
                        className="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
                        type="number"
                        step="0.001"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-outline text-[10px] uppercase font-bold">Thực nhập</span>
                      <input
                        value={p.qty_actual || 0}
                        onChange={(e) => handleProductChange(index, 'qty_actual', parseFloat(e.target.value) || 0)}
                        className="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
                        type="number"
                        step="0.001"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-outline text-[10px] uppercase font-bold">Đơn giá</span>
                      <input
                        value={p.unit_price || 0}
                        onChange={(e) => handleProductChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
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
          // @ts-expect-error type mismatch with Partial
          debit={formData.debit_amount || 0}
          credit={formData.credit_amount || 0}
          total={totalAmount}
          totalInWords={numberToWords(totalAmount)}
          sourceDocs={formData.source_documents || 0}
          onSourceDocsChange={(val: number) => handleChange('source_documents', val)}
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
  </>
  )
}

export default GRNForm
