import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppBackground } from './components/AppBackground'
import { AppHeader } from './components/AppHeader'
import { BootLoader } from './components/BootLoader'
import './styles/app.css'

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [readiness, setReadiness] = useState({ dom: false, fonts: false, shell: false, background: false })
  const removeLoader = useCallback(() => setLoaderVisible(false), [])
  const markBackgroundReady = useCallback(() => setReadiness((state) => ({ ...state, background: true })), [])

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
    <main className="app-root">
      <AppBackground onReady={markBackgroundReady} />
      {loaderVisible && <BootLoader ready={appReady} readiness={readiness} onComplete={removeLoader} />}
      {!loaderVisible && <AppHeader />}
    </main>
  )
}

export default App
