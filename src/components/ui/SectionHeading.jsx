import { cn } from '../../lib/cn.js'
import PlateLabel from './PlateLabel.jsx'

// Заголовок секції: моно-легенда з номером таблиці, серіфний заголовок і лід.
// Вирівнювання ЗАВЖДИ за лівим краєм — жодних центрованих заголовків.

const SIZES = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl',
  xl: 'text-5xl md:text-7xl',
}

export default function SectionHeading({
  id,
  eyebrow,
  figure,
  title,
  lead,
  as,
  size = 'md',
  inverted = false,
  labelTone,
  className,
  children,
}) {
  const Tag = as ?? 'h2'
  const labelPalette = labelTone ?? (inverted ? 'inverse' : 'carmine')

  return (
    <header className={cn('max-w-[68ch]', className)}>
      {(eyebrow || figure) && (
        <PlateLabel figure={figure} tone={labelPalette} className="mb-4">
          {eyebrow}
        </PlateLabel>
      )}
      {title && (
        <Tag
          id={id}
          className={cn(
            'font-serif leading-[1.05] text-balance',
            SIZES[size] ?? SIZES.md,
            inverted ? 'text-paper' : 'text-ink',
          )}
        >
          {title}
        </Tag>
      )}
      {lead && (
        <p className={cn('mt-5 text-lg leading-relaxed', inverted ? 'text-paper/75' : 'text-ink-soft')}>{lead}</p>
      )}
      {children}
    </header>
  )
}
