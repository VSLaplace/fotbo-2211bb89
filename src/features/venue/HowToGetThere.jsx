import IndexRow from '../../components/ui/IndexRow.jsx'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'

// Як дістатися: потяг, літак, авто, міський транспорт — рядками індексу,
// з окремою чорнильною смугою для паркування.
export default function HowToGetThere({ transport = [], parkingNote }) {
  if (transport.length === 0 && !parkingNote) return null

  return (
    <PlateFrame figure="FIG. 14" label="Як дістатися">
      <p className="max-w-[68ch] text-lg leading-relaxed text-ink-soft">
        Місце проведення — готель «Супутник» на вул. Княгині Ольги, 116 у Львові. Це орієнтир
        для таксі й міського транспорту: зали засідань розташовані в конференц-зоні готелю,
        тож від входу до потрібної зали кілька хвилин.
      </p>

      <ol className="mt-8 divide-y divide-rule border-y border-rule">
        {transport.map((item, index) => (
          <li key={item.id}>
            <IndexRow
              index={String(index + 1).padStart(2, '0')}
              title={item.title}
              subtitle={item.detail}
              meta={item.mode}
            />
          </li>
        ))}
      </ol>

      {parkingNote && (
        <div className="mt-8 bg-ink px-5 py-6 sm:px-7 sm:py-7">
          <PlateLabel tone="inverse">Паркування</PlateLabel>
          <p className="mt-4 max-w-[72ch] text-[17px] leading-relaxed text-paper/85">{parkingNote}</p>
        </div>
      )}
    </PlateFrame>
  )
}
