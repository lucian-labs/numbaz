import { describe, expect, it } from 'vitest'
import * as Rando from '../lib/rando'

const DRAWS = 2000

describe('pick', () => {
  it('can return every element, including the last', () => {
    const arr = ['a', 'b', 'c', 'd']
    const seen = new Set(Array.from({ length: DRAWS }, () => Rando.pick(arr)))

    expect(seen).toEqual(new Set(arr))
  })

  it('returns both sides of a two element array', () => {
    const arr = ['heads', 'tails']
    const seen = new Set(Array.from({ length: DRAWS }, () => Rando.pick(arr)))

    expect(seen.size).toBe(2)
  })

  it('throws on an empty array rather than returning undefined as T', () => {
    expect(() => Rando.pick([])).toThrow(/non-empty/)
  })

  it('is the same function as item', () => {
    expect(Rando.item).toBe(Rando.pick)
  })
})

describe('int', () => {
  it('stays within [min, max)', () => {
    for (let i = 0; i < DRAWS; i++) {
      const v = Rando.int(3, 7)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThan(7)
    }
  })
})

describe('range', () => {
  it('stays within [min, max)', () => {
    for (let i = 0; i < DRAWS; i++) {
      const v = Rando.range(-2, 5)
      expect(v).toBeGreaterThanOrEqual(-2)
      expect(v).toBeLessThan(5)
    }
  })
})

describe('bipolar', () => {
  it('spans [offset - scale, offset + scale)', () => {
    for (let i = 0; i < DRAWS; i++) {
      const v = Rando.bipolar(2, 1)
      expect(v).toBeGreaterThanOrEqual(-1)
      expect(v).toBeLessThan(3)
    }
  })

  it('is what normal has always done', () => {
    expect(Rando.normal).toBe(Rando.bipolar)
  })
})

describe('gaussian', () => {
  it('clusters, unlike the flat bipolar draw', () => {
    const inside = Array.from({ length: 20000 }, () => Rando.gaussian()).filter(
      (v) => Math.abs(v) < 0.5,
    ).length

    // A standard normal puts ~38.3% within half a standard deviation.
    expect(inside / 20000).toBeGreaterThan(0.33)
    expect(inside / 20000).toBeLessThan(0.43)
  })

  it('never returns Infinity when the underlying draw hits zero', () => {
    for (let i = 0; i < DRAWS; i++) {
      expect(Number.isFinite(Rando.gaussian())).toBe(true)
    }
  })
})
