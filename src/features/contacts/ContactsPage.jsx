import CongressMasthead from '../../components/ui/CongressMasthead.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import ContactList from './ContactList.jsx'
import InquiryForm from './InquiryForm.jsx'
import { byOrder } from '../../services/api.js'
import { useCollection, useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'
import { formatUaRange, withCountUa } from '../../lib/format.js'

// Сторінка «Контакти»: перелік каналів зв'язку оргкомітету та робоча форма
// запиту, яка зберігає звернення в базі (колекція inquiries).

const WRITING_TIPS = [
  {
    id: 'subject',
    label: 'Тема запиту',
    text: 'Оберіть її зі списку: участь і реєстрація, програма та доповіді, онлайн-підключення, сертифікати БПР, публікація матеріалів, проїзд і проживання, партнерство.',
  },
  {
    id: 'details',
    label: 'Що вказати',
    text: 'Повне ім’я, установу та місто, а також день і залу конгресу, якщо питання стосується конкретного засідання.',
  },
  {
    id: 'urgent',
    label: 'Термінові питання',
    text: 'Якщо відповідь потрібна до початку засідання, позначте це в першому рядку — такі запити опрацьовують позачергово.',
  },
]

export default function ContactsPage() {
  const { data: contacts, loading } = useCollection('contacts')
  const { data: congress } = useSingleton('congress')

  const meta = congress ?? CONGRESS_SHELL
  const ordered = byOrder(contacts)
  const links = ordered.filter((contact) => contact.type === 'link')
  const address = ordered.find((contact) => contact.type === 'address')
  const formatNote = ordered.find((contact) => contact.id === 'contact-format')

  const mastheadMeta = [
    links.length > 0 && {
      label: 'Онлайн-зали',
      value: withCountUa(links.length, ['зала', 'зали', 'зал']),
    },
    address && { label: 'Місце проведення', value: address.value },
    formatNote && { label: 'Формат роботи', value: formatNote.value },
    {
      label: 'Дати',
      value: meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end),
    },
  ].filter(Boolean)

  return (
    <>
      <CongressMasthead
        breadcrumb={`${meta.ordinal} Конгрес ${meta.societyAcronym} · ${meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)}`}
        figure="FIG. 07"
        eyebrow="Контакти"
        numeral="07"
        title="Як долучитися та з ким зв’язатися"
        lead="Онлайн-зали конгресу відкриваються за посиланнями Google Meet, очна частина відбувається в готелі «Супутник» у Львові. Якщо потрібна відповідь від оргкомітету, скористайтеся формою нижче: запит реєструється з номером і датою, і координаційний комітет скерує його відповідальній людині."
        meta={mastheadMeta}
      />

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <ContactList contacts={contacts} loading={loading} />
      </div>

      <section aria-labelledby="inquiry-heading" className="border-t border-rule bg-plate-dim/40">
        <div className="mx-auto max-w-6xl px-5 py-14 md:grid md:grid-cols-[minmax(0,3.5fr)_minmax(0,8.5fr)] md:gap-12 md:px-6 md:py-20">
          <Reveal className="md:sticky md:top-32 md:self-start">
            <span
              aria-hidden="true"
              className="tnum block font-serif text-6xl leading-none text-carmine/35 md:text-7xl"
            >
              04
            </span>
            <h2 id="inquiry-heading" className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl">
              Форма запиту
            </h2>
            <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-ink-soft">
              Запит зберігається в журналі оргкомітету: у відповіді буде видно його номер, тож листування не загубиться
              між кількома листами.
            </p>

            <ul className="mt-8 divide-y divide-rule border-t border-rule">
              {WRITING_TIPS.map((tip) => (
                <li key={tip.id} className="py-4">
                  <PlateLabel tone="teal" className="block">
                    {tip.label}
                  </PlateLabel>
                  <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-ink-soft">{tip.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 md:mt-0">
            <InquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
