import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLifecycleStore } from './lifecycle'

describe('useLifecycleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('bat dau o trang thai idle', () => {
    const store = useLifecycleStore()
    expect(store.phase).toBe('idle')
    expect(store.updateCount).toBe(0)
  })

  it('cap nhat phase va dem so lan updated', () => {
    const store = useLifecycleStore()

    store.setPhase('mounted')
    expect(store.phase).toBe('mounted')

    store.setPhase('updating')
    expect(store.phase).toBe('updating')

    store.setPhase('updated')
    expect(store.phase).toBe('updated')
    expect(store.updateCount).toBe(1)

    store.setPhase('updated')
    expect(store.updateCount).toBe(2)
  })

  it('reset ve trang thai ban dau', () => {
    const store = useLifecycleStore()
    store.setPhase('mounted')
    store.setPhase('updated')
    store.reset()

    expect(store.phase).toBe('idle')
    expect(store.updateCount).toBe(0)
    expect(store.lastTransitionAt).toBeNull()
  })
})
