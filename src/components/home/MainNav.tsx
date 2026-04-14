import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logoImage from '../../assets/ComES Logo.png'

const menuItems = [
  { label: 'Home', to: '/', hasChevron: false },
  { label: 'About', to: '/about', hasChevron: false },
  { label: 'Subgroups', to: '/subgroups', hasChevron: true },
  { label: 'Events', to: '/events', hasChevron: false },
  { label: 'Projects', to: '/projects', hasChevron: false },
  { label: 'Team', to: '/team', hasChevron: false },
  { label: 'Contact', to: '/contact', hasChevron: false },
] as const

const MainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const baseLinkClass =
    "relative inline-flex items-center gap-1 rounded-md py-2 text-[13.6px] leading-[14px] font-normal text-white no-underline [font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full focus-visible:outline-none"

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 z-50 w-full flex justify-center bg-black/10 px-16 py-1 backdrop-blur-[10px] max-[900px]:px-3">
      <nav
        className="relative flex w-full max-w-[1440px] items-center justify-between gap-5 overflow-hidden rounded-lg px-4 py-2 max-[900px]:items-start max-[900px]:gap-3 max-[900px]:overflow-visible max-[900px]:px-[10px]"
        aria-label="Primary"
      >
        <div className="flex min-w-0 flex-1 items-center gap-7 max-[900px]:w-full max-[900px]:justify-between max-[900px]:gap-2">
          <NavLink
            className="inline-flex h-8 w-[78px] flex-none items-center"
            to="/"
            aria-label="ComES home"
            onClick={closeMenu}
          >
            <img src={logoImage} alt="ComES" className="block h-auto w-full" />
          </NavLink>

          <button
            type="button"
            className="hidden h-10 w-10 cursor-pointer flex-col items-center justify-center p-0 transition-transform hover:scale-105 active:scale-95 max-[900px]:flex"
            aria-expanded={isMenuOpen}
            aria-controls="main-nav-links"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={`block h-[2px] w-6 origin-center rounded-full bg-white transition-transform duration-300 ${isMenuOpen ? 'translate-y-[6px] rotate-45' : '-translate-y-1.5'}`}></span>
            <span className={`block h-[2px] w-6 origin-center rounded-full bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block h-[2px] w-6 origin-center rounded-full bg-white transition-transform duration-300 ${isMenuOpen ? '-translate-y-[6px] -rotate-45' : 'translate-y-1.5'}`}></span>
            <span className="sr-only absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
              Toggle navigation
            </span>
          </button>

          <ul
            className={
              isMenuOpen
                ? 'm-0 list-none items-center gap-6 whitespace-nowrap py-2 min-[901px]:flex max-[900px]:order-3 max-[900px]:mt-2.5 max-[900px]:flex max-[900px]:w-full max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-1 max-[900px]:rounded-lg max-[900px]:border max-[900px]:border-white/15 max-[900px]:bg-[rgba(8,10,28,0.78)] max-[900px]:p-2.5'
                : 'm-0 list-none items-center gap-6 whitespace-nowrap py-2 min-[901px]:flex max-[900px]:order-3 max-[900px]:mt-2.5 max-[900px]:hidden max-[900px]:w-full max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-1 max-[900px]:rounded-lg max-[900px]:border max-[900px]:border-white/15 max-[900px]:bg-[rgba(8,10,28,0.78)] max-[900px]:p-2.5'
            }
            id="main-nav-links"
          >
            {menuItems.map((item) => {
              const hasChevron = item.hasChevron

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${baseLinkClass} ${hasChevron ? 'items-end max-[900px]:items-center max-[900px]:justify-between max-[900px]:px-2.5' : 'justify-center max-[900px]:w-full max-[900px]:justify-between max-[900px]:px-2.5'} ${isActive ? 'font-bold after:w-0' : ''}`
                    }
                    end={item.to === '/'}
                    onClick={closeMenu}
                  >
                    <span>{item.label}</span>
                    {hasChevron ? (
                      <svg className="ml-1 h-3.5 w-3.5 text-white/80 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    ) : null}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>

        <NavLink
          to="/join-us"
          className={({ isActive }) =>
            `inline-flex flex-none items-center justify-center gap-1 rounded bg-indigo-600 px-4 py-3 text-[14px] leading-[14px] font-normal text-white no-underline [font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] transition duration-200 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)] focus-visible:outline-none ${isActive ? 'font-bold' : ''} max-[900px]:hidden`
          }
          onClick={closeMenu}
        >
          <span>Join Us</span>
          <svg className="h-4 w-4 text-white/80 group-hover:text-white transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
        </NavLink>
      </nav>
    </header>
  )
}

export default MainNav
