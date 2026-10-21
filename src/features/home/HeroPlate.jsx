import { Link } from 'react-router-dom'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'
import { formatUaRange } from '../../lib/format.js'

// Титульна таблиця конгресу — темна чорнильна основа, велика серифна цифра
// як якір колонки, офіційний плакат конгресу (власний матеріал оргкомітету)
// у подвійній рамці праворуч і рядок статистики внизу, як у шапці
// наукової публікації.

// Кнопки першого екрана: на чорнилі звичайні варіанти Button зливаються з
// тлом (ink на ink), тому тут власна інверсія «папір ← чорнило».
const CTA_BASE =
  'inline-flex items-center justify-center gap-2.5 rounded-[2px] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carmine'
const CTA_PRIMARY = `${CTA_BASE} bg-paper text-ink hover:bg-carmine hover:text-paper`
const CTA_OUTLINE = `${CTA_BASE} border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink`

export default function HeroPlate() {
  const { data: congress } = useSingleton('congress')
  const meta = congress ?? CONGRESS_SHELL

  const hero = meta.heroImage
  const stats = Array.isArray(meta.stats) ? meta.stats : []
  const organizers = Array.isArray(meta.organizers) ? meta.organizers : []
  const dateLabel = meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)

  const facts = [
    { id: 'dates', label: 'Дати проведення', value: dateLabel },
    { id: 'city', label: 'Місто', value: `${meta.city}, ${meta.country}` },
    { id: 'venue', label: 'Місце проведення', value: `${meta.venueName}, ${meta.venueAddress}` },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-14 right-2 select-none font-serif text-[12rem] leading-none text-paper/5 md:-top-24 md:text-[20rem]"
      >
        {meta.ordinal}
      </span>

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-11 md:px-6 md:pb-20 md:pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-paper/15 pb-4">
          <PlateLabel tone="inverse">{`Офіційний сайт конгресу · ${meta.societyAcronym}`}</PlateLabel>
          <PlateLabel tone="inverse" className="hidden sm:inline-flex">
            {`${meta.city} · ${dateLabel}`}
          </PlateLabel>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <Reveal className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span aria-hidden="true" className="font-serif text-6xl leading-[0.7] text-carmine md:text-7xl">
                {meta.ordinal}
              </span>
              <PlateLabel tone="inverse">{meta.year ? `Конгрес · ${meta.year}` : 'Конгрес товариства'}</PlateLabel>
            </div>

            <h1 className="mt-6 max-w-[30ch] font-serif text-3xl leading-[1.08] text-paper md:text-5xl">
              {`${meta.ordinal} ${meta.title ?? `Конгрес ${meta.societyName}`}`}
            </h1>

            <div className="mt-8 border-l-2 border-carmine pl-5">
              <PlateLabel tone="inverse">Формат конгресу</PlateLabel>
              <p className="mt-3 max-w-[34ch] font-serif text-2xl italic leading-snug text-paper/90 md:text-3xl">
                {meta.format ?? CONGRESS_SHELL.format}
              </p>
            </div>

            {organizers.length > 0 && (
              <div className="mt-9">
                <PlateLabel tone="inverse">Організатори</PlateLabel>
                <ul className="mt-4 border-y border-paper/20">
                  {organizers.map((organizer, index) => (
                    <li
                      key={organizer}
                      className="flex items-baseline gap-4 border-b border-paper/12 px-1 py-2.5 last:border-b-0"
                    >
                      <span className="tnum legend shrink-0 text-paper/45">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-paper/70">
                        {organizer}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-paper/75">{meta.announcementLead}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Link to="/program" className={CTA_PRIMARY}>
                Програма конгресу
              </Link>
              <Link to="/venue" className={CTA_OUTLINE}>
                Місце проведення
              </Link>
              <Link
                to="/committee"
                className="legend text-paper/65 underline decoration-paper/30 underline-offset-4 transition-colors duration-200 hover:text-paper hover:decoration-carmine"
              >
                Оргкомітет →
              </Link>
            </div>

            <dl className="mt-11 grid gap-px border border-paper/20 bg-paper/20 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.id} className="bg-ink px-5 py-4">
                  <dt className="legend text-paper/55">{fact.label}</dt>
                  <dd className="mt-2.5 font-serif text-xl leading-snug text-paper">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <figure className="plate-frame-ink bg-ink p-2.5">
              <div
                className="aspect-[3/2] overflow-hidden bg-plate-dim"
                style={hero ? { backgroundColor: hero.avgColor } : undefined}
              >
                {hero && (
                  <img
                    src={hero.url}
                    alt={hero.alt}
                    width={hero.width}
                    height={hero.height}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 px-1 pb-1">
                <span className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-paper/60">
                  {hero?.caption ?? 'FIG. 01 — Офіційний плакат конгресу'}
                </span>
                {hero?.url && (
                  <a
                    href={hero.url}
                    target="_blank"
                    rel="noreferrer"
                    className="legend text-paper/55 underline decoration-paper/30 underline-offset-4 transition-colors duration-200 hover:text-paper hover:decoration-carmine"
                  >
                    Плакат у повному розмірі ↗
                  </a>
                )}
              </figcaption>
              {hero?.source && (
                <p className="px-1 pb-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-paper/40">
                  {hero.source}
                </p>
              )}
            </figure>
          </Reveal>
        </div>

        {stats.length > 0 && (
          <Reveal delay={0.15}>
            <dl className="mt-12 grid gap-px border border-paper/20 bg-paper/20 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-ink px-5 py-5">
                  <dt className="legend text-paper/55">{stat.label}</dt>
                  <dd className="tnum mt-3 font-serif text-4xl leading-none text-paper">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  )
}
