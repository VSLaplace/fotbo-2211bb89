import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'

/**
 * Зали конгресу та онлайн-участь: кожна зала з програми має власне посилання
 * Google Meet, тому учасник може долучитися до потрібного засідання згідно
 * з розкладом. Дані — з колекції venue (db.json), без жодних зовнішніх сервісів.
 */
export default function HallsAndOnline({ halls = [] }) {
  if (halls.length === 0) return null

  const online = halls.filter((hall) => hall.online)

  return (
    <PlateFrame figure="FIG. 13" label="Зали та онлайн-участь">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div className="min-w-0">
          <PlateLabel tone="teal">Зали засідань</PlateLabel>
          <ol className="mt-5 divide-y divide-rule border-y border-rule">
            {halls.map((hall, index) => (
              <li
                key={hall.id}
                className="index-row grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-l-2 border-transparent px-3 py-4 hover:translate-x-1 hover:border-carmine hover:bg-plate-dim sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:px-4"
              >
                <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block font-serif text-xl leading-snug text-ink md:text-2xl">{hall.name}</span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-soft">{hall.location}</span>
                  {hall.online && (
                    <a
                      href={hall.online}
                      target="_blank"
                      rel="noreferrer"
                      className="link-rule mt-3 inline-block font-mono text-[13px] tracking-[0.06em] text-teal hover:text-carmine hover:link-rule-on"
                    >
                      {hall.online.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0">
          <PlateLabel tone="carmine">Онлайн-участь</PlateLabel>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Конгрес проводиться у змішаному форматі: засідання в залах транслюються в Google Meet.
            Посилання відповідає залі з розкладу — оберіть потрібне засідання в розділі «Програма»
            і долучіться за посиланням цієї зали.
          </p>

          {online.length > 0 && (
            <ul className="mt-7 border-y border-rule">
              {online.map((hall) => (
                <li
                  key={hall.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-rule py-3.5 last:border-b-0"
                >
                  <span className="font-serif text-lg leading-snug text-ink">{hall.name}</span>
                  <a
                    href={hall.online}
                    target="_blank"
                    rel="noreferrer"
                    className="link-rule font-mono text-[11px] uppercase tracking-[0.16em] text-teal hover:text-carmine hover:link-rule-on"
                  >
                    Долучитися →
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 border-l-2 border-carmine pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ink-soft">
            Час засідань — за київським часом. Посилання діють у дні відповідних засідань.
          </p>
        </div>
      </div>
    </PlateFrame>
  )
}
