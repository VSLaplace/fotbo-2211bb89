import { useEffect, useMemo, useState } from 'react'
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
import DaySelector from './DaySelector.jsx'
import SessionListByDay from './SessionListByDay.jsx'
import ProgramNotes from './ProgramNotes.jsx'

const PANEL_ID = 'program-day-panel'

// Шапка сторінки — чорнильна «титульна таблиця» з ординалом і фактами.
function ProgramMasthead({ meta, dayCount, sessionCount }) {
  const facts = [
    { id: 'dates', label: 'Дати', value: meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end) },
    { id: 'days', label: 'Днів засідань', value: withCountUa(dayCount, ['день', 'дні', 'днів']) },
    { id: 'items', label: 'Позицій програми', value: withCountUa(sessionCount, ['позиція', 'позиції', 'позицій']) },
    { id: 'venue', label: 'Місце', value: `${meta.venueName}, ${meta.venueAddress}` },
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
              <PlateLabel tone="inverse">Конгрес {meta.societyAcronym} · {meta.city}</PlateLabel>
            </div>

            <h1 className="mt-8 font-serif text-4xl leading-[1.02] text-paper md:text-6xl">
              Програма конгресу
            </h1>

            <p className="mt-6 max-w-[64ch] text-lg leading-relaxed text-paper/75">
              Чотири дні засідань у готелі «Супутник» та онлайн: засідання про морфологічні інновації
              14 жовтня, чотири пленарні засідання й чотири секції 15 жовтня, круглий стіл для молодих
              дослідників і три секції 16 жовтня, підсумки та закриття 17 жовтня. Нижче — повний
              розклад за днями із залами й переліком доповідей.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/venue" variant="outlineInverse">
                Як дістатися
              </Button>
              <Button to="/contacts" variant="quiet" className="text-paper/70 hover:text-carmine">
                Питання до секретаріату →
              </Button>
            </div>
          </div>

          <dl className="grid gap-px self-start border border-paper/20 bg-paper/20">
            {facts.map((fact) => (
              <div key={fact.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-ink px-5 py-4">
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

function StatePlate({ children }) {
  return (
    <PlateFrame figure="FIG. 07" label="Програма конгресу">
      <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {children}
      </p>
    </PlateFrame>
  )
}

// Розділ «Програма»: перемикач днів + розклад обраного дня + примітки.
export default function ProgramPage() {
  const { data: daysRaw, loading: daysLoading, error } = useCollection('programDays')
  const { data: sessionsRaw } = useCollection('programSessions')
  const { data: typesRaw } = useCollection('sessionTypes')
  const { data: notesRaw } = useCollection('programNotes')
  const { data: congress } = useSingleton('congress')
  const meta = congress ?? CONGRESS_SHELL

  const days = useMemo(() => byOrder(daysRaw), [daysRaw])
  const sessions = useMemo(() => byOrder(sessionsRaw), [sessionsRaw])
  const types = useMemo(() => byOrder(typesRaw), [typesRaw])
  const notes = useMemo(() => byOrder(notesRaw), [notesRaw])

  const [activeDayId, setActiveDayId] = useState('')

  // Перший день стає активним, щойно прийшли дані; вибір не «злітає» при
  // повторному рендері й скидається лише якщо такий день зник із програми.
  useEffect(() => {
    if (days.length === 0) return
    setActiveDayId((current) => (days.some((day) => day.id === current) ? current : days[0].id))
  }, [days])

  const counts = useMemo(() => {
    const map = {}
    sessions.forEach((item) => {
      map[item.dayId] = (map[item.dayId] ?? 0) + 1
    })
    return map
  }, [sessions])

  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0] ?? null
  const activeIndex = activeDay ? days.indexOf(activeDay) : 0
  const daySessions = activeDay ? sessions.filter((item) => item.dayId === activeDay.id) : []

  return (
    <>
      <ProgramMasthead meta={meta} dayCount={days.length} sessionCount={sessions.length} />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <SectionHeading
          eyebrow="Розклад засідань"
          figure="FIG. 07"
          title="Чотири дні за одним виміром"
          lead="Оберіть день, щоб побачити його програму: пленарні та секційні засідання, круглі столи, перерви й перелік доповідей кожного засідання."
        />

        <HairlineRule withDiamond tone="ink" className="my-8" />

        {days.length > 0 ? (
          <>
            <DaySelector
              days={days}
              activeId={activeDay?.id ?? ''}
              onChange={setActiveDayId}
              counts={counts}
              panelId={PANEL_ID}
            />

            {activeDay && (
              <div className="mt-10">
                <SessionListByDay
                  key={activeDay.id}
                  panelId={PANEL_ID}
                  day={activeDay}
                  numeral={String(activeDay.order ?? activeIndex + 1)}
                  sessions={daySessions}
                  types={types}
                />
              </div>
            )}
          </>
        ) : daysLoading ? (
          <StatePlate>Завантаження програми конгресу…</StatePlate>
        ) : error ? (
          <StatePlate>Не вдалося завантажити програму — спробуйте оновити сторінку</StatePlate>
        ) : (
          <StatePlate>Програма буде опублікована найближчим часом</StatePlate>
        )}
      </section>

      {notes.length > 0 && (
        <Reveal className="mx-auto max-w-6xl px-5 pb-16 md:px-6 md:pb-24">
          <ProgramNotes notes={notes} />
        </Reveal>
      )}

      <Reveal className="mx-auto max-w-6xl px-5 pb-20 md:px-6 md:pb-28">
        <PlateFrame tone="ink" figure="FIG. 10" label="Місце й формат участі">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-paper md:text-4xl">
                Місце проведення та онлайн-підключення
              </h2>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-paper/75">
                Конгрес відбувається у готелі «Супутник» на вул. Княгині Ольги, 116 у Львові — усі зали,
                реєстрація та дружня вечеря за однією адресою. Для онлайн-участі в розділі «Місце проведення»
                наведено посилання Google Meet для зали 1, зали 2 і зали 3.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button to="/venue" variant="outlineInverse">
                Місце проведення
              </Button>
              <Button to="/committee" variant="outlineInverse">
                Оргкомітет
              </Button>
            </div>
          </div>
        </PlateFrame>
      </Reveal>
    </>
  )
}
