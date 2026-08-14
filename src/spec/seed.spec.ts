import { describe, expect, it } from 'vitest'
import { seed } from '../lib/seed'

const take = (fn: () => number, n = 10) => Array.from({ length: n }, fn)

describe('seed', () => {
  it('replays the same sequence for the same term', () => {
    expect(take(seed('cactus'))).toEqual(take(seed('cactus')))
  })

  it('diverges for different terms', () => {
    expect(take(seed('cactus'))).not.toEqual(take(seed('cactus ')))
  })

  it('accepts numbers as well as strings', () => {
    expect(take(seed(42))).toEqual(take(seed(42)))
    expect(take(seed(42))).not.toEqual(take(seed(43)))
  })

  it('stays in [0, 1)', () => {
    const rand = seed('bounds')

    for (let i = 0; i < 5000; i++) {
      const v = rand()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})
