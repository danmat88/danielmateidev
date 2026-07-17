import { useEffect, useState } from 'react'

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'About', href: '#about' },
]

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

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

        <nav className="app-header__nav" aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
        </nav>

        <div className="app-header__actions">
          <span className="app-header__availability"><i />Open channel</span>
          <a className="app-header__contact" href="mailto:hello@danielmatei.dev">
            Contact
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
          </a>
          <button
            className="app-header__menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div className="app-header__mobile-panel">
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>
              <strong>{item.label}</strong>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
            </a>
          ))}
        </nav>
        <a className="app-header__mobile-contact" href="mailto:hello@danielmatei.dev">Contact</a>
      </div>
    </header>
  )
}
