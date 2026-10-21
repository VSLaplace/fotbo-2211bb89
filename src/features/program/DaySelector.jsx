import { useRef } from 'react'
import { cn } from '../../lib/cn.js'
import { formatUaDateNumeric, formatUaWeekday, withCountUa } from '../../lib/format.js'
import { roman } from './roman.js'

/**
 * Перемикач днів конгресу — три «таблиці» в одному рядку.
 * Справжня семантика табів: role="tablist" / role="tab" з aria-selected,
 * робочий табіндекс і керування зі клавіатури (←/→, Home/End).
 */
export default function DaySelector({ days, activeId, onChange, counts = {}, panelId }) {
  const refs = useRef([])
  const activeIndex = days.findIndex((day) => day.id === activeId)

  const moveTo = (index) => {
    if (!days.length) return
    const next = (index + days.length) % days.length
    onChange(days[next].id)
    refs.current[next]?.focus()
  }

  const handleKeyDown = (event) => {
    const current = activeIndex < 0 ? 0 : activeIndex
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        moveTo(current + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        moveTo(current - 1)
        break
      case 'Home':
        event.preventDefault()
        moveTo(0)
        break
      case 'End':
        event.preventDefault()
        moveTo(days.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Дні конгресу"
      onKeyDown={handleKeyDown}
      className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4"
    >
      {days.map((day, index) => {
        const active = day.id === activeId
        const numeral = roman(day.order ?? index + 1)
        const count = counts[day.id] ?? 0

        return (
          <button
            key={day.id}
            ref={(element) => {
              refs.current[index] = element
            }}
            id={`program-day-tab-${day.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active || (activeIndex < 0 && index === 0) ? 0 : -1}
            onClick={() => onChange(day.id)}
            className={cn(
              'group relative flex flex-col items-start gap-4 border-t-2 px-5 py-5 text-left transition-colors duration-200 sm:px-6 sm:py-6',
              active
                ? 'border-carmine bg-ink text-paper'
                : 'border-transparent bg-plate text-ink hover:bg-plate-dim',
            )}
          >
            <span className={cn('legend', active ? 'text-paper/60' : 'text-ink-soft')}>
              {day.dayLabel || `День ${numeral}`}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                'font-serif text-4xl leading-none transition-colors duration-200 md:text-5xl',
                active ? 'text-carmine' : 'text-ink-soft group-hover:text-carmine',
              )}
            >
              {numeral}
            </span>

            <span className="flex flex-col gap-2">
              <span
                className={cn(
                  'tnum font-mono text-sm tracking-[0.06em]',
                  active ? 'text-paper' : 'text-ink',
                )}
              >
                {day.date ? formatUaDateNumeric(day.date) : day.dateLabel}
              </span>
              <span
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.18em]',
                  active ? 'text-paper/60' : 'text-ink-soft',
                )}
              >
                {day.date ? formatUaWeekday(day.date) : ''}
              </span>
              <span
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.18em]',
                  active ? 'text-paper/60' : 'text-ink-soft',
                )}
              >
                {withCountUa(count, ['позиція', 'позиції', 'позицій'])}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
