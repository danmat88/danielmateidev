import { useEffect, useMemo, useState } from 'react'
import type { BackgroundScene } from './AppBackground'
import { BuildConsole, type MissionSession } from './BuildConsole'
import { ComponentLab, type ComponentPreset } from './ComponentLab'
import { ConsoleHeader, type ConsoleMode } from './ConsoleHeader'
import { StudioWorld } from './StudioWorld'

type CreationConsoleProps = {
  backgroundScene: BackgroundScene
  soundEnabled: boolean
  effectsEnabled: boolean
  onCycleBackground: () => void
  onToggleSound: () => void
  onToggleEffects: () => void
  onNavigate: () => void
}

function readStoredArray<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T[] : []
  } catch {
    return []
  }
}

export function CreationConsole({
  backgroundScene,
  soundEnabled,
  effectsEnabled,
  onCycleBackground,
  onToggleSound,
  onToggleEffects,
  onNavigate,
}: CreationConsoleProps) {
  const [mode, setMode] = useState<ConsoleMode>(() => {
    const requested = new URLSearchParams(window.location.search).get('mode')
    return requested === 'components' || requested === 'studio' ? requested : 'create'
  })
  const [missionStatus, setMissionStatus] = useState<string>()
  const [sessions, setSessions] = useState<MissionSession[]>(() => readStoredArray<MissionSession>('dm-mission-sessions'))
  const [presets, setPresets] = useState<ComponentPreset[]>(() => readStoredArray<ComponentPreset>('dm-component-presets'))
  const [restoredSession, setRestoredSession] = useState<MissionSession | null>(null)
  const [restoredPreset, setRestoredPreset] = useState<ComponentPreset | null>(null)
  const [sessionOpen, setSessionOpen] = useState(false)

  useEffect(() => localStorage.setItem('dm-mission-sessions', JSON.stringify(sessions)), [sessions])
  useEffect(() => localStorage.setItem('dm-component-presets', JSON.stringify(presets)), [presets])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSessionOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const changeMode = (next: ConsoleMode) => {
    setMode(next)
    setSessionOpen(false)
    onNavigate()
  }

  const saveMission = (session: MissionSession) => {
    setSessions((current) => [session, ...current.filter((item) => item.id !== session.id)].slice(0, 8))
  }

  const savePreset = (preset: ComponentPreset) => {
    setPresets((current) => [preset, ...current].slice(0, 12))
  }

  const latestActivity = useMemo(() => [
    ...sessions.map((item) => ({ type: 'mission' as const, item, time: item.updatedAt })),
    ...presets.map((item) => ({ type: 'preset' as const, item, time: item.updatedAt })),
  ].sort((a, b) => b.time - a.time), [presets, sessions])

  return (
    <div className="creation-console" data-mode={mode}>
      <ConsoleHeader
        mode={mode}
        missionStatus={missionStatus}
        sessionCount={latestActivity.length}
        backgroundScene={backgroundScene}
        soundEnabled={soundEnabled}
        effectsEnabled={effectsEnabled}
        onModeChange={changeMode}
        onOpenSession={() => setSessionOpen(true)}
        onCycleBackground={onCycleBackground}
        onToggleSound={onToggleSound}
        onToggleEffects={onToggleEffects}
      />

      <div className="creation-console__world">
        <div className={`creation-console__mode${mode === 'create' ? ' is-active' : ''}`} aria-hidden={mode !== 'create'}>
          <BuildConsole restoredSession={restoredSession} onSave={saveMission} onStatusChange={setMissionStatus} onNavigate={onNavigate} />
        </div>
        <div className={`creation-console__mode${mode === 'components' ? ' is-active' : ''}`} aria-hidden={mode !== 'components'}>
          <ComponentLab restoredPreset={restoredPreset} onSave={savePreset} onNavigate={onNavigate} />
        </div>
        <div className={`creation-console__mode${mode === 'studio' ? ' is-active' : ''}`} aria-hidden={mode !== 'studio'}>
          <StudioWorld onStart={() => changeMode('create')} />
        </div>
      </div>

      {sessionOpen && (
        <div className="session-drawer-backdrop" role="presentation" onMouseDown={() => setSessionOpen(false)}>
          <aside className="session-drawer" role="dialog" aria-modal="true" aria-labelledby="session-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><span><i />PERSISTENT SESSION</span><h2 id="session-title">Saved work</h2><p>Continue a product brief or reopen a component configuration stored on this device.</p></div><button type="button" onClick={() => setSessionOpen(false)} aria-label="Close saved work">×</button></header>
            <div className="session-drawer__list">
              {latestActivity.map((activity) => activity.type === 'mission' ? (
                <button key={`mission-${activity.item.id}`} type="button" onClick={() => { setRestoredSession(activity.item); setMode('create'); setSessionOpen(false); onNavigate() }}>
                  <span className="is-mission">MISSION</span>
                  <div><strong>{activity.item.missionLabel}</strong><small>{Object.keys(activity.item.answers).length} decisions captured</small></div>
                  <time>{new Date(activity.item.updatedAt).toLocaleDateString()}</time><i>→</i>
                </button>
              ) : (
                <button key={`preset-${activity.item.id}`} type="button" onClick={() => { setRestoredPreset(activity.item); setMode('components'); setSessionOpen(false); onNavigate() }}>
                  <span className="is-component">DESIGN</span>
                  <div><strong>{activity.item.name}</strong><small>Orbit Cards configuration</small></div>
                  <time>{new Date(activity.item.updatedAt).toLocaleDateString()}</time><i>→</i>
                </button>
              ))}
              {latestActivity.length === 0 && <div className="session-drawer__empty"><i /><strong>No saved work yet</strong><p>Save a creation mission or an Orbit Cards design and it will appear here.</p></div>}
            </div>
            <footer><span>LOCAL STORAGE</span><p>Account synchronization is not connected. These saves remain in this browser.</p></footer>
          </aside>
        </div>
      )}
    </div>
  )
}
