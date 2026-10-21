import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'

// Анонс конгресу: редакційна двоколонкова стаття з буквицею, перелік форматів
// участі як індекс і гістологічна ілюстрація в рамці.
// Зображення отримано через find_image (слот «lab») і внесено в design-system.md.
const LAB_FIGURE = {
  url: 'https://images.pexels.com/photos/8442368/pexels-photo-8442368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  alt: 'Науковиця працює з гістологічними скельцями в лабораторії',
  width: 5192,
  height: 3466,
  avgColor: '#AAB0AE',
  caption: 'Робота з гістологічними препаратами',
}

export default function Announcement() {
  const { data: congress } = useSingleton('congress')
  const meta = congress ?? CONGRESS_SHELL

  const paragraphs = String(meta.announcement ?? '')
    .split('\n\n')
    .map((text) => text.trim())
    .filter(Boolean)
  const formats = Array.isArray(meta.formats) ? meta.formats : []

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
      <PlateFrame as="section" id="anons" figure="FIG. 02" label="Анонс конгресу">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <Reveal className="min-w-0">
            <SectionHeading
              eyebrow="Запрошення до участі"
              size="md"
              title={`Конгрес ${meta.societyAcronym} ${meta.year ?? ''}`.trim()}
              lead={meta.announcementLead}
            />

            <div className="mt-9 text-lg leading-relaxed text-ink/90 md:columns-2 md:gap-10">
              {paragraphs.map((text, index) => (
                <p
                  key={text.slice(0, 24)}
                  className={
                    index === 0
                      ? 'mb-5 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.5rem] first-letter:leading-[0.7] first-letter:text-carmine'
                      : 'mb-5'
                  }
                >
                  {text}
                </p>
              ))}
            </div>

            {meta.announcementNote && (
              <p className="mt-6 border-l-2 border-carmine pl-4 font-mono text-xs leading-relaxed tracking-[0.06em] text-ink-soft">
                {meta.announcementNote}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="flex min-w-0 flex-col gap-9">
            {formats.length > 0 && (
              <div>
                <PlateLabel tone="teal">Формати участі</PlateLabel>
                <ul className="mt-5 border-y border-rule">
                  {formats.map((format, index) => (
                    <li
                      key={format}
                      className="flex items-baseline gap-4 border-b border-rule px-1 py-3 last:border-b-0"
                    >
                      <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-serif text-xl leading-snug text-ink">{format}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <figure className="plate-frame bg-plate p-2.5">
              <div className="aspect-video overflow-hidden" style={{ backgroundColor: LAB_FIGURE.avgColor }}>
                <img
                  src={LAB_FIGURE.url}
                  alt={LAB_FIGURE.alt}
                  width={LAB_FIGURE.width}
                  height={LAB_FIGURE.height}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 px-1 pb-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
                {LAB_FIGURE.caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </PlateFrame>
    </div>
  )
}
