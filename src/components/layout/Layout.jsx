import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

// The site shell, wrapped around every public route by src/app/router.jsx.
// It places the active page with <Outlet />, so `children` are ignored — the
// console.error exists because React treats that misuse as legal and the page
// would otherwise just go silently blank.
export default function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  if (children) {
    console.error('[FOTBO_CONTRACT] A page rendered <Layout>. router.jsx already wraps every route in it.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-carmine focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-carmine"
      >
        Перейти до вмісту
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
