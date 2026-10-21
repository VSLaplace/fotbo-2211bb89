import IndexRow from '../../components/ui/IndexRow.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { useCollection, useSingleton } from '../../hooks/useCollection.js'
import { byOrder } from '../../services/api.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'
import { daysUntil, formatUaDate, withCountUa } from '../../lib/format.js'

// Ключові дати конгресу — нумерований індекс атласу: рядок, розділений
// волосяними лінійками, акцентні дати виділені карміном.
// Ліворуч — велика серифна цифра як якір колонки (зворотний відлік).
export default function KeyDatesIndex() {
  const { data: congress } = useSingleton('congress')
  const { data: keyDates, error } = useCollection('keyDates')
  const meta = congress ?? CONGRESS_SHELL

  const dates = byOrder(Array.isArray(keyDates) ? keyDates : [])
  const daysToStart = daysUntil(meta.dates?.start)

  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 md:px-6 md:pb-16">
      <PlateFrame as="section" id="dates" figure="FIG. 03" label="Ключові дати">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-14">
          <Reveal className="min-w-0">
            <p className="legend text-ink-soft">До початку</p>
            <p className="tnum mt-4 font-serif text-7xl leading-none text-carmine md:text-8xl">
              {daysToStart !== null && daysToStart > 0 ? daysToStart : '—'}
            </p>
            <p className="mt-3 font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
              {daysToStart !== null && daysToStart > 0
                ? withCountUa(daysToStart, ['день', 'дні', 'днів'])
                : 'Конгрес розпочато'}
            </p>

            <div className="mt-8 border-t border-rule pt-5">
              <PlateLabel tone="teal">Перший день роботи</PlateLabel>
              <p className="mt-3 font-serif text-xl leading-snug text-ink">{formatUaDate(meta.dates?.start)}</p>
              <p className="mt-2 font-mono text-xs leading-relaxed tracking-[0.06em] text-ink-soft">
                {`${meta.venueName}, ${meta.venueAddress}`}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <SectionHeading
              eyebrow="Програма конгресу"
              size="md"
              title="Дати, які варто тримати в полі зору"
              lead="Конгрес триває чотири дні: від засідання про морфологічні інновації 14 жовтня до підсумків і закриття 17 жовтня. Нижче — головні події програми."
            />

            {dates.length > 0 ? (
              <ul className="mt-9 border-y border-rule">
                {dates.map((item, index) => (
                  <li key={item.id} className="border-b border-rule last:border-b-0">
                    <IndexRow
                      index={String(index + 1).padStart(2, '0')}
                      title={item.label}
                      subtitle={item.note}
                      meta={item.dateLabel}
                      metaTone={item.emphasis ? 'carmine' : 'teal'}
                      accent={item.emphasis}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p role="status" className="mt-9 border-y border-rule py-4 font-mono text-xs tracking-[0.06em] text-ink-soft">
                {error
                  ? 'Не вдалося завантажити календар. Оновіть сторінку.'
                  : 'Календар підготовки завантажується…'}
              </p>
            )}

            <p className="mt-5 font-mono text-xs leading-relaxed tracking-[0.06em] text-ink-soft">
              Акцентні події позначені карміном — це ключові засідання програми.
            </p>
          </Reveal>
        </div>
      </PlateFrame>
    </div>
  )
}
