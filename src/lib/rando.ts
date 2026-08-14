export const r = () => Math.random()

export const num = (scale = 1, offset = 0) => r() * scale + offset

export const range = (min = 0, max = 1) => r() * (max - min) + min

export const int = (min = 0, max = 42) => Math.floor(range(min, max))

/** Unipolar -> bipolar: one uniform draw over [offset - scale, offset + scale). */
export const bipolar = (scale = 1, offset = 0) =>
  (num() - 0.5) * 2 * scale + offset

/**
 * @deprecated Flat, not Gaussian, despite the name. Use `bipolar` for this
 * exact behaviour, or `gaussian` for an actual normal distribution.
 */
export const normal = bipolar

/** Box-Muller. Unlike `normal`, this really is a normal distribution. */
export const gaussian = (mean = 0, sd = 1) => {
  // Math.random() can return exactly 0, and Math.log(0) is -Infinity.
  let u = 0
  while (u === 0) u = r()

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * r()) * sd + mean
}

export const bool = () => Math.random() < 0.5

export const pick = <T>(arr: Array<T>): T => {
  // int()'s max is exclusive, so the bound is the length, not the last index.
  if (!arr.length) throw new Error('numbaz: pick() needs a non-empty array')

  return arr[int(0, arr.length)]
}

/** Alias of `pick`, kept so the two implementations cannot drift apart. */
export const item = pick
