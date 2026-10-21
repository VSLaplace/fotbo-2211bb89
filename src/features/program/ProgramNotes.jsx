import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { byOrder } from '../../services/api.js'

/**
 * Примітки до програми — регламент, реєстрація, постери, публікація.
 * Рядки індексу: моно-номер, серіфний підзаголовок, текст пояснення.
 */
export default function ProgramNotes({ notes = [] }) {
  const rows = byOrder(notes)
  if (rows.length === 0) return null

  return (
    <PlateFrame figure="FIG. 09" label="Примітки до програми">
      <ol className="divide-y divide-rule border-y border-rule">
        {rows.map((note, index) => (
          <li
            key={note.id}
            className="grid gap-x-5 gap-y-2 border-l-2 border-transparent px-3 py-5 transition-colors duration-200 hover:border-carmine hover:bg-plate-dim sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:px-4"
          >
            <span className="tnum legend text-ink-soft">{String(index + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <PlateLabel tone="teal">{note.label}</PlateLabel>
              <p className="mt-3 max-w-[72ch] text-[17px] leading-relaxed text-ink">{note.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </PlateFrame>
  )
}
