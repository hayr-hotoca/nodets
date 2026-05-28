'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Division } from '../../types/api'

export default function DivisionList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/divisions')
      if (!res.ok) {
        throw new Error('Failed to fetch divisions')
      }
      const json = await res.json()
      return (json.data || []) as Division[]
    }
  })

  if (isLoading) {
    return (
      <div className="bg-surface p-8 rounded-xl border border-outline-variant flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-on-surface-variant font-medium">Đang tải danh sách bộ phận...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-error-container p-6 rounded-xl border border-error text-center text-on-error-container">
        Có lỗi xảy ra: {(error as Error).message}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-8 rounded-xl border border-outline-variant text-center text-on-surface-variant">
        Danh sách bộ phận đang trống.
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest text-on-surface border-b border-outline-variant">
              <th className="p-4 font-semibold whitespace-nowrap">ID</th>
              <th className="p-4 font-semibold whitespace-nowrap">Mã Bộ phận</th>
              <th className="p-4 font-semibold whitespace-nowrap">Tên Bộ phận</th>
              <th className="p-4 font-semibold whitespace-nowrap">ID Đơn vị</th>
            </tr>
          </thead>
          <tbody className="text-on-surface-variant">
            {data.map((division) => (
              <tr 
                key={division.id} 
                className="border-b border-outline-variant hover:bg-surface-container-low transition-colors"
              >
                <td className="p-4 whitespace-nowrap">{division.id}</td>
                <td className="p-4 whitespace-nowrap font-medium text-primary">{division.code}</td>
                <td className="p-4 whitespace-nowrap font-medium text-on-surface">{division.name}</td>
                <td className="p-4 whitespace-nowrap">{division.unit_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
