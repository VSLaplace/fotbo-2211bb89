import Button from '../../components/ui/Button.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { byOrder } from '../../services/api.js'
import { useCollection } from '../../hooks/useCollection.js'

// Контактна нота в кінці сторінки комітетів: як долучитися онлайн, де
// відбуваються засідання і куди писати. Дані — та сама колекція contacts,
// тому адреси й посилання ніколи не розійдуться зі сторінкою «Контакти».

export default function ContactNote() {
  const { data: contacts } = useCollection('contacts')
  const ordered = byOrder(contacts)
  const links = ordered.filter((contact) => contact.type === 'link')
  const address = ordered.find((contact) => contact.type === 'address')

  return (
    <PlateFrame tone="ink" figure="FIG. 06.4" label="Зв’язок з оргкомітетом" bodyClassName="px-5 sm:px-7">
      <div className="grid gap-9 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="font-serif text-3xl leading-tight text-paper md:text-4xl">
            Засідання — у Львові, участь — і онлайн
          </h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-paper/75">
            Очна частина конгресу відбувається в готелі «Супутник», а засідання зали 1, зали 2 і зали 3
            транслюються в Google Meet. Питання участі, підключення та документів БПР приймає
            координаційний комітет.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button to="/contacts" variant="outlineInverse">
              Форма запиту
            </Button>
            <Button to="/program" variant="quiet" className="text-paper/70 hover:text-carmine">
              Програма конгресу →
            </Button>
          </div>
        </div>

        <div>
          {address && (
            <div className="border-b border-paper/20 pb-5">
              <PlateLabel tone="inverse" className="block">
                {address.label}
              </PlateLabel>
              <p className="mt-3 font-serif text-xl leading-snug text-paper">{address.value}</p>
              {address.note && (
                <p className="mt-2 max-w-[54ch] text-[14px] leading-relaxed text-paper/60">{address.note}</p>
              )}
            </div>
          )}

          {links.length > 0 && (
            <>
              <PlateLabel tone="inverse" className="mt-6 block">
                Онлайн-зали
              </PlateLabel>
              <ul className="mt-4 divide-y divide-paper/15 border-t border-paper/20">
                {links.map((link) => (
                  <li key={link.id} className="py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">{link.label}</p>
                    <a
                      href={link.value}
                      target="_blank"
                      rel="noreferrer"
                      className="link-rule mt-2 inline-block font-mono text-[15px] text-paper transition-colors duration-200 hover:text-carmine hover:link-rule-on"
                    >
                      {link.value.replace(/^https?:\/\//, '')}
                    </a>
                    {link.note && (
                      <p className="mt-2 max-w-[54ch] text-[14px] leading-relaxed text-paper/60">{link.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </PlateFrame>
  )
}
