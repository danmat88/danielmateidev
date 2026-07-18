import { useEffect, useState } from 'react'

const navigation = [
  { label: 'Work', meta: 'Projects', href: '#work', icon: 'work' },
  { label: 'Capabilities', meta: 'Systems', href: '#capabilities', icon: 'capabilities' },
  { label: 'About', meta: 'Profile', href: '#about', icon: 'about' },
]

function NavIcon({ name }: { name: string }) {
  if (name === 'work') return <svg viewBox="0 0 18 18" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="10" y="3" width="5" height="5" rx="1" /><rect x="3" y="10" width="5" height="5" rx="1" /><path d="M10 12.5h5M12.5 10v5" /></svg>
  if (name === 'capabilities') return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="m10.2 2.5-6 7.2h4.5l-.9 5.8 6-7.2H9.3l.9-5.8Z" /></svg>
  return <svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="6" r="3" /><path d="M3.5 15c.7-3 2.5-4.5 5.5-4.5s4.8 1.5 5.5 4.5" /></svg>
}

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('#work')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className={`app-header${menuOpen ? ' is-open' : ''}`}>
      <div className="app-header__bar">
        <span className="app-header__conduit app-header__conduit--left" aria-hidden="true" />
        <span className="app-header__conduit app-header__conduit--right" aria-hidden="true" />
        <span className="app-header__reactor-line" aria-hidden="true" />
        <a className="app-header__brand" href="#top" aria-label="Daniel Matei, home">
          <span className="app-header__mark" aria-hidden="true">
            <img src="/brand/logo.png" alt="" />
          </span>
          <span className="app-header__identity">
            <strong>DANIELMATEI</strong>
            <small><i />Engineering digital worlds</small>
          </span>
        </a>

        <a className="app-header__mobile-brand" href="#top" aria-label="Daniel Matei, home">
          <span className="app-header__mark" aria-hidden="true">
            <img src="/brand/logo.png" alt="" />
          </span>
          <span className="app-header__identity">
            <strong>DANIELMATEI</strong>
            <small><i />Engineering digital worlds</small>
          </span>
        </a>

        <nav className="app-header__nav" aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} className={activeNav === item.href ? 'is-active' : ''} aria-current={activeNav === item.href ? 'page' : undefined} onClick={() => setActiveNav(item.href)}>
              <span className="app-header__nav-index">0{index + 1}</span>
              <NavIcon name={item.icon} />
              <span className="app-header__nav-copy"><strong>{item.label}</strong><small>{item.meta}</small></span>
            </a>
          ))}
        </nav>

        <div className="app-header__actions">
          <span className="app-header__availability"><i />Available for projects</span>
          <a className="app-header__contact" href="mailto:hello@danielmatei.dev">
            <span>Let’s talk</span>
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3.5 9h10M9.5 5l4 4-4 4" /></svg>
          </a>
        </div>

        <button
          className="app-header__mobile-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </div>

      <div className="app-header__mobile-panel" id="mobile-navigation">
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} className={activeNav === item.href ? 'is-active' : ''} aria-current={activeNav === item.href ? 'page' : undefined} onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}>
              <span>0{index + 1}</span>
              <NavIcon name={item.icon} />
              <strong>{item.label}</strong>
              <small>{item.meta}</small>
            </a>
          ))}
        </nav>
        <a className="app-header__mobile-contact" href="mailto:hello@danielmatei.dev">Contact</a>
      </div>
    </header>
  )
}
