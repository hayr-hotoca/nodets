import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'

describe('api service (vue3)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getDivisions tra ve mang data tu payload', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, code: 'DIV-001', name: 'Phong Vat Tu', unit_id: 1 }],
      }),
    } as Response)

    const divisions = await api.getDivisions()

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3001/api/divisions', undefined)
    expect(divisions).toHaveLength(1)
    expect(divisions[0].code).toBe('DIV-001')
  })

  it('createDivision goi POST dung endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    await api.createDivision({
      code: 'DIV-NEW',
      name: 'Phong Nghiep Vu Tong Hop',
      unit_id: 2,
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/api/divisions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })
})
