import { useEffect, useState } from 'react'
import type { BackgroundScene } from './AppBackground'

export type ConsoleMode = 'create' | 'components' | 'studio'

type ConsoleHeaderProps = {
  mode: ConsoleMode
  missionStatus?: string
  sessionCount: number
  backgroundScene: BackgroundScene
  soundEnabled: boolean
  effectsEnabled: boolean
  onModeChange: (mode: ConsoleMode) => void
  onOpenSession: () => void
  onCycleBackground: () => void
  onToggleSound: () => void
  onToggleEffects: () => void
}

const navigation: Array<{ id: ConsoleMode; label: string; meta: string }> = [
  { id: 'create', label: 'Create', meta: 'Custom products' },
  { id: 'components', label: 'Components', meta: 'Ready-made UI' },
  { id: 'studio', label: 'Studio', meta: 'Method & contact' },
]

function HeaderGlyph({ name }: { name: ConsoleMode | 'session' | 'settings' }) {
  if (name === 'create') return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5v15M2.5 10h15" /><circle cx="10" cy="10" r="4" /></svg>
  if (name === 'components') return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2.5 6.5 3.7v7.6L10 17.5l-6.5-3.7V6.2L10 2.5Z" /><path d="m3.8 6.4 6.2 3.5 6.2-3.5M10 10v7" /></svg>
  if (name === 'studio') return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 16.5h12M5.5 16.5V9l4.5-5 4.5 5v7.5M8 16.5v-5h4v5" /></svg>
  if (name === 'session') return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.5h12v13H4zM7 7h6M7 10h6M7 13h3" /></svg>
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3" /><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" /></svg>
}

export function ConsoleHeader({
  mode,
  missionStatus,
  sessionCount,
  backgroundScene,
  soundEnabled,
  effectsEnabled,
  onModeChange,
  onOpenSession,
  onCycleBackground,
  onToggleSound,
  onToggleEffects,
}: ConsoleHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSettingsOpen(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const chooseMode = (next: ConsoleMode) => {
    onModeChange(next)
    setMenuOpen(false)
  }

  return (
    <header className={`console-header${menuOpen ? ' is-open' : ''}`}>
      <div className="console-header__energy" aria-hidden="true" />
      <button className="console-header__brand" type="button" onClick={() => chooseMode('create')} aria-label="Daniel Matei creation console, return to Create">
        <span className="console-header__brand-mark"><img src="/brand/logo.png" alt="" /></span>
        <span><strong>DANIELMATEI</strong><small><i />CREATION CONSOLE</small></span>
      </button>

      <nav className="console-header__nav" aria-label="Console worlds">
        {navigation.map((item, index) => (
          <button key={item.id} type="button" className={mode === item.id ? 'is-active' : ''} onClick={() => chooseMode(item.id)} aria-current={mode === item.id ? 'page' : undefined}>
            <span>0{index + 1}</span>
            <HeaderGlyph name={item.id} />
            <b>{item.label}</b>
            <small>{item.id === 'create' && missionStatus ? missionStatus : item.meta}</small>
          </button>
        ))}
      </nav>

      <div className="console-header__utilities">
        <button type="button" className="console-header__utility" onClick={onOpenSession}>
          <HeaderGlyph name="session" />
          <span><small>Session</small><b>{sessionCount ? `${sessionCount} saved` : 'No saves'}</b></span>
          {sessionCount > 0 && <i>{sessionCount}</i>}
        </button>
        <div className="console-header__settings-wrap">
          <button type="button" className={`console-header__utility console-header__utility--icon${settingsOpen ? ' is-active' : ''}`} onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen} aria-controls="console-settings" aria-label="Open interface settings">
            <HeaderGlyph name="settings" />
          </button>
          {settingsOpen && (
            <div className="console-settings" id="console-settings">
              <header><span>INTERFACE SETTINGS</span><button type="button" onClick={() => setSettingsOpen(false)}>×</button></header>
              <button type="button" onClick={onCycleBackground}><span>Environment</span><b>{backgroundScene}</b></button>
              <button type="button" onClick={onToggleSound}><span>Interface sound</span><b>{soundEnabled ? 'On' : 'Off'}</b></button>
              <button type="button" onClick={onToggleEffects}><span>Visual effects</span><b>{effectsEnabled ? 'Full' : 'Reduced'}</b></button>
            </div>
          )}
        </div>
      </div>

      <button className="console-header__mobile-session" type="button" onClick={onOpenSession} aria-label={`Open session, ${sessionCount} saved items`}>
        <HeaderGlyph name="session" />{sessionCount > 0 && <i>{sessionCount}</i>}
      </button>
      <button className="console-header__mobile-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close console navigation' : 'Open console navigation'}><span /><span /></button>

      <div className="console-header__mobile-panel">
        <nav aria-label="Mobile console worlds">
          {navigation.map((item) => (
            <button key={item.id} type="button" className={mode === item.id ? 'is-active' : ''} onClick={() => chooseMode(item.id)}>
              <HeaderGlyph name={item.id} /><span><b>{item.label}</b><small>{item.meta}</small></span>
            </button>
          ))}
        </nav>
        <div className="console-header__mobile-settings">
          <button type="button" onClick={onCycleBackground}>Scene <b>{backgroundScene}</b></button>
          <button type="button" onClick={onToggleSound}>Sound <b>{soundEnabled ? 'On' : 'Off'}</b></button>
          <button type="button" onClick={onToggleEffects}>Effects <b>{effectsEnabled ? 'Full' : 'Reduced'}</b></button>
        </div>
      </div>
    </header>
  )
}
