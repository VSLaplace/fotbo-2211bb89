import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.js'

/**
 * Фірмовий мотив №2 — «Index List»: рядок індексу атласу.
 * Моно-номер у колонці зліва, серіфний заголовок у центрі, метадані справа.
 * Hover: ліва межа стає кармінною, фон — plate-dim, рядок зсувається на 4px.
 */
export default function IndexRow({
  index,
  title,
  subtitle,
  note,
  meta,
  metaTone = 'teal',
  accent = false,
  to,
  href,
  className,
  children,
}) {
  const classes = cn(
    'index-row group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1.5 border-l-2 border-transparent px-3 py-4 hover:border-carmine hover:bg-plate-dim hover:translate-x-1 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:px-4',
    className,
  )

  const content = (
    <>
      {index != null && (
        <span className="tnum legend text-ink-soft transition-colors group-hover:text-carmine">{index}</span>
      )}
      <span className="min-w-0">
        <span
          className={cn(
            'block font-serif text-xl leading-snug md:text-2xl',
            accent ? 'text-carmine' : 'text-ink',
          )}
        >
          {title}
        </span>
        {subtitle && <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-soft">{subtitle}</span>}
        {note && <span className="mt-1 block font-mono text-xs leading-relaxed text-ink-soft">{note}</span>}
        {children}
      </span>
      {meta && (
        <span
          className={cn(
            'tnum col-span-2 font-mono text-sm tracking-[0.06em] transition-colors group-hover:text-ink sm:col-span-1 sm:text-right',
            metaTone === 'carmine' ? 'text-carmine' : 'text-teal',
          )}
        >
          {meta}
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return <div className={classes}>{content}</div>
}
