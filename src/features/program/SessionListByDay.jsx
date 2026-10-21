import { useMemo, useState } from 'react'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { cn } from '../../lib/cn.js'
import { byOrder } from '../../services/api.js'
import { formatUaDateNumeric, withCountUa } from '../../lib/format.js'
import { roman } from './roman.js'

// Тип засідання → тон акценту. Кармін — лише для головних подій (пленарні,
// урочисті), решта тримає венозну бірюзу, перерви — нейтральне чорнило.
export const TYPE_TONES = {
  plenary: 'carmine',
  ceremony: 'carmine',
  section: 'teal',
  poster: 'teal',
  workshop: 'teal',
  roundtable: 'teal',
  discussion: 'teal',
  registration: 'muted',
  break: 'muted',
}

const BADGE = {
  carmine: 'border-carmine/45 text-carmine',
  teal: 'border-teal/45 text-teal',
  muted: 'border-rule text-ink-soft',
}

const DOT = {
  carmine: 'bg-carmine',
  teal: 'bg-teal',
  muted: 'bg-rule',
}

// Службові позиції програми — не засідання, а паузи: показуються дрібним рядком.
const PAUSE_TYPES = new Set(['break', 'registration'])

function TypeBadge({ tone = 'teal', children }) {
  return (
    <span className={cn('legend inline-flex border px-2 py-1', BADGE[tone] ?? BADGE.teal)}>{children}</span>
  )
}

function SessionRow({ item, tone, label }) {
  const reports = Array.isArray(item.reports) ? item.reports : []
  const [open, setOpen] = useState(false)

  return (
    <li className="group grid gap-x-5 gap-y-3 border-l-2 border-transparent px-3 py-5 transition-colors duration-200 hover:border-carmine hover:bg-plate-dim sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:px-4 lg:grid-cols-[6.5rem_minmax(0,1fr)_11rem]">
      <span className="tnum font-mono text-sm tracking-[0.06em] text-ink transition-colors duration-200 group-hover:text-carmine">
        {item.time}
      </span>

      <div className="min-w-0">
        <TypeBadge tone={tone}>{label}</TypeBadge>
        <h3 className="mt-3 font-serif text-xl leading-snug text-ink md:text-2xl">{item.title}</h3>
        {item.speaker && <p className="mt-2.5 text-[15px] font-medium text-ink">{item.speaker}</p>}
        {item.affiliation && (
          <p className="mt-1.5 font-mono text-xs leading-relaxed text-ink-soft">{item.affiliation}</p>
        )}

        {reports.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2.5 rounded-[2px] border border-rule bg-plate px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carmine"
            >
              <span aria-hidden="true">{open ? '[−]' : '[+]'}</span>
              {open
                ? 'Згорнути доповіді'
                : `Доповіді засідання (${reports.length})`}
            </button>

            {open && (
              <div className="mt-4 border-y border-rule">
                <ol className="divide-y divide-rule">
                  {reports.map((report, index) => (
                    <li
                      key={report.id}
                      className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 py-3 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
                    >
                      <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">
                        <span className="block text-[16px] leading-snug text-ink">{report.title}</span>
                        {report.authors && (
                          <span className="mt-1 block font-mono text-xs leading-relaxed text-ink-soft">
                            {report.authors}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  Перелік доповідей наведено за програмою конгресу
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="min-w-0 lg:text-right">
        <span className="legend text-ink-soft lg:hidden">Зала</span>
        <p className="mt-2 font-mono text-xs leading-relaxed text-ink-soft lg:mt-0">{item.hall}</p>
      </div>
    </li>
  )
}

function PauseRow({ item, label }) {
  return (
    <li className="grid gap-x-5 gap-y-1 border-l-2 border-dashed border-rule px-3 py-3.5 transition-colors duration-200 hover:bg-plate-dim sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:px-4 lg:grid-cols-[6.5rem_minmax(0,1fr)_11rem]">
      <span className="tnum font-mono text-sm tracking-[0.06em] text-ink-soft">{item.time}</span>
      <span className="min-w-0 text-[15px] leading-relaxed text-ink-soft">
        {item.title}
        <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
          {label}
        </span>
      </span>
      <span className="font-mono text-xs text-ink-soft lg:text-right">{item.hall}</span>
    </li>
  )
}

/**
 * Програма одного дня: «якір» великої цифри дня в лівому рейлі, легенда типів
 * засідань (як ключ до таблиці) і список позицій рядками індексу.
 */
export default function SessionListByDay({ day, sessions, types, panelId, numeral }) {
  const [hidePauses, setHidePauses] = useState(false)

  const ordered = useMemo(() => byOrder(sessions), [sessions])
  const pauses = ordered.filter((item) => PAUSE_TYPES.has(item.type))
  const shown = hidePauses ? ordered.filter((item) => !PAUSE_TYPES.has(item.type)) : ordered

  const labelByType = useMemo(() => {
    const map = new Map(types.map((type) => [type.id, type.label]))
    ordered.forEach((item) => {
      if (!map.has(item.type) && item.typeLabel) map.set(item.type, item.typeLabel)
    })
    return map
  }, [types, ordered])

  // Ключ до таблиці: лише ті типи, що справді є в цьому дні.
  const legend = useMemo(() => {
    const present = new Set(ordered.map((item) => item.type))
    const fromCollection = byOrder(types)
      .filter((type) => present.has(type.id))
      .map((type) => ({ id: type.id, label: type.label }))
    const known = new Set(fromCollection.map((type) => type.id))
    ordered.forEach((item) => {
      if (!known.has(item.type)) {
        known.add(item.type)
        fromCollection.push({ id: item.type, label: labelByType.get(item.type) ?? item.typeLabel ?? '' })
      }
    })
    return fromCollection
  }, [ordered, types, labelByType])

  const halls = useMemo(
    () => [...new Set(ordered.map((item) => item.hall).filter(Boolean))],
    [ordered],
  )

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={`program-day-tab-${day.id}`}
      tabIndex={-1}
      className="focus-visible:outline-none"
    >
      <PlateFrame
        figure={`FIG. 08.${numeral}`}
        label={`Програма — ${day.dayLabel}`}
      >
        {/* Заголовок дня: велика серіфна цифра як якір колонки */}
        <div className="grid gap-5 border-b border-rule pb-6 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:gap-8">
          <span aria-hidden="true" className="font-serif text-5xl leading-none text-carmine md:text-6xl">
            {numeral}
          </span>
          <div className="min-w-0">
            <PlateLabel tone="teal" figure={day.date ? formatUaDateNumeric(day.date) : undefined}>
              {day.dayLabel}
            </PlateLabel>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-ink md:text-3xl">
              {day.dateLabel || day.date}
            </h2>
            {day.summary && (
              <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-ink-soft">{day.summary}</p>
            )}
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              {day.venueHall && (
                <div>
                  <dt className="legend text-ink-soft">Головна зала</dt>
                  <dd className="mt-1.5 font-mono text-xs text-ink">{day.venueHall}</dd>
                </div>
              )}
              {halls.length > 0 && (
                <div className="min-w-0">
                  <dt className="legend text-ink-soft">Зали дня</dt>
                  <dd className="mt-1.5 font-mono text-xs leading-relaxed text-ink">{halls.join(' · ')}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Легенда типів + перемикач службових позицій */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-rule py-4">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legend.map((type) => (
              <li key={type.id} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn('h-2.5 w-2.5 shrink-0 rotate-45', DOT[TYPE_TONES[type.id] ?? 'teal'])}
                />
                <PlateLabel>{type.label}</PlateLabel>
              </li>
            ))}
          </ul>

          {pauses.length > 0 && (
            <button
              type="button"
              aria-pressed={hidePauses}
              onClick={() => setHidePauses((value) => !value)}
              className="inline-flex items-center gap-2.5 rounded-[2px] border border-rule bg-plate px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              <span aria-hidden="true" className="font-mono">
                {hidePauses ? '[×]' : '[ ]'}
              </span>
              {hidePauses
                ? 'Показати перерви'
                : `Сховати перерви (${pauses.length})`}
            </button>
          )}
        </div>

        {ordered.length === 0 ? (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            Програма дня уточнюється — слідкуйте за оновленнями від секретаріату
          </p>
        ) : (
          <>
            <div className="hidden border-b border-rule px-4 pb-2.5 lg:grid lg:grid-cols-[6.5rem_minmax(0,1fr)_11rem] lg:gap-x-5">
              <span className="legend text-ink-soft">Час</span>
              <span className="legend text-ink-soft">Засідання, доповідач, афіліація</span>
              <span className="legend text-ink-soft lg:text-right">Зала</span>
            </div>
            <ol className="divide-y divide-rule border-b border-rule">
              {shown.map((item) => {
                const label = labelByType.get(item.type) ?? item.typeLabel ?? ''
                const tone = TYPE_TONES[item.type] ?? 'teal'
                return PAUSE_TYPES.has(item.type) ? (
                  <PauseRow key={item.id} item={item} label={label} />
                ) : (
                  <SessionRow key={item.id} item={item} tone={tone} label={label} />
                )
              })}
            </ol>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pt-4">
          <PlateLabel>
            {withCountUa(ordered.length, ['позиція', 'позиції', 'позицій'])} у програмі дня
          </PlateLabel>
          <PlateLabel tone="teal">Час за київським часом</PlateLabel>
        </div>
      </PlateFrame>
    </div>
  )
}
