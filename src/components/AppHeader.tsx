import { useEffect, useState } from 'react'
import type { BackgroundScene } from './AppBackground'

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

type AppHeaderProps = {
  backgroundScene: BackgroundScene
  soundEnabled: boolean
  effectsEnabled: boolean
  onCycleBackground: () => void
  onToggleSound: () => void
  onToggleEffects: () => void
  onNavigate: () => void
}

function ControlIcon({ name, enabled = true }: { name: 'scene' | 'sound' | 'effects'; enabled?: boolean }) {
  if (name === 'scene') return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="15" height="12" rx="1.5" /><path d="m5 12 3-3 2.2 2.2L13.5 8l2 2M6 17h8" /><circle cx="6" cy="6.5" r="1" /></svg>
  if (name === 'sound') return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3.5v11L6 12H3V8Z" /><path d={enabled ? 'M13 7c1.6 1.7 1.6 4.3 0 6M15.5 4.8c3 2.9 3 7.5 0 10.4' : 'm13.5 8 4 4m0-4-4 4'} /></svg>
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5v6M5.2 5.2a7 7 0 1 0 9.6 0" /><path d={enabled ? 'M7 15.4h6' : 'M7.2 14.7 12.8 9'} /></svg>
}

function ExperienceControls({
  className,
  backgroundScene,
  soundEnabled,
  effectsEnabled,
  onCycleBackground,
  onToggleSound,
  onToggleEffects,
}: Omit<AppHeaderProps, 'onNavigate'> & { className: string }) {
  return (
    <div className={className} role="group" aria-label="Experience controls">
      <button className="app-header__system-control is-active" type="button" onClick={onCycleBackground} aria-label={`Background: ${backgroundScene}. Switch background`}>
        <ControlIcon name="scene" />
        <span><small>Scene</small><strong>{backgroundScene}</strong></span>
        <i aria-hidden="true" />
      </button>
      <button className={`app-header__system-control${soundEnabled ? ' is-active' : ''}`} type="button" onClick={onToggleSound} aria-pressed={soundEnabled} aria-label={`Interface sound ${soundEnabled ? 'on' : 'off'}`}>
        <ControlIcon name="sound" enabled={soundEnabled} />
        <span><small>Sound</small><strong>{soundEnabled ? 'on' : 'off'}</strong></span>
        <i aria-hidden="true" />
      </button>
      <button className={`app-header__system-control${effectsEnabled ? ' is-active' : ''}`} type="button" onClick={onToggleEffects} aria-pressed={effectsEnabled} aria-label={`Visual effects ${effectsEnabled ? 'on' : 'off'}`}>
        <ControlIcon name="effects" enabled={effectsEnabled} />
        <span><small>Effects</small><strong>{effectsEnabled ? 'full' : 'low'}</strong></span>
        <i aria-hidden="true" />
      </button>
    </div>
  )
}

export function AppHeader({
  backgroundScene,
  soundEnabled,
  effectsEnabled,
  onCycleBackground,
  onToggleSound,
  onToggleEffects,
  onNavigate,
}: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('#work')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const selectNavigation = (href: string, closeMenu = false) => {
    setActiveNav(href)
    if (closeMenu) setMenuOpen(false)
    onNavigate()
  }

  return (
    <header className={`app-header${menuOpen ? ' is-open' : ''}`}>
      <div className="app-header__bar">
        <span className="app-header__conduit app-header__conduit--left" aria-hidden="true" />
        <span className="app-header__conduit app-header__conduit--right" aria-hidden="true" />
        <span className="app-header__reactor-line" aria-hidden="true" />
        <a className="app-header__brand" href="#top" aria-label="Daniel Matei, home" onClick={onNavigate}>
          <span className="app-header__mark" aria-hidden="true"><img src="/brand/logo.png" alt="" /></span>
          <span className="app-header__identity">
            <strong>DANIELMATEI</strong>
            <small><i />Engineering digital worlds</small>
          </span>
        </a>

        <a className="app-header__mobile-brand" href="#top" aria-label="Daniel Matei, home" onClick={onNavigate}>
          <span className="app-header__mark" aria-hidden="true"><img src="/brand/logo.png" alt="" /></span>
          <span className="app-header__identity">
            <strong>DANIELMATEI</strong>
            <small><i />Engineering digital worlds</small>
          </span>
        </a>

        <nav className="app-header__nav" aria-label="Primary navigation">
          {navigation.map((item, index) => (
            <a key={item.href} href={item.href} className={activeNav === item.href ? 'is-active' : ''} aria-current={activeNav === item.href ? 'page' : undefined} onClick={() => selectNavigation(item.href)}>
              <span className="app-header__nav-index">0{index + 1}</span>
              <NavIcon name={item.icon} />
              <span className="app-header__nav-copy"><strong>{item.label}</strong><small>{item.meta}</small></span>
            </a>
          ))}
        </nav>

        <div className="app-header__actions">
          <ExperienceControls
            className="app-header__system-controls"
            backgroundScene={backgroundScene}
            soundEnabled={soundEnabled}
            effectsEnabled={effectsEnabled}
            onCycleBackground={onCycleBackground}
            onToggleSound={onToggleSound}
            onToggleEffects={onToggleEffects}
          />
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
            <a key={item.href} href={item.href} className={activeNav === item.href ? 'is-active' : ''} aria-current={activeNav === item.href ? 'page' : undefined} onClick={() => selectNavigation(item.href, true)}>
              <span>0{index + 1}</span>
              <NavIcon name={item.icon} />
              <strong>{item.label}</strong>
              <small>{item.meta}</small>
            </a>
          ))}
        </nav>
        <ExperienceControls
          className="app-header__mobile-system-controls"
          backgroundScene={backgroundScene}
          soundEnabled={soundEnabled}
          effectsEnabled={effectsEnabled}
          onCycleBackground={onCycleBackground}
          onToggleSound={onToggleSound}
          onToggleEffects={onToggleEffects}
        />
      </div>
    </header>
  )
}
