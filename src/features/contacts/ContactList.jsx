import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import { cn } from '../../lib/cn.js'
import { byOrder } from '../../services/api.js'

// Канали зв'язку як індекс-список атласу: онлайн-зали (Google Meet),
// адреса місця проведення та організаційна інформація. Посилання справжні:
// відкриваються в новій вкладці, адреса — простим текстом із посиланням
// на сторінку місця проведення.

const TYPE_GROUPS = [
  { id: 'link', label: 'Онлайн-зали', note: 'Google Meet: долучення до засідань у дні конгресу' },
  { id: 'address', label: 'Адреса', note: 'Місце очної участі та зали засідань' },
  { id: 'note', label: 'Організаційна інформація', note: 'Формат роботи, час і спосіб звернення' },
]

const OTHER_GROUP = { id: 'other', label: 'Інші канали', note: 'Додаткові способи зв’язку' }

function ContactRow({ index, contact }) {
  const isLink = contact.type === 'link'

  return (
    <li className="index-row group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-l-2 border-transparent px-3 py-4 hover:translate-x-1 hover:border-carmine hover:bg-plate-dim sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:px-4">
      <span className="tnum legend text-ink-soft transition-colors group-hover:text-carmine">{index}</span>
      <div className="min-w-0">
        <p className="font-serif text-xl leading-snug text-ink md:text-2xl">{contact.label}</p>

        {isLink ? (
          <a
            href={contact.value}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'link-rule mt-2 inline-block break-words font-mono text-[15px] text-teal transition-colors duration-200 hover:text-carmine hover:link-rule-on',
            )}
          >
            {contact.value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <p className="mt-2 max-w-[62ch] font-serif text-lg leading-relaxed text-ink">{contact.value}</p>
        )}

        {contact.note && (
          <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">{contact.note}</p>
        )}
      </div>
    </li>
  )
}

export default function ContactList({ contacts = [], loading = false }) {
  const ordered = byOrder(contacts)
  const declared = TYPE_GROUPS.map((group) => ({
    ...group,
    rows: ordered.filter((contact) => contact.type === group.id),
  })).filter((group) => group.rows.length > 0)

  const knownTypes = new Set(TYPE_GROUPS.map((group) => group.id))
  const rest = ordered.filter((contact) => !knownTypes.has(contact.type))
  const groups = rest.length > 0 ? [...declared, { ...OTHER_GROUP, rows: rest }] : declared

  if (loading) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">Завантажуємо канали зв’язку…</p>
    )
  }

  if (groups.length === 0) {
    return (
      <p className="border-l-2 border-rule px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
        Канали зв’язку оргкомітет оприлюднить найближчим часом.
      </p>
    )
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {groups.map((group, index) => (
        <Reveal
          key={group.id}
          as="section"
          id={`contact-${group.id}`}
          delay={index * 0.08}
          className="scroll-mt-32 border-t border-rule pt-10 md:grid md:grid-cols-[minmax(0,2.5fr)_minmax(0,9.5fr)] md:gap-10 md:pt-14"
        >
          <div className="md:sticky md:top-32 md:self-start">
            <span
              aria-hidden="true"
              className="tnum block font-serif text-6xl leading-none text-carmine/35 md:text-7xl"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="mt-5 font-serif text-2xl leading-tight text-ink md:text-3xl">{group.label}</h2>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">{group.note}</p>
          </div>

          <PlateFrame figure={`FIG. 07.${index + 1}`} label={group.label} className="mt-7 md:mt-0">
            <ul className="divide-y divide-rule">
              {group.rows.map((contact, rowIndex) => (
                <ContactRow key={contact.id} index={String(rowIndex + 1).padStart(2, '0')} contact={contact} />
              ))}
            </ul>

            {group.id === 'address' && (
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
                <PlateLabel tone="teal" className="block">
                  Схема залів, проїзд і перебування
                </PlateLabel>
                <Button to="/venue" variant="quiet" className="ml-auto">
                  Сторінка місця проведення →
                </Button>
              </div>
            )}
          </PlateFrame>
        </Reveal>
      ))}
    </div>
  )
}
