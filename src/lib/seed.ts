/**
 * xmur3: mixes an arbitrary seed term down to a 32-bit state. Without this a
 * string seed has nowhere to go — mulberry32 needs an integer, not a name.
 */
const hashSeed = (seedTerm: string | number) => {
  const term = String(seedTerm)
  let h = 1779033703 ^ term.length

  for (let i = 0; i < term.length; i++) {
    h = Math.imul(h ^ term.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }

  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)

  return (h ^= h >>> 16) >>> 0
}

/**
 * Deterministic replacement for `Math.random`. The same seed term always yields
 * the same sequence, so a generated piece can be reproduced from its seed.
 *
 * const rand = seed('cactus')
 * rand() // 0..1, same value on every run
 */
export const seed = (seedTerm: string | number) => {
  let state = hashSeed(seedTerm)

  // mulberry32
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
