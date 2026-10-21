import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'

// Короткий блок про Наукове товариство: таблиця фактів моноширинним,
// напрями роботи конгресу як нумерований індекс, фахові видання та
// фотографія зали в рамці. Усі дані — з колекції society (db.json).
export default function AboutTheSociety() {
  const { data: society } = useSingleton('society')

  if (!society) {
    return (
      <div className="mx-auto max-w-6xl px-5 pb-12 md:px-6 md:pb-16">
        <PlateFrame as="section" id="tovarystvo" figure="FIG. 05" label="Про товариство">
          <SectionHeading eyebrow="Наукове товариство" size="md" title={CONGRESS_SHELL.societyName} />
          <p role="status" className="mt-6 border-t border-rule pt-5 font-mono text-xs tracking-[0.06em] text-ink-soft">
            Відомості про товариство завантажуються…
          </p>
        </PlateFrame>
      </div>
    )
  }

  const facts = Array.isArray(society.facts) ? society.facts : []
  const focusAreas = Array.isArray(society.focusAreas) ? society.focusAreas : []
  const journals = Array.isArray(society.journals) ? society.journals : []
  const leadership = Array.isArray(society.leadership) ? society.leadership : []
  const image = society.image

  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 md:px-6 md:pb-16">
      <PlateFrame as="section" id="tovarystvo" figure="FIG. 05" label="Про товариство">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <Reveal className="min-w-0">
            <SectionHeading
              eyebrow={`${society.acronym} · VIII Конгрес`}
              size="md"
              title={society.name}
              lead={society.description}
            />

            {facts.length > 0 && (
              <dl className="mt-9 grid gap-px border border-rule bg-rule sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.id} className="bg-plate px-5 py-4">
                    <dt className="legend text-ink-soft">{fact.label}</dt>
                    <dd className="tnum mt-3 font-serif text-2xl leading-tight text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {focusAreas.length > 0 && (
              <div className="mt-9">
                <PlateLabel tone="teal">Напрями роботи конгресу</PlateLabel>
                <ul className="mt-5 border-y border-rule">
                  {focusAreas.map((area, index) => (
                    <li
                      key={area}
                      className="flex items-baseline gap-4 border-b border-rule px-1 py-3 transition-colors duration-200 last:border-b-0 hover:bg-plate-dim"
                    >
                      <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-[17px] leading-snug text-ink">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {society.note && (
              <p className="mt-7 max-w-[68ch] text-[17px] leading-relaxed text-ink-soft">{society.note}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/committee" variant="outline">
                Комітети конгресу
              </Button>
              <Button to="/program" variant="quiet">
                Програма конгресу →
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex min-w-0 flex-col gap-8">
            <figure className="plate-frame bg-plate p-2.5">
              <div
                className="aspect-[4/3] overflow-hidden"
                style={image ? { backgroundColor: image.avgColor } : undefined}
              >
                {image && (
                  <img
                    src={image.url}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <figcaption className="mt-3 px-1 pb-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
                {image?.caption ?? 'Наукове засідання в залі конгресу'}
              </figcaption>
            </figure>

            {journals.length > 0 && (
              <div className="border border-rule bg-plate px-5 py-5">
                <PlateLabel tone="teal">Наукові журнали товариства</PlateLabel>
                <ul className="mt-4 divide-y divide-rule">
                  {journals.map((journal) => (
                    <li
                      key={journal}
                      className="py-2.5 text-[15px] leading-relaxed text-ink first:pt-0 last:pb-0"
                    >
                      {journal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {leadership.map((person) => (
              <div key={person.id} className="border border-rule bg-plate px-5 py-5">
                <PlateLabel tone="teal">Керівництво</PlateLabel>
                <p className="mt-4 font-serif text-xl leading-snug text-ink">{person.name}</p>
                <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ink-soft">
                  {person.role}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{person.affiliation}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </PlateFrame>
    </div>
  )
}
