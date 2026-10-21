import IndexRow from '../../components/ui/IndexRow.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import { withCountUa } from '../../lib/format.js'

// Три підрозділи комітету як три «таблиці» атласу. Лівий рейл тримає
// велику серіфну цифру — якір колонки; праворуч — індекс-список членів
// (номер, імʼя, роль, афіліація, місто).

const pad2 = (value) => String(value).padStart(2, '0')

export default function CommitteeGroups({ groups = [], membersOf, figure }) {
  return (
    <div className="space-y-12 md:space-y-16">
      {groups.map((group, index) => {
        const members = membersOf(group.id)
        const ordinal = pad2(index + 1)

        return (
          <Reveal
            key={group.id}
            as="section"
            id={`group-${group.id}`}
            delay={index * 0.08}
            className="scroll-mt-32 border-t border-rule pt-10 md:grid md:grid-cols-[minmax(0,2.5fr)_minmax(0,9.5fr)] md:gap-10 md:pt-14"
          >
            <div className="md:sticky md:top-32 md:self-start">
              <span
                aria-hidden="true"
                className="tnum block font-serif text-6xl leading-none text-carmine/35 md:text-7xl"
              >
                {ordinal}
              </span>
              <h2 className="mt-5 font-serif text-2xl leading-tight text-ink md:text-3xl">{group.label}</h2>
              {group.note && (
                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">{group.note}</p>
              )}
              <PlateLabel tone="teal" className="mt-5 block">
                {withCountUa(members.length, ['особа', 'особи', 'осіб'])}
              </PlateLabel>
            </div>

            <PlateFrame figure={`${figure}.${index + 1}`} label={group.label} className="mt-7 md:mt-0">
              {members.length === 0 ? (
                <p className="py-6 text-[15px] leading-relaxed text-ink-soft">
                  Склад цього підрозділу оргкомітет оприлюднить додатково.
                </p>
              ) : (
                <ul className="divide-y divide-rule">
                  {members.map((member, memberIndex) => (
                    <li key={member.id}>
                      <IndexRow
                        index={pad2(memberIndex + 1)}
                        title={member.name}
                        subtitle={member.role}
                        note={member.affiliation}
                        meta={member.city}
                        accent={member.order === 1}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </PlateFrame>
          </Reveal>
        )
      })}
    </div>
  )
}
