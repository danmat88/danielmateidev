import { AgentCore } from './AgentCore'

type StudioWorldProps = {
  onStart: () => void
}

export function StudioWorld({ onStart }: StudioWorldProps) {
  return (
    <section className="studio-world" aria-labelledby="studio-title">
      <div className="studio-world__intro">
        <span className="console-kicker"><i />DANIEL MATEI / DIGITAL PRODUCT ENGINEERING</span>
        <h1 id="studio-title">One place to define,<br />shape, and build the product.</h1>
        <p>The studio combines product thinking, interface design, engineering, and launch planning. The creation console collects the context first so the initial conversation can begin with the real decisions.</p>
        <button type="button" onClick={onStart}>Open the creation console <i>→</i></button>
      </div>

      <div className="studio-world__core"><AgentCore state="idle" label="STUDIO LINK" /></div>

      <div className="studio-capabilities">
        <header><span><i />CAPABILITY FIELD</span><strong>What the engagement can cover</strong></header>
        <div>
          <article><span>01</span><h2>Product definition</h2><p>Clarify the audience, essential journey, release scope, risks, and the decisions that must be made before production.</p><small>DISCOVERY · FLOWS · MVP · ROADMAP</small></article>
          <article><span>02</span><h2>Experience design</h2><p>Turn product behavior into a coherent interface system across screens, states, devices, motion, and accessibility.</p><small>UX · UI · PROTOTYPES · MOTION</small></article>
          <article><span>03</span><h2>Engineering</h2><p>Build the working product, connect its services, handle responsive behavior, and prepare it for a real launch.</p><small>FRONTEND · SYSTEMS · INTEGRATIONS · RELEASE</small></article>
          <article><span>04</span><h2>Evolution</h2><p>Measure what happens after release, improve weak points, extend the system, and keep the product maintainable.</p><small>ANALYTICS · ITERATION · SUPPORT · HANDOFF</small></article>
        </div>
      </div>

      <div className="studio-process">
        <header><span><i />ENGAGEMENT SEQUENCE</span><strong>How a mission moves forward</strong></header>
        <ol>
          <li><span>01</span><div><strong>Brief the mission</strong><p>Use the console to capture the problem, audience, desired behavior, constraints, scope, and delivery context.</p></div></li>
          <li><span>02</span><div><strong>Resolve the unknowns</strong><p>Review the generated blueprint together and identify assumptions that need evidence or a technical decision.</p></div></li>
          <li><span>03</span><div><strong>Define the first release</strong><p>Turn the validated context into a concrete scope, sequence, responsibilities, and proposal.</p></div></li>
          <li><span>04</span><div><strong>Design and build</strong><p>Work through visible milestones with working states, decisions, and feedback rather than a hidden production phase.</p></div></li>
          <li><span>05</span><div><strong>Launch and continue</strong><p>Prepare the release, transfer knowledge, observe the product in use, and decide what deserves the next iteration.</p></div></li>
        </ol>
      </div>

      <footer className="studio-world__footer">
        <div><span>READY WHEN THE IDEA IS</span><h2>Start with the mission, not a generic contact form.</h2></div>
        <button type="button" onClick={onStart}>Define a product <i>→</i></button>
      </footer>
    </section>
  )
}
