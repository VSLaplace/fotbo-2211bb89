import { useMemo } from 'react'
import Button from '../../components/ui/Button.jsx'
import CongressMasthead from '../../components/ui/CongressMasthead.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import CommitteeGroups from './CommitteeGroups.jsx'
import ContactNote from './ContactNote.jsx'
import { byOrder } from '../../services/api.js'
import { useCollection, useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL } from '../../data/siteMeta.js'
import { formatUaRange, withCountUa } from '../../lib/format.js'

// Сторінка «Оргкомітет»: хто готує конгрес, які підрозділи за що відповідають
// і кому писати. Усі імена, ролі, афіліації та міста походять із колекції
// committee, тому оргкомітет редагує склад в одному місці.
export default function CommitteePage() {
  const { data: congress } = useSingleton('congress')
  const { data: declaredGroups, loading: groupsLoading } = useCollection('committeeGroups')
  const { data: members, loading: membersLoading } = useCollection('committee')

  const meta = congress ?? CONGRESS_SHELL
  const loading = groupsLoading || membersLoading
  const dateLabel = meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)

  const groups = useMemo(() => {
    const declared = byOrder(declaredGroups)
    const known = new Set(declared.map((group) => group.id))
    const extras = [...new Set(members.map((member) => member.group).filter((id) => id && !known.has(id)))].map(
      (id, index) => ({
        id,
        label: id === 'other' ? 'Інші учасники' : 'Додатковий підрозділ',
        note: '',
        order: 90 + index,
      }),
    )
    return [...declared, ...extras]
  }, [declaredGroups, members])

  const membersOf = (groupId) => members.filter((member) => (member.group ?? 'other') === groupId)
  const cities = useMemo(() => new Set(members.map((member) => member.city).filter(Boolean)), [members])

  const mastheadMeta = [
    members.length > 0 && {
      label: 'Склад комітетів',
      value: withCountUa(members.length, ['особа', 'особи', 'осіб']),
    },
    groups.length > 0 && {
      label: 'Підрозділи',
      value: withCountUa(groups.length, ['група', 'групи', 'груп']),
    },
    cities.size > 0 && { label: 'Міста учасників', value: withCountUa(cities.size, ['місто', 'міста', 'міст']) },
    { label: 'Дати конгресу', value: dateLabel },
    { label: 'Місце', value: `${meta.venueName}, ${meta.venueAddress}` },
  ].filter(Boolean)

  return (
    <>
      <CongressMasthead
        breadcrumb={`${meta.ordinal} Конгрес ${meta.societyAcronym} · ${meta.city}`}
        figure="FIG. 06"
        eyebrow="Комітети"
        numeral="06"
        title="Хто готує VIII Конгрес"
        lead="Конгрес готують голови конгресу, організаційний, програмний і координаційний комітети. Голова конгресу представляє товариство, програмний комітет формує наукову програму й модерує засідання, оргкомітет відповідає за підготовку та логістику, координаційний — за реєстрацію, онлайн-підключення і зв’язок з учасниками."
        meta={mastheadMeta}
      />

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        {loading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            Завантажуємо склад комітету…
          </p>
        ) : (
          <>
            {/* Покажчик підрозділів — сторінка «змісту» атласу з якірними посиланнями */}
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
                <div>
                  <PlateLabel figure="FIG. 06.0" tone="carmine">
                    Покажчик підрозділів
                  </PlateLabel>
                  <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
                    Підрозділи конгресу та їхні завдання
                  </h2>
                  <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                    Програмний комітет відбирає доповіді й модерує засідання, оргкомітет веде підготовку
                    й логістику залів, координаційний комітет працює з учасниками — реєстрацією,
                    онлайн-підключенням і документами БПР.
                  </p>
                  <div className="mt-7">
                    <Button to="/contacts" variant="outline">
                      Написати оргкомітету
                    </Button>
                  </div>
                </div>

                <PlateFrame figure="FIG. 06.1" label="Зміст">
                  <ul className="divide-y divide-rule">
                    {groups.map((group, index) => {
                      const count = membersOf(group.id).length
                      return (
                        <li key={group.id}>
                          <a
                            href={`#group-${group.id}`}
                            className="index-row group flex items-baseline gap-4 border-l-2 border-transparent px-4 py-4 hover:border-carmine hover:bg-plate-dim hover:translate-x-1 sm:px-5"
                          >
                            <span className="tnum legend text-ink-soft transition-colors group-hover:text-carmine">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-xl leading-snug text-ink">{group.label}</span>
                              {group.note && (
                                <span className="mt-1 block text-[14px] leading-relaxed text-ink-soft">
                                  {group.note}
                                </span>
                              )}
                            </span>
                            <span className="tnum shrink-0 font-mono text-sm text-teal transition-colors group-hover:text-ink">
                              {withCountUa(count, ['особа', 'особи', 'осіб'])}
                            </span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </PlateFrame>
              </div>
            </Reveal>

            <div className="mt-16 md:mt-20">
              <CommitteeGroups groups={groups} membersOf={membersOf} figure="FIG. 06" />
            </div>
          </>
        )}

        <Reveal className="mt-16 md:mt-20">
          <ContactNote />
        </Reveal>
      </div>
    </>
  )
}
