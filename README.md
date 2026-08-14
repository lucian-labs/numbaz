# Numbaz

**[Live demo →](https://numbaz.lucianlabs.ca)** · [npm](https://www.npmjs.com/package/@dank-inc/numbaz) · [all packages](https://lucianlabs.ca/packages/)

reality is just numbers, bro.

except, also not.

## install

```sh
npm i @dank-inc/numbaz
```

## use

Two namespaces and one loose function. `Maff` is signal maths over a 0..1
parameter, `Rando` wraps `Math.random`, `seed` is the one generator that
doesn't.

```ts
import { Maff, Rando, seed } from '@dank-inc/numbaz'

const y = Maff.sin(i / count, 2, 0.4, 0.5) // 0..1 in, plotted value out
const colour = Rando.pick(palette)
const rand = seed('cactus') // same term, same sequence, every run
```

## Rando

| export                              | does                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| `r()`                               | `Math.random()`, wrapped                                     |
| `num(scale = 1, offset = 0)`        | uniform in `[offset, offset + scale)`                        |
| `range(min = 0, max = 1)`           | uniform float in `[min, max)`                                |
| `int(min = 0, max = 42)`            | integer in `[min, max)` — **max is exclusive**               |
| `bipolar(scale = 1, offset = 0)`    | uniform in `[offset - scale, offset + scale)`                |
| `normal(scale = 1, offset = 0)`     | deprecated alias of `bipolar` — flat, never was Gaussian     |
| `gaussian(mean = 0, sd = 1)`        | Box-Muller normal distribution                               |
| `bool()`                            | coin flip                                                    |
| `pick(arr)`                         | uniform element; throws on an empty array                    |
| `item(arr)`                         | alias of `pick`                                              |

## Maff

| export                                            | does                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `sin(u, freq = 1, scale = 1, offset = 0)`         | sine over a 0..1 cycle position, not radians                |
| `cos(u, freq = 1, scale = 1, offset = 0)`         | same, quarter cycle ahead                                   |
| `map(u, min, max)`                                | remaps a 0..1 parameter onto `[min, max]`                   |
| `lerp(u, max, margin = 0, min = 0)`               | `map` with both ends inset by `margin`; note the arg order  |
| `quantize(input, step)`                           | snaps to the nearest multiple of `step`; `NaN` if step is 0 |
| `r(scale = 1, offset = 0)`                        | deprecated — duplicate of `Rando.num`                       |
| `n(scale = 1, offset = 0)`                        | deprecated — alias of `Maff.r`                              |

Types `SinCosFn`, `Scaler` and `Lerpr` are exported alongside them.

## seed

`seed(term)` hashes the term (xmur3) into a mulberry32 state and returns a
`() => number` in `[0, 1)`. The rest of `Rando` is unseeded `Math.random` and
cannot be reproduced across reloads; this is the only reproducible path.

```ts
const rand = seed(42)
rand() // 0.1682699858210981, and again on the next run
```

## breaking changes

- `pick`/`item` used to be unable to return the **last** element of an array,
  and returned `undefined` typed as `T` for an empty one. Both are fixed; empty
  arrays now throw.
- `lerp` used to subtract `min` as a flat offset instead of using it as the
  floor. Calls that left `min` at its default are unaffected.
