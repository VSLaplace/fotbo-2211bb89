import Button from '../../components/ui/Button.jsx'
import HairlineRule from '../../components/ui/HairlineRule.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import { useSingleton } from '../../hooks/useCollection.js'

// Звернення оргкомітету — чорнильна таблиця всередині сторінки: портретна
// ілюстрація в рамці ліворуч, текст звернення серифом праворуч і підпис моно.
// Ілюстрація з find_image (слот «anatomia»), зафіксована в design-system.md.
const GREETING_FIGURE = {
  url: 'https://images.pexels.com/photos/33469924/pexels-photo-33469924.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  alt: 'Студенти вивчають будову серця на анатомічній моделі під час практичного заняття',
  width: 3744,
  height: 5616,
  avgColor: '#9D8B81',
  caption: 'Практичне заняття з анатомії людини',
}

export default function GreetingFromOrganizers() {
  const { data: congress } = useSingleton('congress')

  const invitation = congress?.invitation ?? null
  const paragraphs = Array.isArray(invitation?.paragraphs)
    ? invitation.paragraphs.map((text) => String(text).trim()).filter(Boolean)
    : []
  const leaders = Array.isArray(invitation?.leaders) ? invitation.leaders : []

  if (!congress || paragraphs.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 md:px-6 md:pb-16">
      <PlateFrame as="section" id="zvernennya" tone="ink" figure="FIG. 04" label="Звернення оргкомітету">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
          <Reveal className="min-w-0">
            <figure className="plate-frame-ink bg-ink p-2.5">
              <div className="aspect-[3/4] overflow-hidden" style={{ backgroundColor: GREETING_FIGURE.avgColor }}>
                <img
                  src={GREETING_FIGURE.url}
                  alt={GREETING_FIGURE.alt}
                  width={GREETING_FIGURE.width}
                  height={GREETING_FIGURE.height}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 px-1 pb-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-paper/60">
                {GREETING_FIGURE.caption}
              </figcaption>
            </figure>

            {leaders.length > 0 && (
              <ul className="mt-7 border-t border-paper/20">
                {leaders.map((leader) => (
                  <li key={leader.id} className="border-b border-paper/15 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-carmine">{leader.role}</p>
                    <p className="mt-2 font-serif text-xl leading-snug text-paper">{leader.name}</p>
                    <p className="mt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-paper/55">
                      {leader.affiliation}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <PlateLabel tone="inverse">{invitation.eyebrow ?? 'Лист до учасників'}</PlateLabel>

            <blockquote className="mt-6">
              {paragraphs.map((text, index) => (
                <p
                  key={text.slice(0, 24)}
                  className={
                    index === 0
                      ? 'font-serif text-2xl leading-snug text-paper md:text-3xl'
                      : 'mt-5 text-lg leading-relaxed text-paper/80'
                  }
                >
                  {text}
                </p>
              ))}
            </blockquote>

            <HairlineRule tone="inverse" withDiamond className="my-8" />

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              {invitation.signature ?? 'Оргкомітет конгресу'}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
              {`${congress.dateRangeLabel ?? ''} · ${congress.venueName}, ${congress.venueAddress} · ${congress.city}`}
            </p>

            <div className="mt-7">
              <Button to="/committee" variant="outlineInverse">
                Склад комітетів конгресу
              </Button>
            </div>
          </Reveal>
        </div>
      </PlateFrame>
    </div>
  )
}
