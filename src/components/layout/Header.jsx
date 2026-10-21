import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn.js'
import PlateLabel from '../ui/PlateLabel.jsx'
import { useSingleton } from '../../hooks/useCollection.js'
import { CONGRESS_SHELL, NAV_LINKS } from '../../data/siteMeta.js'
import { formatUaRange } from '../../lib/format.js'

export default function Header() {
  const { data: congress } = useSingleton('congress')
  const meta = congress ?? CONGRESS_SHELL
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const panelId = useId()

  const dateLabel = meta.dateRangeLabel || formatUaRange(meta.dates?.start, meta.dates?.end)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-ink text-paper">
      <div className="hidden border-b border-paper/15 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-2 md:px-6">
          <PlateLabel tone="inverse">{`${dateLabel} · ${meta.city}, ${meta.country}`}</PlateLabel>
          <span className="hidden lg:block">
            <PlateLabel tone="inverse">{meta.format ?? CONGRESS_SHELL.format}</PlateLabel>
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-6 md:py-4">
        <Link
          to="/"
          aria-label={`На головну — ${meta.fullTitle || meta.title}`}
          className="group flex items-center gap-3 md:gap-4"
        >
          <span
            aria-hidden="true"
            className="font-serif text-3xl leading-none text-paper transition-colors duration-200 group-hover:text-carmine md:text-4xl"
          >
            {meta.ordinal}
          </span>
          <span aria-hidden="true" className="hidden h-10 w-px bg-paper/25 sm:block" />
          <span className="flex min-w-0 flex-col">
            <span className="font-serif text-[15px] leading-tight text-paper sm:text-base">
              {`Конгрес ${meta.societyAcronym}`}
            </span>
            <span className="mt-1 hidden max-w-[46ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-paper/55 sm:block">
              {meta.societyName}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav aria-label="Основна навігація">
            <ul className="flex items-center divide-x divide-paper/20">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'legend block border-b-2 px-3.5 py-2 transition-colors duration-200',
                        isActive
                          ? 'border-carmine text-paper'
                          : 'border-transparent text-paper/60 hover:border-paper/40 hover:text-paper',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="https://drive.google.com/drive/folders/1HPXDza0LDMehH_bKWNvmu25eRr0Fwxbr?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="legend border border-paper/40 px-3.5 py-2 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink"
          >
            Сертифікати
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="legend flex items-center gap-2.5 border border-paper/30 px-3 py-2 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink lg:hidden"
        >
          <span className="flex flex-col gap-[3px]" aria-hidden="true">
            <span className={cn('h-px w-4 bg-current transition-transform duration-200', open && 'translate-y-1 rotate-45')} />
            <span className={cn('h-px w-4 bg-current transition-opacity duration-200', open && 'opacity-0')} />
            <span className={cn('h-px w-4 bg-current transition-transform duration-200', open && '-translate-y-1 -rotate-45')} />
          </span>
          {open ? 'Закрити' : 'Розділи'}
        </button>
      </div>

      <div id={panelId} hidden={!open} className="border-t border-paper/15 bg-ink lg:hidden">
        <nav aria-label="Мобільна навігація" className="mx-auto max-w-6xl px-5 py-3 md:px-6">
          <ul className="divide-y divide-paper/15">
            {NAV_LINKS.map((item, i) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-baseline gap-4 py-3.5 transition-colors duration-200',
                      isActive ? 'text-paper' : 'text-paper/70 hover:text-paper',
                    )
                  }
                >
                  <span className="tnum legend text-paper/40 group-hover:text-carmine">{`0${i + 1}`}</span>
                  <span className="font-serif text-xl">{item.label}</span>
                  <span aria-hidden="true" className="ml-auto font-mono text-xs text-paper/30">
                    →
                  </span>
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://drive.google.com/drive/folders/1HPXDza0LDMehH_bKWNvmu25eRr0Fwxbr?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-4 py-3.5 text-paper/75 transition-colors duration-200 hover:text-paper"
              >
                <span className="tnum legend text-paper/40 group-hover:text-carmine">→</span>
                <span className="font-serif text-xl">Сертифікати</span>
                <span aria-hidden="true" className="ml-auto font-mono text-xs text-paper/30">
                  ↗
                </span>
              </a>
            </li>
          </ul>
          <p className="mt-3 border-t border-paper/15 pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-paper/50">
            {`${dateLabel} · ${meta.city} · ${meta.venueAddress}`}
          </p>
        </nav>
      </div>
    </header>
  )
}
