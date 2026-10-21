import { Link } from 'react-router-dom'
import PlateFrame from '../../components/ui/PlateFrame.jsx'
import PlateLabel from '../../components/ui/PlateLabel.jsx'
import HairlineRule from '../../components/ui/HairlineRule.jsx'
import Button from '../../components/ui/Button.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL, NAV_LINKS } from '../../data/siteMeta.js'
import { formatUaRange } from '../../lib/format.js'

// Сторінка-виняток у стилі атласу: «таблицю не знайдено».
// Замість порожнього екрана — номер відсутньої таблиці та повний покажчик
// розділів конгресу, щоб читач одразу знайшов потрібний аркуш.

const SECTIONS = NAV_LINKS.map((item, index) => ({
  to: item.to,
  label: item.label,
  number: `0${index + 1}`,
}))

export default function NotFoundPage() {
  const { data: congress } = useSingleton('congress')
  const meta = congress ?? CONGRESS_SHELL
  const dateLabel = meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 md:px-6">
      <PlateFrame figure="FIG. 000" label="ТАБЛИЦЮ НЕ ЗНАЙДЕНО">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7rem)_1fr] lg:gap-14">
          {/* Велика серіфна цифра — анкер колонки, як номер аркуша в атласі */}
          <div className="lg:border-r lg:border-rule lg:pr-6">
            <p aria-hidden="true" className="tnum font-serif text-6xl leading-none text-carmine sm:text-7xl">
              404
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ink-soft">
              Аркуш
              <br />
              відсутній
            </p>
          </div>

          <div>
            <h1 className="max-w-[26ch] font-serif text-4xl leading-[1.08] text-ink sm:text-5xl">
              Такої таблиці в атласі конгресу немає
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-text">
              Сторінка, на яку ви натрапили, не входить до видання — можливо, адресу було змінено або в ній
              є друкарська помилка. Скористайтеся покажчиком розділів нижче: програма, місце проведення,
              оргкомітет і контакти оргкомітету на місці.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/" variant="accent">
                На головну сторінку
              </Button>
              <Button to="/program" variant="outline">
                Перейти до програми
              </Button>
            </div>

            <HairlineRule className="mt-10" />

            {/* Покажчик розділів — мотив «Index List» */}
            <nav aria-label="Покажчик розділів сайту" className="mt-6">
              <PlateLabel figure="INDEX" tone="teal">
                Розділи видання
              </PlateLabel>
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {SECTIONS.map((section) => (
                  <li key={section.to}>
                    <Link
                      to={section.to}
                      className="group flex items-baseline gap-5 py-3.5 transition-colors duration-200"
                    >
                      <span className="tnum legend w-8 shrink-0 text-ink-soft transition-colors duration-200 group-hover:text-carmine">
                        {section.number}
                      </span>
                      <span className="font-serif text-xl text-ink transition-colors duration-200 group-hover:text-carmine sm:text-2xl">
                        {section.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto font-mono text-xs text-ink-soft opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </PlateFrame>

      <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
        <span>{meta.fullTitle || meta.title}</span>
        <span aria-hidden="true" className="text-rule">
          ·
        </span>
        <span>{`${dateLabel} · ${meta.city}`}</span>
      </p>
    </div>
  )
}
