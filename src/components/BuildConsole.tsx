import { useEffect, useMemo, useState } from 'react'
import { getMission, missions, type Mission, type MissionId, type MissionQuestion } from '../data/missions'
import { AgentCore } from './AgentCore'

export type MissionAnswer = {
  selections: string[]
  note: string
}

export type MissionSession = {
  id: string
  missionId: MissionId
  missionLabel: string
  answers: Record<string, MissionAnswer>
  chapterIndex: number
  questionIndex: number
  updatedAt: number
}

type BuildConsoleProps = {
  restoredSession?: MissionSession | null
  onSave: (session: MissionSession) => void
  onStatusChange: (status?: string) => void
  onNavigate?: () => void
}

function MissionGlyph({ id }: { id: MissionId }) {
  if (id === 'website') return <svg viewBox="0 0 52 52" aria-hidden="true"><rect x="6" y="9" width="40" height="31" rx="3" /><path d="M6 17h40M13 13h1M18 13h1M15 45h22" /><path d="M15 24h10v9H15zM29 24h9M29 29h9" /></svg>
  if (id === 'webapp') return <svg viewBox="0 0 52 52" aria-hidden="true"><rect x="6" y="7" width="40" height="38" rx="3" /><path d="M16 7v38M16 17h30M22 24h8v7h-8zM34 24h6M22 36h18" /></svg>
  if (id === 'mobile') return <svg viewBox="0 0 52 52" aria-hidden="true"><rect x="15" y="4" width="22" height="44" rx="5" /><path d="M22 9h8M23 42h6" /><circle cx="26" cy="25" r="7" /><path d="M26 15v3M26 32v3M16 25h3M33 25h3" /></svg>
  if (id === 'existing') return <svg viewBox="0 0 52 52" aria-hidden="true"><path d="M12 17a17 17 0 1 1-2 15M12 17V8M12 17h9" /><path d="m20 32 5 5 10-13" /></svg>
  return <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="18" /><path d="M20 20a6 6 0 0 1 12 0c0 5-6 5-6 10M26 37h.1" /></svg>
}

function flattenQuestions(mission: Mission) {
  return mission.chapters.flatMap((chapter, chapterIndex) => chapter.questions.map((question, questionIndex) => ({ chapter, chapterIndex, question, questionIndex })))
}

function answerComplete(question: MissionQuestion, answer?: MissionAnswer) {
  if (!answer) return false
  if (question.options?.length && answer.selections.length) return true
  return answer.note.trim().length > 0
}

export function BuildConsole({ restoredSession, onSave, onStatusChange, onNavigate }: BuildConsoleProps) {
  const [missionId, setMissionId] = useState<MissionId | null>(restoredSession?.missionId ?? null)
  const [chapterIndex, setChapterIndex] = useState(restoredSession?.chapterIndex ?? 0)
  const [questionIndex, setQuestionIndex] = useState(restoredSession?.questionIndex ?? 0)
  const [answers, setAnswers] = useState<Record<string, MissionAnswer>>(restoredSession?.answers ?? {})
  const [idea, setIdea] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)
  const mission = missionId ? getMission(missionId) : null

  useEffect(() => {
    if (!restoredSession) return
    setMissionId(restoredSession.missionId)
    setChapterIndex(restoredSession.chapterIndex)
    setQuestionIndex(restoredSession.questionIndex)
    setAnswers(restoredSession.answers)
  }, [restoredSession])

  useEffect(() => {
    if (!mission) onStatusChange(undefined)
    else onStatusChange(`${mission.shortLabel} · ${chapterIndex + 1}/${mission.chapters.length}`)
  }, [chapterIndex, mission, onStatusChange])

  const currentChapter = mission?.chapters[chapterIndex]
  const question = currentChapter?.questions[questionIndex]
  const answer = question ? (answers[question.id] ?? { selections: [], note: '' }) : { selections: [], note: '' }
  const flat = useMemo(() => mission ? flattenQuestions(mission) : [], [mission])
  const currentFlatIndex = flat.findIndex((item) => item.chapterIndex === chapterIndex && item.questionIndex === questionIndex)
  const completedCount = flat.filter((item) => answerComplete(item.question, answers[item.question.id])).length
  const progress = flat.length ? Math.round((completedCount / flat.length) * 100) : 0

  const selectMission = (id: MissionId) => {
    setMissionId(id)
    setChapterIndex(0)
    setQuestionIndex(0)
    setAnswers({})
    setIdea('')
    onNavigate?.()
  }

  const beginFromIdea = () => {
    const normalized = idea.toLowerCase()
    let id: MissionId = 'unsure'
    if (/mobile|iphone|android|phone|ios/.test(normalized)) id = 'mobile'
    else if (/web app|saas|dashboard|portal|platform|marketplace/.test(normalized)) id = 'webapp'
    else if (/website|site|landing|portfolio|ecommerce|e-commerce/.test(normalized)) id = 'website'
    else if (/existing|redesign|rebuild|improve|current product/.test(normalized)) id = 'existing'
    selectMission(id)
    const firstQuestion = getMission(id).chapters[0].questions[0]
    setAnswers({ [firstQuestion.id]: { selections: [], note: idea } })
  }

  const setNote = (note: string) => {
    if (!question) return
    setAnswers((current) => ({ ...current, [question.id]: { ...answer, note } }))
  }

  const toggleOption = (label: string) => {
    if (!question) return
    const selections = question.multiple
      ? answer.selections.includes(label)
        ? answer.selections.filter((value) => value !== label)
        : [...answer.selections, label]
      : [label]
    setAnswers((current) => ({ ...current, [question.id]: { ...answer, selections } }))
    onNavigate?.()
  }

  const goToFlat = (index: number) => {
    const target = flat[Math.max(0, Math.min(flat.length - 1, index))]
    if (!target) return
    setChapterIndex(target.chapterIndex)
    setQuestionIndex(target.questionIndex)
    onNavigate?.()
  }

  const saveSession = () => {
    if (!mission) return
    onSave({
      id: `mission-${mission.id}`,
      missionId: mission.id,
      missionLabel: mission.label,
      answers,
      chapterIndex,
      questionIndex,
      updatedAt: Date.now(),
    })
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1400)
    onNavigate?.()
  }

  const exportBrief = () => {
    if (!mission) return
    const payload = {
      productType: mission.label,
      generatedAt: new Date().toISOString(),
      completion: `${progress}%`,
      brief: flat.map(({ chapter, question: itemQuestion }) => ({
        chapter: chapter.label,
        question: itemQuestion.prompt,
        selections: answers[itemQuestion.id]?.selections ?? [],
        notes: answers[itemQuestion.id]?.note ?? '',
      })).filter((item) => item.selections.length || item.notes),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${mission.id}-product-brief.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!mission || !currentChapter || !question) {
    return (
      <section className="creation-world creation-world--idle" aria-labelledby="creation-title">
        <aside className="command-sector command-sector--port" aria-label="Web creation missions">
          <span className="command-sector__shell" aria-hidden="true" />
          <header className="command-sector__header">
            <span><i />MISSION ARRAY / A</span>
            <strong>Choose a digital surface</strong>
            <p>Open a mission directly or describe the idea to the intelligence core.</p>
          </header>
          <div className="mission-stack">
            {missions.slice(0, 2).map((item) => (
              <button key={item.id} type="button" className="mission-object" style={{ '--mission-accent': item.accent } as React.CSSProperties} onClick={() => selectMission(item.id)}>
                <span className="mission-object__index">{item.index}</span>
                <span className="mission-object__glyph"><MissionGlyph id={item.id} /></span>
                <span className="mission-object__copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                <i aria-hidden="true">INITIALIZE <b>→</b></i>
              </button>
            ))}
          </div>
          <div className="command-sector__telemetry">
            <article><span>CHANNEL</span><strong>PRODUCT CREATION</strong><i /></article>
            <article><span>INPUT</span><strong>VOICE / TEXT / SELECT</strong><i /></article>
            <article><span>OUTPUT</span><strong>COMPLETE BUILD BRIEF</strong><i /></article>
          </div>
        </aside>

        <main className="command-sector command-sector--core">
          <span className="command-sector__neck" aria-hidden="true" />
          <header className="agent-channel-status"><span><i />AI CREATION CHANNEL</span><strong>LISTENING FOR A MISSION</strong></header>
          <div className="agent-command-center">
            <div className="agent-command-center__core"><AgentCore state="listening" /></div>
            <div className="agent-command-center__dialogue">
              <span className="console-kicker"><i />CONVERSATIONAL PRODUCT ARCHITECT</span>
              <h1 id="creation-title">What should we bring to life?</h1>
              <p>Talk naturally about the idea or choose a product surface. The core will open the right decision path and assemble the brief as you work.</p>
            </div>
            <div className="agent-suggestions" aria-label="Example starting points">
              <button type="button" onClick={() => setIdea('A mobile app that helps people book and manage local services')}>Mobile booking product</button>
              <button type="button" onClick={() => setIdea('A web application for teams to manage a complex workflow')}>Team workflow system</button>
              <button type="button" onClick={() => setIdea('I have an idea, but I am not sure what type of product it should be')}>Help me choose</button>
            </div>
            <form className="creation-command" onSubmit={(event) => { event.preventDefault(); if (idea.trim()) beginFromIdea() }}>
              <span><i />MESSAGE CORE</span>
              <input value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Describe what you want people to be able to do…" aria-label="Describe your product idea" />
              <button type="submit" disabled={!idea.trim()}>Transmit <i>→</i></button>
            </form>
          </div>
          <footer className="agent-channel-footer"><span><i />STRUCTURED GUIDANCE ONLINE</span><strong>NO SUBMISSION WITHOUT REVIEW</strong></footer>
        </main>

        <aside className="command-sector command-sector--starboard" aria-label="Mobile and discovery missions">
          <span className="command-sector__shell" aria-hidden="true" />
          <header className="command-sector__header">
            <span><i />MISSION ARRAY / B</span>
            <strong>Continue from any stage</strong>
            <p>Start new, improve what exists, or let the core identify the right product shape.</p>
          </header>
          <div className="mission-stack mission-stack--compact">
            {missions.slice(2).map((item) => (
              <button key={item.id} type="button" className="mission-object" style={{ '--mission-accent': item.accent } as React.CSSProperties} onClick={() => selectMission(item.id)}>
                <span className="mission-object__index">{item.index}</span>
                <span className="mission-object__glyph"><MissionGlyph id={item.id} /></span>
                <span className="mission-object__copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                <i aria-hidden="true">INITIALIZE <b>→</b></i>
              </button>
            ))}
          </div>
          <div className="empty-blueprint">
            <header><span><i />LIVE BLUEPRINT</span><strong>STANDBY</strong></header>
            <div><i /><b /><span>SELECT A MISSION</span></div>
            <p>Requirements, flows, capabilities, direction, and delivery decisions will assemble here.</p>
          </div>
        </aside>
      </section>
    )
  }

  const isLast = currentFlatIndex === flat.length - 1

  return (
    <section className="creation-world creation-world--mission" style={{ '--mission-accent': mission.accent } as React.CSSProperties} aria-label={`${mission.label} creation mission`}>
      <aside className="mission-rail">
        <button type="button" className="mission-rail__identity" onClick={() => { setMissionId(null); onStatusChange(undefined); onNavigate?.() }}>
          <span><MissionGlyph id={mission.id} /></span>
          <div><small>ACTIVE MISSION</small><strong>{mission.label}</strong><i>Change product type</i></div>
        </button>
        <div className="mission-rail__progress"><span style={{ width: `${progress}%` }} /><small>{progress}% BRIEFED</small></div>
        <nav aria-label="Mission chapters">
          {mission.chapters.map((chapter, index) => {
            const chapterComplete = chapter.questions.every((itemQuestion) => answerComplete(itemQuestion, answers[itemQuestion.id]))
            return (
              <button key={`${chapter.id}-${index}`} type="button" className={`${index === chapterIndex ? 'is-active' : ''}${chapterComplete ? ' is-complete' : ''}`} onClick={() => { setChapterIndex(index); setQuestionIndex(0); onNavigate?.() }}>
                <span>{String(index + 1).padStart(2, '0')}</span><i /><div><strong>{chapter.label}</strong><small>{chapter.questions.length} decisions</small></div><b>{chapterComplete ? '✓' : '→'}</b>
              </button>
            )
          })}
        </nav>
        <button type="button" className="mission-rail__save" onClick={saveSession}>{savedFlash ? 'SESSION SAVED ✓' : 'SAVE THIS SESSION'}</button>
      </aside>

      <main className="mission-dialogue">
        <header className="mission-dialogue__agent">
          <AgentCore state="linked" compact label="MISSION INTELLIGENCE" />
          <div><span>CHAPTER {String(chapterIndex + 1).padStart(2, '0')} / {currentChapter.label.toUpperCase()}</span><strong>{question.title}</strong><small>{currentFlatIndex + 1} of {flat.length} decisions</small></div>
        </header>

        <div className="mission-question" key={question.id}>
          <span className="mission-question__eyebrow"><i />CURRENT DECISION</span>
          <h2>{question.prompt}</h2>
          <p>{question.helper}</p>

          {question.options && (
            <div className={`mission-options${question.multiple ? ' is-multiple' : ''}`}>
              {question.options.map((option, index) => {
                const selected = answer.selections.includes(option.label)
                return (
                  <button key={option.label} type="button" className={selected ? 'is-selected' : ''} onClick={() => toggleOption(option.label)} aria-pressed={selected}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</div>
                    <i>{selected ? '✓' : '+'}</i>
                  </button>
                )
              })}
            </div>
          )}

          {question.textPlaceholder && (
            <label className="mission-note">
              <span>{question.options ? 'ADDITIONAL CONTEXT' : 'YOUR RESPONSE'}</span>
              <textarea value={answer.note} onChange={(event) => setNote(event.target.value)} placeholder={question.textPlaceholder} rows={question.options ? 3 : 5} />
              <small>{answer.note.length} characters</small>
            </label>
          )}
        </div>

        <footer className="mission-dialogue__footer">
          <button type="button" onClick={() => currentFlatIndex > 0 ? goToFlat(currentFlatIndex - 1) : setMissionId(null)}>← <span>{currentFlatIndex > 0 ? 'Previous' : 'All missions'}</span></button>
          <span><i style={{ width: `${((currentFlatIndex + 1) / flat.length) * 100}%` }} /></span>
          {isLast
            ? <button type="button" className="is-primary" onClick={exportBrief}><span>Export brief</span> ↓</button>
            : <button type="button" className="is-primary" onClick={() => goToFlat(currentFlatIndex + 1)}><span>{answerComplete(question, answer) ? 'Continue' : 'Skip for now'}</span> →</button>}
        </footer>
      </main>

      <aside className="mission-blueprint">
        <header><span><i />LIVE BLUEPRINT</span><strong>{mission.shortLabel.toUpperCase()}</strong></header>
        <div className="mission-blueprint__status">
          <div><span style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><b>{progress}</b><small>%</small></span></div>
          <section><small>MISSION STATE</small><strong>{progress === 100 ? 'READY TO REVIEW' : 'ASSEMBLING'}</strong><p>{completedCount} of {flat.length} decisions captured</p></section>
        </div>
        <div className="mission-blueprint__answers">
          {flat.filter((item) => answerComplete(item.question, answers[item.question.id])).slice(-6).map((item) => {
            const itemAnswer = answers[item.question.id]
            return (
              <article key={item.question.id}>
                <span>{item.chapter.shortLabel}</span>
                <strong>{item.question.title}</strong>
                <p>{itemAnswer.selections.length ? itemAnswer.selections.join(' · ') : itemAnswer.note}</p>
              </article>
            )
          })}
          {completedCount === 0 && <div className="mission-blueprint__empty"><i /><strong>Awaiting first decision</strong><p>Your answers will assemble here as a concise product blueprint.</p></div>}
        </div>
        <footer><span>LAST SIGNAL</span><b>{answerComplete(question, answer) ? 'CAPTURED' : 'AWAITING INPUT'}</b></footer>
      </aside>
    </section>
  )
}
