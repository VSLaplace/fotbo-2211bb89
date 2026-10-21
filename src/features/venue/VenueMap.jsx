import { useState } from 'react'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import { cn } from '../../lib/cn.js'

/**
 * Схематичний план корпусу — «таблиця-карта»: літеровані клітинки A–F, як
 * позначки на анатомічному препараті, і легенда під ними. Клікабельність
 * справжня: позначка вибирається мишею, Enter/Space і стрілками зостаються
 * звичайною поведінкою кнопок.
 */
export default function VenueMap({ venue }) {
  const scheme = venue?.mapScheme ?? []
  const [selectedId, setSelectedId] = useState(scheme[0]?.id ?? '')

  if (!venue || scheme.length === 0) return null

  const selected = scheme.find((node) => node.id === selectedId) ?? scheme[0]

  return (
    <PlateFrame figure="FIG. 15" label="Схема розташування залів">
      <div className="bg-ink px-4 py-6 sm:px-7 sm:py-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <PlateLabel tone="inverse">Позначки на схемі</PlateLabel>
          <PlateLabel tone="inverse">Не в масштабі</PlateLabel>
        </div>

        <div className="grid grid-cols-3 gap-px border border-paper/20 bg-paper/20 sm:grid-cols-6">
          {scheme.map((node) => {
            const active = node.id === selected?.id
            return (
              <button
                key={node.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(node.id)}
                className={cn(
                  'flex min-h-[7rem] flex-col items-center justify-center gap-3 px-3 py-5 transition-colors duration-200',
                  active ? 'bg-carmine text-paper' : 'bg-ink text-paper hover:bg-plate-dim hover:text-ink',
                )}
              >
                <span className="font-serif text-3xl leading-none md:text-4xl">{node.id}</span>
                <span
                  className={cn(
                    'legend text-center leading-relaxed',
                    active ? 'text-paper' : 'text-paper/55',
                  )}
                >
                  {node.label}
                </span>
              </button>
            )
          })}
        </div>

        {venue.mapNote && (
          <p className="mt-6 max-w-[72ch] font-mono text-xs leading-relaxed text-paper/70">{venue.mapNote}</p>
        )}
      </div>

      <div className="mt-8" aria-live="polite">
        <PlateLabel tone="carmine">Обрана позначка</PlateLabel>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-y border-rule py-5">
          <span aria-hidden="true" className="font-serif text-3xl leading-none text-carmine">
            {selected.id}
          </span>
          <span className="font-serif text-xl text-ink md:text-2xl">{selected.label}</span>
          <span className="font-mono text-xs leading-relaxed text-ink-soft">{selected.detail}</span>
        </div>
      </div>
    </PlateFrame>
  )
}
