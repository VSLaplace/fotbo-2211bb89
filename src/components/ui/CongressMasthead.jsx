import { cn } from '../../lib/cn.js'
import PlateLabel from './PlateLabel.jsx'

/**
 * «Мастика» внутрішньої сторінки: чорнильна смуга просто під шапкою сайту.
 * Номер таблиці атласу (FIG. NN) у правому куті, серіфний заголовок розділу,
 * лід і моно-таблиця фактів під ним. Декоративна велика цифра розділу справа —
 * мотив «oversized numeral anchor».
 *
 * Спільна для сторінок, побудованих на цьому етапі (оргкомітет, контакти):
 * тримає однаковий вертикальний ритм на всіх внутрішніх сторінках.
 */
export default function CongressMasthead({
  breadcrumb,
  figure,
  eyebrow,
  numeral,
  title,
  lead,
  meta = [],
  className,
}) {
  return (
    <header className={cn('relative overflow-hidden bg-ink text-paper', className)}>
      {numeral && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 right-3 hidden select-none font-serif text-[12rem] leading-none text-paper/10 lg:block"
        >
          {numeral}
        </span>
      )}

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-6 md:pb-16 md:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-paper/20 pb-3">
          <PlateLabel tone="inverse">{breadcrumb}</PlateLabel>
          <PlateLabel figure={figure} tone="inverse">
            {eyebrow}
          </PlateLabel>
        </div>

        <h1 className="mt-8 max-w-[26ch] font-serif text-4xl leading-[0.98] text-paper sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {lead && <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-paper/75">{lead}</p>}

        {meta.length > 0 && (
          <dl className="mt-10 grid gap-px border border-paper/20 bg-paper/20 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label} className="bg-ink px-4 py-4">
                <dt className="legend text-paper/45">{item.label}</dt>
                <dd className="mt-2.5 font-serif text-lg leading-snug text-paper">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
