import { useMemo } from 'react'
import Button from '../../components/ui/Button.jsx'
import HairlineRule from '../../components/ui/HairlineRule.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { useCollection, useSingleton } from '../../hooks/useCollection.js'
import { byOrder } from '../../services/api.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'
import { formatUaRange, withCountUa } from '../../lib/format.js'
import AddressAndCity from './AddressAndCity.jsx'
import HallsAndOnline from './HallsAndOnline.jsx'
import HowToGetThere from './HowToGetThere.jsx'
import VenueMap from './VenueMap.jsx'
import AccommodationList from './AccommodationList.jsx'

// Чорнильна «титульна таблиця» сторінки: адреса, зали та онлайн-участь.
function VenueMasthead({ meta, venue, transportCount, onlineCount }) {
  const facts = [
    { id: 'address', label: 'Адреса', value: venue?.address || meta.venueAddress },
    { id: 'city', label: 'Місто', value: `${venue?.city || meta.city}, ${venue?.country || meta.country}` },
    {
      id: 'halls',
      label: 'Зали конгресу',
      value: withCountUa(venue?.halls?.length ?? 0, ['зала', 'зали', 'зал']),
    },
    {
      id: 'online',
      label: 'Зали онлайн',
      value: withCountUa(onlineCount, ['зала', 'зали', 'зал']),
    },
    {
      id: 'dates',
      label: 'Дати',
      value: meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end),
    },
    {
      id: 'routes',
      label: 'Як дістатися',
      value: withCountUa(transportCount, ['варіант', 'варіанти', 'варіантів']),
    },
  ]

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <span aria-hidden="true" className="font-serif text-4xl leading-none text-carmine md:text-5xl">
                {meta.ordinal}
              </span>
              <PlateLabel tone="inverse">Місце проведення · {meta.city}</PlateLabel>
            </div>

            <h1 className="mt-8 font-serif text-4xl leading-[1.02] text-paper md:text-6xl">
              Готель «Супутник» у Львові
            </h1>

            <p className="mt-6 max-w-[64ch] text-lg leading-relaxed text-paper/75">
              Очна частина конгресу відбувається за однією адресою — вул. Княгині Ольги, 116. Тут працюють
              зали 1, 2 і 3, стійка реєстрації та виставка партнерів, тут само — дружня вечеря 15 жовтня.
              Для тих, хто не може приїхати, засідання транслюються онлайн у Google Meet.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/program" variant="outlineInverse">
                Програма конгресу
              </Button>
              <Button to="/contacts" variant="quiet" className="text-paper/70 hover:text-carmine">
                Форма запиту до оргкомітету →
              </Button>
            </div>
          </div>

          <dl className="grid gap-px self-start border border-paper/20 bg-paper/20">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-ink px-5 py-4"
              >
                <dt className="legend text-paper/55">{fact.label}</dt>
                <dd className="font-serif text-lg leading-snug text-paper">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// Розділ «Місце проведення»: адреса, зали з онлайн-посиланнями, схема, проїзд
// і перебування учасників.
export default function VenuePage() {
  const { data: congress } = useSingleton('congress')
  const { data: venue } = useSingleton('venue')
  const { data: accommodationRaw } = useCollection('accommodation')
  const { data: contactsRaw } = useCollection('contacts')
  const meta = congress ?? CONGRESS_SHELL

  const stays = useMemo(() => byOrder(accommodationRaw), [accommodationRaw])
  const addressContact = useMemo(
    () => contactsRaw.find((contact) => contact.type === 'address') ?? null,
    [contactsRaw],
  )

  const halls = Array.isArray(venue?.halls) ? venue.halls : []
  const onlineCount = halls.filter((hall) => hall.online).length

  return (
    <>
      <VenueMasthead
        meta={meta}
        venue={venue}
        transportCount={venue?.transport?.length ?? 0}
        onlineCount={onlineCount}
      />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <SectionHeading
          eyebrow="Адреса і зали"
          figure="FIG. 11"
          title="Одна адреса для всіх засідань"
          lead="Готель «Супутник» на вул. Княгині Ольги, 116 у Львові приймає очну частину конгресу: зали засідань, реєстрацію, виставку партнерів і дружню вечерю. Нижче — адреса, зали з посиланнями на онлайн-трансляції, схема розташування та варіанти проїзду."
        />

        <HairlineRule withDiamond tone="ink" className="my-8" />

        {venue ? (
          <Reveal>
            <AddressAndCity venue={venue} addressContact={addressContact} />
          </Reveal>
        ) : (
          <PlateFrame figure="FIG. 12" label="Адреса та зали">
            <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
              Завантаження даних про місце проведення…
            </p>
          </PlateFrame>
        )}
      </section>

      {venue && (
        <>
          <Reveal className="mx-auto max-w-6xl px-5 pb-16 md:px-6 md:pb-20">
            <HallsAndOnline halls={halls} />
          </Reveal>

          <Reveal className="mx-auto max-w-6xl px-5 pb-16 md:px-6 md:pb-20">
            <HowToGetThere transport={venue.transport ?? []} parkingNote={venue.parkingNote} />
          </Reveal>

          <Reveal className="mx-auto max-w-6xl px-5 pb-16 md:px-6 md:pb-20">
            <VenueMap venue={venue} />
          </Reveal>
        </>
      )}

      {stays.length > 0 && (
        <Reveal className="mx-auto max-w-6xl px-5 pb-16 md:px-6 md:pb-20">
          <AccommodationList items={stays} />
        </Reveal>
      )}

      <Reveal className="mx-auto max-w-6xl px-5 pb-20 md:px-6 md:pb-28">
        <PlateFrame tone="ink" label="Запитання щодо участі та проїзду">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-paper md:text-4xl">
                Координаційний комітет відповість на організаційні питання
              </h2>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-paper/75">
                Реєстрація, онлайн-підключення до зали, сертифікати БПР, проживання в готелі та
                доступність залів — напишіть через форму на сторінці контактів. Запит реєструється
                в журналі оргкомітету з номером і датою.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button to="/contacts" variant="outlineInverse">
                Контакти
              </Button>
              <Button to="/program" variant="outlineInverse">
                Програма
              </Button>
            </div>
          </div>
        </PlateFrame>
      </Reveal>
    </>
  )
}
