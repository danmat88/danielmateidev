import { useEffect, useRef, useState } from 'react'

type Readiness = {
  dom: boolean
  fonts: boolean
  shell: boolean
  background: boolean
}

type BootLoaderProps = { ready: boolean; readiness: Readiness; onComplete: () => void }

const modules: Array<{ key: keyof Readiness; label: string }> = [
  { key: 'dom', label: 'DOCUMENT' },
  { key: 'fonts', label: 'TYPE SYSTEM' },
  { key: 'shell', label: 'REACT SHELL' },
  { key: 'background', label: 'WEBGL SCENE' },
]

const MINIMUM_PRESENTATION_MS = 3200
const EXIT_TRANSITION_MS = 750

export function BootLoader({ ready, readiness, onComplete }: BootLoaderProps) {
  const [leaving, setLeaving] = useState(false)
  const [displayedProgress, setDisplayedProgress] = useState(0)
  const mountedAt = useRef(performance.now())
  const completed = modules.filter(({ key }) => readiness[key]).length
  const realProgress = completed / modules.length
  const percentage = Math.round(displayedProgress * 100)

  useEffect(() => {
    let frame = 0
    let previous = performance.now()
    const advance = (now: number) => {
      const delta = Math.min(64, now - previous)
      previous = now
      setDisplayedProgress((current) => {
        const target = realProgress
        const step = delta / MINIMUM_PRESENTATION_MS
        return Math.min(target, current + step)
      })
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  }, [realProgress])

  useEffect(() => {
    if (!ready || displayedProgress < 0.999) return
    const elapsed = performance.now() - mountedAt.current
    const remainingPresentation = Math.max(0, MINIMUM_PRESENTATION_MS - elapsed)
    let exitTimer = 0
    const presentationTimer = window.setTimeout(() => {
      setLeaving(true)
      exitTimer = window.setTimeout(onComplete, EXIT_TRANSITION_MS)
    }, remainingPresentation)
    return () => {
      window.clearTimeout(presentationTimer)
      window.clearTimeout(exitTimer)
    }
  }, [ready, displayedProgress, onComplete])

  return (
    <section
      className={`boot-console${leaving ? ' is-leaving' : ''}`}
      role="progressbar"
      aria-label="Loading application modules"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div className="boot-console__hud">
        <header className="boot-console__header">
          <div>
            <span className="boot-console__kicker">SYSTEM BOOT</span>
            <strong>{ready && displayedProgress >= 0.999 ? 'READY' : 'INITIALIZING'}</strong>
          </div>
          <span className="boot-console__percentage">{percentage.toString().padStart(3, '0')}<small>%</small></span>
        </header>

        <div className="boot-console__rail" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <i key={index} className={index < Math.round(displayedProgress * 24) ? 'is-active' : ''} />
          ))}
        </div>

        <div className="boot-console__modules">
          {modules.map(({ key, label }, index) => {
            const visuallyReady = readiness[key] && displayedProgress >= (index + 1) / modules.length
            return (
            <div key={key} className={visuallyReady ? 'is-ready' : ''}>
              <span>{label}</span>
              <span>{visuallyReady ? 'ONLINE' : 'WAIT'}</span>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
