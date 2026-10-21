import { Link } from 'react-router-dom'
import HairlineRule from '../ui/HairlineRule.jsx'
import PlateLabel from '../ui/PlateLabel.jsx'
import { useCollection, useSingleton } from '../../hooks/useCollection.js'
import { byOrder } from '../../services/api.js'
import { CONGRESS_SHELL, NAV_LINKS } from '../../data/siteMeta.js'
import { daysUntil, formatDaysLeft, formatUaDateNumeric, formatUaRange } from '../../lib/format.js'

// Темний чорнильний підвал: дати, місто, розділи сайту й контакти моноширинним.
export default function Footer() {
  const { data: congress } = useSingleton('congress')
  const { data: society } = useSingleton('society')
  const { data: contacts } = useCollection('contacts')
  const meta = congress ?? CONGRESS_SHELL

  const dateLabel = meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)
  const channels = byOrder(Array.isArray(contacts) ? contacts : [])
  const daysToStart = daysUntil(meta.dates?.start)

  return (
    <footer className="border-t border-paper/15 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,4fr)] lg:gap-10">
          {/* Колонка 1 — табличка конгресу */}
          <div className="flex gap-5">
            <span aria-hidden="true" className="font-serif text-5xl leading-none text-paper/35 md:text-6xl">
              {meta.ordinal}
            </span>
            <div>
              <p className="font-serif text-2xl leading-tight text-paper">{`Конгрес ${meta.societyAcronym}`}</p>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-paper/65">{meta.title}</p>
              <PlateLabel tone="inverse" className="mt-5">
                {`${dateLabel} · ${meta.city}, ${meta.country}`}
              </PlateLabel>
              <p className="mt-2 font-mono text-xs leading-relaxed tracking-[0.08em] text-paper/50">
                {`${meta.venueName}, ${meta.venueAddress}`}
              </p>
              {daysToStart !== null && daysToStart > 0 && (
                <p className="mt-4 inline-block border border-carmine/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-carmine">
                  {`До відкриття — ${formatDaysLeft(meta.dates?.start)}`}
                </p>
              )}
            </div>
          </div>

          {/* Колонка 2 — розділи */}
          <nav aria-label="Розділи сайту">
            <PlateLabel tone="inverse">Розділи</PlateLabel>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-block font-serif text-lg text-paper/80 transition-colors duration-200 hover:text-carmine"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-paper/15 pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-paper/45">
              {society
                ? `${society.acronym} · ${society.name}`
                : 'Наукове товариство анатомів, гістологів, ембріологів та топографоанатомів України'}
            </p>
          </nav>

          {/* Колонка 3 — контакти */}
          <div>
            <PlateLabel tone="inverse">Оргкомітет</PlateLabel>
            <ul className="mt-5 space-y-4">
              {channels.slice(0, 4).map((channel) => (
                <li key={channel.id} className="border-b border-paper/12 pb-4 last:border-b-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">{channel.label}</p>
                  {channel.type === 'link' ? (
                    <a
                      href={channel.value}
                      target="_blank"
                      rel="noreferrer"
                      className="link-rule mt-1.5 inline-block font-mono text-sm text-paper transition-colors duration-200 hover:text-carmine hover:link-rule-on"
                    >
                      {channel.value.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="mt-1.5 block text-sm leading-relaxed text-paper/75">{channel.value}</span>
                  )}
                </li>
              ))}
              {!channels.length && (
                <li>
                  <Link to="/contacts" className="font-serif text-lg text-paper/80 hover:text-carmine">
                    Перейти до контактів
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <HairlineRule tone="inverse" withDiamond className="my-10" />

        <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${meta.year ?? 2026} ${meta.societyAcronym}. Усі права застережено`}</p>
          <p>{meta.updatedAt ? `Матеріали оновлено ${formatUaDateNumeric(meta.updatedAt)}` : 'Сайт конгресу'}</p>
        </div>
      </div>
    </footer>
  )
}
