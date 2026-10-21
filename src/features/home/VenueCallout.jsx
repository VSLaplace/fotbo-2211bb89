import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'

// Заклик до сторінки місця проведення — чорнильна смуга в кінці головної:
// адреса й зали як індекс, поряд — короткий перелік способів доїзду.
export default function VenueCallout() {
  const { data: venue } = useSingleton('venue')
  const meta = CONGRESS_SHELL

  const halls = Array.isArray(venue?.halls) ? venue.halls : []
  const transport = Array.isArray(venue?.transport) ? venue.transport.slice(0, 3) : []
  const address = venue
    ? `${venue.address}, ${venue.city}, ${venue.postalCode}`
    : `${meta.venueAddress}, ${meta.city}`

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <PlateFrame as="div" tone="ink" figure="FIG. 06" label="Місце проведення">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
              <div className="min-w-0">
                <SectionHeading
                  eyebrow="Адреса конгресу"
                  size="md"
                  inverted
                  labelTone="inverse"
                  title={venue?.name ?? meta.venueName}
                  lead={venue?.institution ?? meta.societyName}
                />

                <dl className="mt-8 grid gap-px border border-paper/20 bg-paper/20 sm:grid-cols-2">
                  <div className="bg-ink px-5 py-4">
                    <dt className="legend text-paper/55">Адреса</dt>
                    <dd className="mt-2.5 font-mono text-sm leading-relaxed tracking-[0.04em] text-paper">
                      {address}
                    </dd>
                  </div>
                  <div className="bg-ink px-5 py-4">
                    <dt className="legend text-paper/55">Зали засідань</dt>
                    <dd className="tnum mt-2.5 font-serif text-3xl leading-none text-paper">
                      {halls.length > 0 ? halls.length : '—'}
                    </dd>
                  </div>
                </dl>

                {halls.length > 0 && (
                  <ul className="mt-8 border-y border-paper/20">
                    {halls.map((hall, index) => (
                      <li
                        key={hall.id}
                        className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-paper/15 px-1 py-3.5 last:border-b-0 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]"
                      >
                        <span className="tnum legend text-paper/60">{String(index + 1).padStart(2, '0')}</span>
                        <span className="min-w-0">
                          <span className="block font-serif text-xl leading-snug text-paper">{hall.name}</span>
                          <span className="mt-1 block font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-paper/55">
                            {hall.location}
                          </span>
                        </span>
                        <span className="tnum col-span-2 font-mono text-xs tracking-[0.06em] text-paper/65 sm:col-span-1 sm:text-right">
                          {hall.online ? 'Онлайн' : hall.capacity}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="min-w-0">
                {transport.length > 0 && (
                  <div>
                    <PlateLabel tone="inverse">Як дістатися</PlateLabel>
                    <ul className="mt-5 border-y border-paper/20">
                      {transport.map((route) => (
                        <li key={route.id} className="border-b border-paper/15 px-1 py-3.5 last:border-b-0">
                          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/55">
                            {route.mode}
                          </p>
                          <p className="mt-2 font-serif text-lg leading-snug text-paper">{route.title}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {venue?.mapNote && (
                  <p className="mt-7 border-l-2 border-carmine pl-4 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-paper/60">
                    {venue.mapNote}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
                  <Button to="/venue" variant="outlineInverse">
                    Зали, онлайн-участь і проїзд
                  </Button>
                  <Link
                    to="/contacts"
                    className="legend text-paper/65 underline decoration-paper/30 underline-offset-4 transition-colors duration-200 hover:text-paper hover:decoration-carmine"
                  >
                    Запитати в оргкомітету →
                  </Link>
                </div>
              </div>
            </div>
          </PlateFrame>
        </Reveal>
      </div>
    </section>
  )
}
