export type SinCosFn = (
  u: number,
  freq?: number,
  scale?: number,
  offset?: number,
) => number

export const sin: SinCosFn = (u: number, freq = 1, scale = 1, offset = 0) =>
  Math.sin(u * Math.PI * 2 * freq) * scale + offset

export const cos: SinCosFn = (u: number, freq = 1, scale = 1, offset = 0) =>
  Math.cos(u * Math.PI * 2 * freq) * scale + offset

export type Scaler = (scale?: number, offset?: number) => number

export type Lerpr = (
  u: number,
  max: number,
  margin?: number,
  min?: number,
) => number

export const lerp: Lerpr = (u, max, margin = 0, min = 0) =>
  min + margin + u * (max - margin - (min + margin))

export const map = (u: number, min: number, max: number) =>
  u * (max - min) + min

/** @deprecated Randomness lives in `Rando` — this is `Rando.num`. */
export const r: Scaler = (scale = 1, offset = 0) =>
  Math.random() * scale + offset

/** @deprecated Alias of `Maff.r`, itself a duplicate of `Rando.num`. */
export const n: Scaler = r

export const quantize = (input: number, step: number) => {
  return Math.round(input / step) * step
}
