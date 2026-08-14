import { describe, expect, it } from 'vitest'
import * as Maff from '../lib/maff'

describe('lerp', () => {
  it('treats min as the floor and max as the ceiling', () => {
    expect(Maff.lerp(0, 10, 0, 5)).toBe(5)
    expect(Maff.lerp(1, 10, 0, 5)).toBe(10)
    expect(Maff.lerp(0.5, 10, 0, 5)).toBe(7.5)
  })

  it('insets both ends by the margin', () => {
    expect(Maff.lerp(0, 10, 2)).toBe(2)
    expect(Maff.lerp(1, 10, 2)).toBe(8)
  })

  it('stays inside [min, max] across the whole 0..1 sweep', () => {
    for (let i = 0; i <= 100; i++) {
      const v = Maff.lerp(i / 100, 10, 0, 5)
      expect(v).toBeGreaterThanOrEqual(5)
      expect(v).toBeLessThanOrEqual(10)
    }
  })

  it('agrees with map when there is no margin', () => {
    for (let i = 0; i <= 100; i++) {
      const u = i / 100
      expect(Maff.lerp(u, 10, 0, 5)).toBeCloseTo(Maff.map(u, 5, 10), 10)
    }
  })
})

describe('map', () => {
  it('remaps 0..1 onto min..max', () => {
    expect(Maff.map(0, 5, 10)).toBe(5)
    expect(Maff.map(1, 5, 10)).toBe(10)
  })
})

describe('sin / cos', () => {
  it('takes u as a 0..1 cycle position', () => {
    expect(Maff.sin(0.25)).toBeCloseTo(1, 10)
    expect(Maff.cos(0)).toBeCloseTo(1, 10)
  })
})

describe('quantize', () => {
  it('snaps to the nearest step', () => {
    expect(Maff.quantize(7.3, 0.5)).toBeCloseTo(7.5, 10)
    expect(Maff.quantize(7.1, 0.5)).toBeCloseTo(7, 10)
  })
})
