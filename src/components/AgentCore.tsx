type AgentCoreProps = {
  state?: 'idle' | 'listening' | 'working' | 'linked'
  compact?: boolean
  label?: string
}

export function AgentCore({ state = 'idle', compact = false, label = 'CREATION CORE' }: AgentCoreProps) {
  return (
    <div className={`agent-core is-${state}${compact ? ' is-compact' : ''}`} aria-label={`${label}, ${state}`}>
      <span className="agent-core__field agent-core__field--one" aria-hidden="true" />
      <span className="agent-core__field agent-core__field--two" aria-hidden="true" />
      <span className="agent-core__orbit agent-core__orbit--one" aria-hidden="true"><i /><i /><i /></span>
      <span className="agent-core__orbit agent-core__orbit--two" aria-hidden="true"><i /><i /></span>
      <span className="agent-core__axis agent-core__axis--x" aria-hidden="true" />
      <span className="agent-core__axis agent-core__axis--y" aria-hidden="true" />
      <span className="agent-core__body" aria-hidden="true">
        <i className="agent-core__aperture"><b /><b /><b /></i>
        <i className="agent-core__pulse" />
      </span>
      <span className="agent-core__label"><i />{label}<small>{state.toUpperCase()}</small></span>
    </div>
  )
}
