import { cn } from '../../lib/cn.js'

// Легенда таблиці атласу: «FIG. 03 — КЛЮЧОВІ ДАТИ».
// Моно, верхній регістр, розріджений трекінг — підпис гравіювальної таблиці.

const TONES = {
  muted: { text: 'text-ink-soft', dash: 'text-rule' },
  carmine: { text: 'text-carmine', dash: 'text-carmine/50' },
  teal: { text: 'text-teal', dash: 'text-teal/50' },
  inverse: { text: 'text-paper/70', dash: 'text-paper/30' },
}

export default function PlateLabel({ figure, children, tone = 'muted', as: Tag = 'span', className }) {
  const palette = TONES[tone] ?? TONES.muted
  const showDash = figure != null && Boolean(children)

  return (
    <Tag className={cn('legend inline-flex items-baseline gap-2', palette.text, className)}>
      {figure != null && <span className="tnum">{figure}</span>}
      {showDash ? (
        <span aria-hidden="true" className={cn('translate-y-[-2px]', palette.dash)}>
          —
        </span>
      ) : null}
      {children}
    </Tag>
  )
}
