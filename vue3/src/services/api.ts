import type { CreateGRNDto, Division, Product, Unit, Warehouse } from '../types/api'

const API_BASE_URL = 'http://localhost:3001/api'

type ApiResponse<T> = {
  data?: T
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return response.json()
}

async function getCollection<T>(path: string): Promise<T[]> {
  const payload = await request<ApiResponse<T[]>>(path)
  return payload.data ?? []
}

export const api = {
  getDivisions: () => getCollection<Division>('/divisions'),
  getUnits: () => getCollection<Unit>('/units'),
  getWarehouses: () => getCollection<Warehouse>('/warehouses'),
  getProducts: () => getCollection<Product>('/products'),

  async createDivision(payload: { code: string; name: string; unit_id: number }) {
    await request('/divisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  },

  async createGoodsReceivedNote(payload: Partial<CreateGRNDto>) {
    const response = await fetch(`${API_BASE_URL}/goods-received-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return
    }

    const payloadError = await response.json().catch(() => null)
    throw payloadError
  },
}
