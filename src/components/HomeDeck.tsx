import { memo, useEffect, useRef, useState, type FormEvent } from 'react'
import type { BackgroundScene } from './AppBackground'

type SurfaceId = 'mobile' | 'intelligence' | 'web'

type Surface = {
  id: SurfaceId
  index: string
  shortLabel: string
  title: string
  context: string
  welcome: string
  blueprintTitle: string
  blueprintCopy: string
  blueprintNodes: [string, string, string, string]
  signals: Array<{ label: string; value: string }>
  prompts: [string, string, string]
}

type Exchange = {
  question: string
  response: string
}

type HomeDeckProps = {
  backgroundScene: BackgroundScene
  soundEnabled: boolean
  effectsEnabled: boolean
  onCycleBackground: () => void
  onToggleSound: () => void
  onToggleEffects: () => void
  onNavigate?: () => void
}

const surfaces: Surface[] = [
  {
    id: 'mobile',
    index: '01',
    shortLabel: 'Mobile',
    title: 'Pocket experience',
    context: 'a focused mobile product that should feel useful in seconds',
    welcome: 'I can see the mobile surface on your left. We can shape its flow, visual language, intelligence, and the system behind it.',
    blueprintTitle: 'Adaptive mobile companion',
    blueprintCopy: 'A calm, touch-first experience that understands intent and keeps the next useful action close.',
    blueprintNodes: ['INTERFACE', 'CONTEXT', 'ACTIONS', 'MEMORY'],
    signals: [
      { label: 'Surface', value: 'Native mobile' },
      { label: 'Behavior', value: 'Intent aware' },
      { label: 'Priority', value: 'One-hand clarity' },
    ],
    prompts: ['Design the first minute', 'Make it feel intelligent', 'Map the core experience'],
  },
  {
    id: 'intelligence',
    index: '02',
    shortLabel: 'Agent',
    title: 'Agent intelligence',
    context: 'an AI agent that should understand the mission before it takes action',
    welcome: 'The intelligence core is selected. Tell me what this agent should know, decide, or do, and I will turn that into a controlled product flow.',
    blueprintTitle: 'Context-aware operator',
    blueprintCopy: 'An agent that reads the situation, explains its plan, uses the right capabilities, and keeps the human in control.',
    blueprintNodes: ['PERCEPTION', 'REASONING', 'TOOLS', 'GUARDRAILS'],
    signals: [
      { label: 'Role', value: 'AI operator' },
      { label: 'Behavior', value: 'Plan then act' },
      { label: 'Control', value: 'Human approval' },
    ],
    prompts: ['Define the agent role', 'Show its decision loop', 'Design human control'],
  },
  {
    id: 'web',
    index: '03',
    shortLabel: 'Web',
    title: 'Spatial web console',
    context: 'a web workspace where complex work should still feel direct and understandable',
    welcome: 'The web console is active. We can organize the workspace around the user’s real decisions instead of filling it with dashboard noise.',
    blueprintTitle: 'Living web workspace',
    blueprintCopy: 'A responsive control surface where information, actions, and real-time feedback stay connected to the current goal.',
    blueprintNodes: ['WORKSPACE', 'LIVE STATE', 'SERVICES', 'FEEDBACK'],
    signals: [
      { label: 'Surface', value: 'Responsive web' },
      { label: 'Behavior', value: 'Real-time' },
      { label: 'Priority', value: 'Decision clarity' },
    ],
    prompts: ['Shape the workspace', 'Plan the live states', 'Reduce interface noise'],
  },
]

function responseFor(prompt: string, surface: Surface) {
  const normalized = prompt.toLowerCase()

  if (/first|start|minute|onboard/.test(normalized)) {
    return `For ${surface.title.toLowerCase()}, the first moment should establish one clear promise, ask for only the context we need, and immediately produce something the user can shape.`
  }

  if (/look|visual|design|beautiful|feel/.test(normalized)) {
    return `I would give it a precise visual rhythm: one dominant action, quiet supporting information, and motion that explains state changes instead of decorating them.`
  }

  if (/agent|intelligent|ai|reason|decision/.test(normalized)) {
    return `The intelligence should always show what it understood, what it plans to do, and where it needs permission. That makes the experience capable without becoming mysterious.`
  }

  if (/architecture|system|blueprint|work|build/.test(normalized)) {
    return `I would build the experience around four connected layers: ${surface.blueprintNodes.map((node) => node.toLowerCase()).join(', ')}. The blueprint on the right is already organized around that path.`
  }

  return `I understand this as ${surface.context}. I would begin by defining the one transformation the user should feel, then design every screen and capability around that outcome.`
}

function BlueprintDiagram({ surface }: { surface: Surface }) {
  const [top, right, bottom, left] = surface.blueprintNodes

  return (
    <svg className="blueprint-diagram" viewBox="0 0 360 330" role="img" aria-label={`${surface.blueprintTitle} system blueprint`}>
      <g className="blueprint-diagram__grid">
        <path d="M20 55H340M20 110H340M20 165H340M20 220H340M20 275H340" />
        <path d="M60 20V310M120 20V310M180 20V310M240 20V310M300 20V310" />
      </g>
      <g className="blueprint-diagram__links">
        <path d="M180 150V72M210 165h78M180 198v62M150 165H72" />
        <path d="M180 72 288 165 180 260 72 165Z" />
      </g>
      <g className="blueprint-diagram__nodes">
        <circle cx="180" cy="58" r="12" />
        <circle cx="302" cy="165" r="12" />
        <circle cx="180" cy="274" r="12" />
        <circle cx="58" cy="165" r="12" />
      </g>
      <g className="blueprint-diagram__core">
        <path d="m180 122 43 25v50l-43 25-43-25v-50Z" />
        <circle cx="180" cy="172" r="28" />
        <circle cx="180" cy="172" r="6" />
      </g>
      <g className="blueprint-diagram__labels">
        <text x="180" y="34">{top}</text>
        <text x="306" y="142">{right}</text>
        <text x="180" y="307">{bottom}</text>
        <text x="54" y="142">{left}</text>
        <text x="180" y="176">LIVE</text>
      </g>
    </svg>
  )
}

export const HomeDeck = memo(function HomeDeck({ onNavigate }: HomeDeckProps) {
  const [selectedId, setSelectedId] = useState<SurfaceId>('mobile')
  const [input, setInput] = useState('')
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const [thinking, setThinking] = useState(false)
  const responseTimer = useRef<number | undefined>(undefined)
  const selected = surfaces.find(({ id }) => id === selectedId) ?? surfaces[0]

  useEffect(() => () => window.clearTimeout(responseTimer.current), [])

  const selectSurface = (id: SurfaceId) => {
    window.clearTimeout(responseTimer.current)
    setSelectedId(id)
    setExchange(null)
    setThinking(false)
    onNavigate?.()
  }

  const askArchitect = (rawPrompt: string) => {
    const prompt = rawPrompt.trim()
    if (!prompt) return

    const mentionedSurface = surfaces.find((surface) => {
      if (surface.id === 'intelligence') return /agent|intelligence|ai/.test(prompt.toLowerCase())
      return prompt.toLowerCase().includes(surface.id)
    })
    const responseSurface = mentionedSurface ?? selected

    if (mentionedSurface) setSelectedId(mentionedSurface.id)
    window.clearTimeout(responseTimer.current)
    setInput('')
    setThinking(true)
    setExchange({ question: prompt, response: '' })
    onNavigate?.()

    responseTimer.current = window.setTimeout(() => {
      setExchange({ question: prompt, response: responseFor(prompt, responseSurface) })
      setThinking(false)
    }, 520)
  }

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    askArchitect(input)
  }

  return (
    <div className="home-deck workshop" data-focus={selectedId} aria-label="AI creation workshop">
      <section className="home-deck__sector home-deck__sector--port" aria-label="Creation gallery">
        <span className="home-deck__shell" aria-hidden="true" />
        <div className="creation-gallery">
          <header className="workshop-heading">
            <span><i /> CREATION GALLERY</span>
            <h2>Choose a surface.</h2>
            <p>Every object is a different place for an idea to become real.</p>
          </header>

          <div className="creation-gallery__stage">
            <button
              type="button"
              className={`gallery-browser${selectedId === 'web' ? ' is-active' : ''}`}
              onClick={() => selectSurface('web')}
              aria-label="Select web workspace"
              aria-pressed={selectedId === 'web'}
            >
              <span className="gallery-browser__bar"><i /><i /><i /><b>workspace.live</b></span>
              <span className="gallery-browser__body">
                <i className="gallery-browser__rail" />
                <span className="gallery-browser__content"><b>LIVE WORKSPACE</b><i /><i /><i /></span>
              </span>
            </button>

            <button
              type="button"
              className={`gallery-phone gallery-phone--primary${selectedId === 'mobile' ? ' is-active' : ''}`}
              onClick={() => selectSurface('mobile')}
              aria-label="Select mobile experience"
              aria-pressed={selectedId === 'mobile'}
            >
              <span className="gallery-phone__screen">
                <span className="phone-status"><b>09:41</b><i /></span>
                <span className="phone-title"><small>GOOD MORNING</small><b>Focus for today</b></span>
                <span className="phone-orbit"><i /><b>72</b><small>FLOW</small></span>
                <span className="phone-action">Continue session <b>+</b></span>
                <span className="phone-dock"><i /><i /><i /></span>
              </span>
            </button>

            <button
              type="button"
              className={`gallery-phone gallery-phone--companion${selectedId === 'intelligence' ? ' is-active' : ''}`}
              onClick={() => selectSurface('intelligence')}
              aria-label="Select AI agent experience"
              aria-pressed={selectedId === 'intelligence'}
            >
              <span className="gallery-phone__screen">
                <span className="phone-status"><b>AGENT</b><i /></span>
                <span className="phone-agent"><i><b /></i><strong>AURA</strong><small>READY TO DESIGN</small></span>
                <span className="phone-bubble">What should we make possible?</span>
                <span className="phone-wave"><i /><i /><i /><i /><i /></span>
              </span>
            </button>

            <button
              type="button"
              className={`gallery-agent-seed${selectedId === 'intelligence' ? ' is-active' : ''}`}
              onClick={() => selectSurface('intelligence')}
              aria-label="Open the intelligence core"
            >
              <span><i /><b /></span>
              <small>AI CORE</small>
            </button>
          </div>

          <nav className="creation-gallery__selector" aria-label="Creation surfaces">
            {surfaces.map((surface) => (
              <button
                key={surface.id}
                type="button"
                className={selectedId === surface.id ? 'is-active' : ''}
                onClick={() => selectSurface(surface.id)}
                aria-pressed={selectedId === surface.id}
              >
                <span>{surface.index}</span>
                <strong>{surface.shortLabel}</strong>
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="home-deck__sector home-deck__sector--core" aria-label="AI Architect conversation">
        <span className="home-deck__header-extension" aria-hidden="true" />
        <span className="home-deck__shell" aria-hidden="true" />
        <div className="architect-workspace">
          <header className="architect-workspace__status">
            <span><i /> AI ARCHITECT</span>
            <strong>CONTEXT LINKED / {selected.shortLabel.toUpperCase()}</strong>
          </header>

          <div className={`architect-core${thinking ? ' is-thinking' : ''}`} aria-hidden="true">
            <span className="architect-core__halo architect-core__halo--outer" />
            <span className="architect-core__halo architect-core__halo--inner" />
            <span className="architect-core__axis architect-core__axis--horizontal" />
            <span className="architect-core__axis architect-core__axis--vertical" />
            <span className="architect-core__body"><i /><b /></span>
            <small>AURA / ONLINE</small>
          </div>

          <div className="architect-dialogue" aria-live="polite">
            <span className="architect-dialogue__eyebrow">YOUR AI PRODUCT ARCHITECT</span>
            <h1>What should we create?</h1>
            {!exchange && <p>{selected.welcome}</p>}
            {exchange && (
              <div className="architect-exchange">
                <p className="architect-exchange__user"><span>YOU</span>{exchange.question}</p>
                <p className={`architect-exchange__agent${thinking ? ' is-thinking' : ''}`}>
                  <span>AURA</span>
                  {thinking ? <i><b /><b /><b /></i> : exchange.response}
                </p>
              </div>
            )}
          </div>

          <div className="architect-prompts" aria-label="Suggested prompts">
            {selected.prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => askArchitect(prompt)}>{prompt}<span>+</span></button>
            ))}
          </div>

          <form className="architect-input" onSubmit={submitPrompt}>
            <span className="architect-input__mark" aria-hidden="true"><i /></span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Tell AURA about your ${selected.shortLabel.toLowerCase()} idea...`}
              aria-label="Message the AI Architect"
              autoComplete="off"
            />
            <button type="submit" aria-label="Send message"><span>Send</span><i>→</i></button>
          </form>
        </div>
      </section>

      <section className="home-deck__sector home-deck__sector--starboard" aria-label="Living product blueprint">
        <span className="home-deck__shell" aria-hidden="true" />
        <div className="living-blueprint">
          <header className="workshop-heading workshop-heading--blueprint">
            <span><i /> LIVING BLUEPRINT</span>
            <h2>{selected.blueprintTitle}</h2>
            <p>{selected.blueprintCopy}</p>
          </header>

          <div className="living-blueprint__canvas" key={selected.id}>
            <span className="living-blueprint__corner living-blueprint__corner--tl" />
            <span className="living-blueprint__corner living-blueprint__corner--br" />
            <BlueprintDiagram surface={selected} />
            <span className="living-blueprint__scan">SYNCHRONIZING INTENT</span>
          </div>

          <div className="living-blueprint__signals">
            {selected.signals.map((signal, index) => (
              <article key={signal.label}>
                <span>0{index + 1}</span>
                <div><small>{signal.label}</small><strong>{signal.value}</strong></div>
              </article>
            ))}
          </div>

          <footer className="living-blueprint__footer">
            <span><i /> BLUEPRINT RESPONDING</span>
            <strong>{selected.index} / {selected.shortLabel.toUpperCase()}</strong>
          </footer>
        </div>
      </section>
    </div>
  )
})
