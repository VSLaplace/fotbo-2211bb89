import { cn } from '../../lib/cn.js'

// Волосяна лінійка замість тіні. Опційний ромбічний маркер посередині —
// типографський ромб, яким у старих атласах відбивали розрив у тексті.

const TONES = {
  rule: { line: 'bg-rule', diamond: 'bg-rule' },
  ink: { line: 'bg-ink', diamond: 'bg-carmine' },
  carmine: { line: 'bg-carmine', diamond: 'bg-carmine' },
  inverse: { line: 'bg-paper/25', diamond: 'bg-paper/40' },
}

export default function HairlineRule({ withDiamond = false, tone = 'rule', className }) {
  const palette = TONES[tone] ?? TONES.rule

  return (
    <div role="presentation" className={cn('flex w-full items-center', className)}>
      <span className={cn('h-px flex-1', palette.line)} />
      {withDiamond && <span className={cn('mx-3 h-1.5 w-1.5 shrink-0 rotate-45', palette.diamond)} />}
      {withDiamond && <span className={cn('h-px flex-1', palette.line)} />}
    </div>
  )
}
