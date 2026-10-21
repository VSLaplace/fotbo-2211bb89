import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { byOrder } from '../../services/api.js'

/**
 * Перебування учасників: місце проведення, реєстрація та вечірня частина
 * за однією адресою. Рядок — назва, час або позначка локації, пояснення
 * оргкомітету. Дані з колекції accommodation (db.json).
 */
export default function AccommodationList({ items = [] }) {
  const rows = byOrder(items)
  if (rows.length === 0) return null

  return (
    <PlateFrame figure="FIG. 16" label="Перебування учасників">
      <p className="max-w-[68ch] text-lg leading-relaxed text-ink-soft">
        Конгрес відбувається в готелі «Супутник», тож зали засідань, стійка реєстрації та дружня
        вечеря розташовані за однією адресою — вул. Княгині Ольги, 116. Питання розселення та
        зручностей уточнюйте в координаційного комітету через форму на сторінці «Контакти».
      </p>

      <ul className="mt-8 divide-y divide-rule border-y border-rule">
        {rows.map((item, index) => (
          <li
            key={item.id}
            className="grid gap-x-5 gap-y-3 border-l-2 border-transparent px-3 py-5 transition-colors duration-200 hover:border-carmine hover:bg-plate-dim sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:px-4 lg:grid-cols-[3.25rem_minmax(0,1fr)_14rem]"
          >
            <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>

            <div className="min-w-0">
              <h3 className="font-serif text-xl leading-snug text-ink md:text-2xl">{item.name}</h3>
              <PlateLabel tone="teal" className="mt-3">
                {item.category}
              </PlateLabel>
              {item.note && (
                <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">{item.note}</p>
              )}
            </div>

            <div className="min-w-0 lg:text-right">
              <PlateLabel>Локація</PlateLabel>
              <p className="mt-2 font-mono text-xs leading-relaxed text-ink">{item.distanceNote}</p>
            </div>
          </li>
        ))}
      </ul>
    </PlateFrame>
  )
}
