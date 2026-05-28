'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { Unit } from '../../../types/api'
import FormField from '../../../components/FormField'

const formSchema = z.object({
  code: z.string().min(5, "Mã bộ phận ít nhất 5 ký tự").max(32, "Mã bộ phận tối đa 32 ký tự"),
  name: z.string().min(20, "Tên bộ phận ít nhất 20 ký tự").max(100, "Tên bộ phận tối đa 100 ký tự"),
  unit_id: z.number().min(1, "Vui lòng chọn đơn vị trực thuộc"),
})

export default function DivisionForm() {
  const [units, setUnits] = useState<Unit[]>([])
  const [isDataLoading, setIsDataLoading] = useState(false)

  useEffect(() => {
    const fetchUnits = async () => {
      setIsDataLoading(true)
      try {
        const res = await fetch('http://localhost:3001/api/units')
        const data = await res.json()
        setUnits(data.data || [])
      } catch (error) {
        console.error('Error fetching units:', error)
        toast.error('Lỗi khi tải danh sách đơn vị')
      } finally {
        setIsDataLoading(false)
      }
    }
    fetchUnits()
  }, [])

  const form = useForm({
    defaultValues: { code: '', name: '', unit_id: 0 },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = { ...value, unit_id: Number(value.unit_id) }
        const res = await fetch('http://localhost:3001/api/divisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => null)
          throw new Error(errorData?.message || 'Failed to create division')
        }

        toast.success('Thêm bộ phận thành công!')
        form.reset()
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra khi thêm bộ phận')
      }
    },
  })

  const InputField = ({ field, label, placeholder, type = 'text' }: any) => (
    <FormField label={label}>
      <input
        type={type}
        className="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
      />
      {field.state.meta.errors?.length > 0 && (
        <span className="text-error text-sm mt-1">
          {field.state.meta.errors.map((err: any) => err.message).join(', ')}
        </span>
      )}
    </FormField>
  )

  const SelectField = ({ field, label }: any) => (
    <FormField label={label}>
      <select
        className="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
      >
        <option value={0} disabled>
          {isDataLoading ? 'Đang tải...' : '-- Chọn đơn vị --'}
        </option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.code} - {unit.name}
          </option>
        ))}
      </select>
      {field.state.meta.errors?.length > 0 && (
        <span className="text-error text-sm mt-1">
          {field.state.meta.errors.map((err: any) => err.message).join(', ')}
        </span>
      )}
    </FormField>
  )

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-surface rounded-xl border border-outline-variant shadow-sm">
      <h2 className="text-2xl font-display font-semibold mb-6 text-on-surface">
        Thêm Bộ phận / Phòng ban
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-5"
      >
        <form.Field name="code">
          {(field) => (
            <InputField field={field} label="Mã bộ phận *" placeholder="VD: DIV-01" />
          )}
        </form.Field>

        <form.Field name="name">
          {(field) => (
            <InputField field={field} label="Tên bộ phận *" placeholder="VD: Phòng Vật tư" />
          )}
        </form.Field>

        <form.Field name="unit_id">
          {(field) => <SelectField field={field} label="Đơn vị trực thuộc *" />}
        </form.Field>

        <div className="pt-4">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu bộ phận'}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
