/* numbaz demo — https://numbaz.lucianlabs.ca
 *
 * Imports the library by its published name; vite.demo.config.ts aliases that
 * to ./src, so this file reads exactly like consumer code.
 */

import { Maff, Rando } from '@dank-inc/numbaz'

declare const waveloop: { ready: (...tags: string[]) => Promise<unknown> }

const app = document.getElementById('app') as HTMLElement

const h = (tag: string, cls?: string, text?: string) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}

const section = (title: string) => {
  const s = document.createElement('wl-section')
  s.setAttribute('title', title)
  app.append(s)
  return s
}

waveloop.ready().then(boot)

function boot() {
  installSection()
  waveSection()
  quantizeSection()
  randoSection()
  apiSection()
}

/* ── install ────────────────────────────────────────────────────────────── */

function installSection() {
  const s = section('install')
  const install = document.createElement('wl-install')
  install.setAttribute('pkg', '@dank-inc/numbaz')
  const code = document.createElement('wl-code')
  code.textContent = `import { Maff, Rando } from '@dank-inc/numbaz'

// Maff — deterministic signal maths over a 0..1 parameter
Maff.sin(u, freq, scale, offset)
Maff.lerp(u, max, margin, min)
Maff.quantize(value, step)

// Rando — the random helpers
Rando.range(min, max)
Rando.int(min, max)
Rando.pick(array)`
  s.append(install, code)
}

/* ── Maff.sin / Maff.cos on the house scope ─────────────────────────────── */

function waveSection() {
  const s = section('Maff.sin / Maff.cos')

  s.append(
    h(
      'p',
      'wl-muted',
      'Both take a 0..1 parameter and return a value you can feed straight into a ' +
        'draw call. The scope plots 256 samples of u across one pass; drag the faders ' +
        'or double-tap one to reset it.'
    )
  )

  const hud = document.createElement('wl-hud')
  hud.style.height = '260px'
  const scope = document.createElement('wl-scope')
  hud.append(scope)
  s.append(hud)

  const controls = h('div', 'wl-grid')
  controls.style.marginTop = '0.75rem'

  const mk = (label: string, min: number, max: number, step: number, value: number) => {
    const f = document.createElement('wl-fader')
    f.setAttribute('label', label)
    f.setAttribute('min', String(min))
    f.setAttribute('max', String(max))
    f.setAttribute('step', String(step))
    f.setAttribute('value', String(value))
    controls.append(f)
    return f as HTMLElement & { value: number }
  }

  const fn = document.createElement('wl-segmented')
  fn.setAttribute('options', 'sin,cos')
  fn.setAttribute('value', 'sin')

  const freq = mk('freq', 0.25, 8, 0.25, 2)
  const scale = mk('scale', 0, 1, 0.01, 0.4)
  const offset = mk('offset', 0, 1, 0.01, 0.5)

  const wrap = h('div')
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.gap = '0.75rem'
  wrap.style.marginTop = '0.75rem'
  wrap.append(fn, controls)
  s.append(wrap)

  const SAMPLES = 256

  const paint = () => {
    const f = fn.getAttribute('value') === 'cos' ? Maff.cos : Maff.sin
    const data: number[] = []
    for (let i = 0; i < SAMPLES; i++) {
      const u = i / (SAMPLES - 1)
      data.push(f(u, freq.value, scale.value, offset.value))
    }
    ;(scope as HTMLElement & { data: number[] }).data = data
    hud.setAttribute('tl', fn.getAttribute('value') === 'cos' ? 'MAFF.COS' : 'MAFF.SIN')
    hud.setAttribute('tr', `FREQ ${freq.value.toFixed(2)}`)
    hud.setAttribute('bl', `SCALE ${scale.value.toFixed(2)} · OFFSET ${offset.value.toFixed(2)}`)
    hud.setAttribute('br', `${SAMPLES} SAMPLES · U 0→1`)
  }

  for (const el of [fn, freq, scale, offset]) el.addEventListener('wl-input', paint)
  paint()
}

/* ── Maff.quantize ──────────────────────────────────────────────────────── */

function quantizeSection() {
  const s = section('Maff.quantize')
  s.append(
    h(
      'p',
      'wl-muted',
      'Snaps a continuous value onto a step grid — the same move that turns a ' +
        'free-running fader into a musical one.'
    )
  )

  const row = h('div', 'wl-grid')

  const input = document.createElement('wl-fader')
  input.setAttribute('label', 'input')
  input.setAttribute('min', '0')
  input.setAttribute('max', '1')
  input.setAttribute('step', '0.001')
  input.setAttribute('value', '0.5')

  const stepF = document.createElement('wl-fader')
  stepF.setAttribute('label', 'step')
  stepF.setAttribute('min', '0.01')
  stepF.setAttribute('max', '0.5')
  stepF.setAttribute('step', '0.01')
  stepF.setAttribute('value', '0.1')

  const out = document.createElement('wl-readout')
  out.setAttribute('label', 'quantized')

  row.append(input, stepF, out)
  s.append(row)

  const update = () => {
    const v = (input as HTMLElement & { value: number }).value
    const st = (stepF as HTMLElement & { value: number }).value
    out.setAttribute('value', String(Maff.quantize(v, st)))
  }
  input.addEventListener('wl-input', update)
  stepF.addEventListener('wl-input', update)
  requestAnimationFrame(update)
}

/* ── Rando distributions ────────────────────────────────────────────────── */

function randoSection() {
  const s = section('Rando')
  s.append(
    h(
      'p',
      'wl-muted',
      'Draw a batch and bin it. Rando.normal sums two calls to r() for a rough ' +
        'triangular distribution; the rest are flat.'
    )
  )

  const hud = document.createElement('wl-hud')
  hud.style.height = '200px'
  const canvas = document.createElement('canvas')
  hud.append(canvas)
  s.append(hud)

  const controls = h('div', 'wl-row')
  controls.style.marginTop = '0.75rem'

  const which = document.createElement('wl-segmented')
  which.setAttribute('options', 'range,int,normal,num')
  which.setAttribute('value', 'range')

  const draw = document.createElement('button')
  draw.className = 'wl-btn'
  draw.textContent = 'draw 5000'

  const stat = document.createElement('wl-readout')
  stat.setAttribute('label', 'mean')

  controls.append(which, draw, stat)
  s.append(controls)

  const BINS = 48
  const ctx = canvas.getContext('2d')!

  const run = () => {
    const kind = which.getAttribute('value')
    const N = 5000
    const bins = new Array(BINS).fill(0)
    let total = 0

    for (let i = 0; i < N; i++) {
      let v: number
      if (kind === 'int') v = Rando.int(0, BINS) / BINS
      else if (kind === 'normal') v = Rando.normal(1, 0)
      else if (kind === 'num') v = Rando.num(1, 0)
      else v = Rando.range(0, 1)
      total += v
      const b = Math.min(BINS - 1, Math.max(0, Math.floor(v * BINS)))
      bins[b]++
    }

    stat.setAttribute('value', (total / N).toFixed(4))
    hud.setAttribute('tl', `RANDO.${String(kind).toUpperCase()}`)
    hud.setAttribute('tr', `N ${N}`)
    hud.setAttribute('bl', `${BINS} BINS`)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = hud.getBoundingClientRect()
    canvas.width = Math.round(r.width * dpr)
    canvas.height = Math.round(r.height * dpr)
    canvas.style.width = `${r.width}px`
    canvas.style.height = `${r.height}px`

    const peak = Math.max(...bins) || 1
    const bw = canvas.width / BINS
    const accent = getComputedStyle(hud).getPropertyValue('--wl-accent').trim()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = accent
    for (let i = 0; i < BINS; i++) {
      const bh = (bins[i] / peak) * (canvas.height - 8)
      ctx.fillRect(i * bw + 1, canvas.height - bh, bw - 2, bh)
    }
  }

  draw.addEventListener('click', run)
  which.addEventListener('wl-input', run)
  requestAnimationFrame(run)
}

/* ── API table ──────────────────────────────────────────────────────────── */

function apiSection() {
  const s = section('api')
  const api = document.createElement('wl-api')
  s.append(api)
  ;(api as HTMLElement & { rows: unknown }).rows = [
    { name: 'Maff.sin', kind: 'function', signature: '(u, freq=1, scale=1, offset=0) => number', about: 'Sine over a 0..1 parameter, pre-scaled and offset.' },
    { name: 'Maff.cos', kind: 'function', signature: '(u, freq=1, scale=1, offset=0) => number', about: 'Cosine counterpart to Maff.sin.' },
    { name: 'Maff.lerp', kind: 'function', signature: '(u, max, margin=0, min=0) => number', about: 'Linear interpolation with an optional inset margin.' },
    { name: 'Maff.map', kind: 'function', signature: '(u, min, max) => number', about: 'Maps a 0..1 parameter into a min..max range.' },
    { name: 'Maff.quantize', kind: 'function', signature: '(input, step) => number', about: 'Snaps a value onto a step grid.' },
    { name: 'Maff.r', kind: 'function', signature: '(scale=1, offset=0) => number', about: 'Scaled random, 0..scale.' },
    { name: 'Maff.n', kind: 'function', signature: '(scale=1, offset=0) => number', about: 'Bipolar random centred on zero.' },
    { name: 'Rando.r', kind: 'function', signature: '() => number', about: 'Math.random, wrapped so it can be swapped.' },
    { name: 'Rando.num', kind: 'function', signature: '(scale=1, offset=0) => number', about: 'Random scaled and offset.' },
    { name: 'Rando.range', kind: 'function', signature: '(min=0, max=1) => number', about: 'Uniform float in a range.' },
    { name: 'Rando.int', kind: 'function', signature: '(min=0, max=42) => number', about: 'Floored range — see the review note on the upper bound.' },
    { name: 'Rando.normal', kind: 'function', signature: '(scale=1, offset=0) => number', about: 'Two summed draws — roughly triangular.' },
    { name: 'Rando.bool', kind: 'function', signature: '() => boolean', about: 'Coin flip.' },
    { name: 'Rando.item', kind: 'function', signature: '<T>(arr: T[]) => T', about: 'Random element. Alias of pick.' },
    { name: 'Rando.pick', kind: 'function', signature: '<T>(arr: T[]) => T', about: 'Random element.' },
  ]
}
