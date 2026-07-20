import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterfaceAudio } from './audio/useInterfaceAudio'
import { AppBackground, type BackgroundScene } from './components/AppBackground'
import { BootLoader } from './components/BootLoader'
import { CreationConsole } from './components/CreationConsole'
import './styles/app.css'
import './styles/responsive.css'
import './styles/console.css'

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [interfaceSettled, setInterfaceSettled] = useState(false)
  const [readiness, setReadiness] = useState({ dom: false, fonts: false, shell: false, background: false })
  const [backgroundScene, setBackgroundScene] = useState<BackgroundScene>(() => {
    const stored = localStorage.getItem('dm-background-scene')
    return stored === 'code' ? 'code' : 'space'
  })
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('dm-sound-enabled') === 'true')
  const [effectsEnabled, setEffectsEnabled] = useState(() => localStorage.getItem('dm-effects-enabled') !== 'false')
  const { play: playAudio, enable: enableAudio, disable: disableAudio } = useInterfaceAudio(soundEnabled)
  const removeLoader = useCallback(() => setLoaderVisible(false), [])
  const markBackgroundReady = useCallback(() => setReadiness((state) => ({ ...state, background: true })), [])

  useEffect(() => localStorage.setItem('dm-background-scene', backgroundScene), [backgroundScene])
  useEffect(() => localStorage.setItem('dm-sound-enabled', String(soundEnabled)), [soundEnabled])
  useEffect(() => localStorage.setItem('dm-effects-enabled', String(effectsEnabled)), [effectsEnabled])

  useEffect(() => {
    if (loaderVisible) return
    const settleTimer = window.setTimeout(() => setInterfaceSettled(true), 2450)
    return () => window.clearTimeout(settleTimer)
  }, [loaderVisible])

  const cycleBackground = useCallback(() => {
    playAudio('scene')
    setBackgroundScene((scene) => scene === 'space' ? 'code' : 'space')
  }, [playAudio])

  const toggleSound = useCallback(() => {
    const nextEnabled = !soundEnabled
    if (nextEnabled) enableAudio()
    else disableAudio()
    setSoundEnabled(nextEnabled)
  }, [disableAudio, enableAudio, soundEnabled])

  const toggleEffects = useCallback(() => {
    playAudio('performance')
    setEffectsEnabled((enabled) => !enabled)
  }, [playAudio])

  useEffect(() => {
    let cancelled = false
    let shellFrame = 0
    const mark = (key: 'dom' | 'fonts' | 'shell') => {
      if (!cancelled) setReadiness((state) => ({ ...state, [key]: true }))
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => mark('dom'), { once: true })
    } else {
      mark('dom')
    }

    document.fonts.ready.then(() => mark('fonts'))
    shellFrame = requestAnimationFrame(() => {
      shellFrame = requestAnimationFrame(() => mark('shell'))
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(shellFrame)
    }
  }, [])

  const completedTasks = useMemo(() => Object.values(readiness).filter(Boolean).length, [readiness])
  const appReady = completedTasks === Object.keys(readiness).length

  return (
    <main className={`app-root${effectsEnabled ? '' : ' is-low-power'}${interfaceSettled ? ' has-entered' : ''}`}>
      <AppBackground scene={backgroundScene} effectsEnabled={effectsEnabled} onReady={markBackgroundReady} />
      {loaderVisible && <BootLoader ready={appReady} readiness={readiness} onComplete={removeLoader} />}
      {!loaderVisible && (
        <CreationConsole
          backgroundScene={backgroundScene}
          soundEnabled={soundEnabled}
          effectsEnabled={effectsEnabled}
          onCycleBackground={cycleBackground}
          onToggleSound={toggleSound}
          onToggleEffects={toggleEffects}
          onNavigate={() => playAudio('navigate')}
        />
      )}
    </main>
  )
}

export default App
