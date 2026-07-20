import { useEffect, useState } from 'react'
import { defaultOrbitConfig, orbitCards, type OrbitCard, type OrbitCarouselConfig } from '../data/orbit'
import { AgentCore } from './AgentCore'
import { OrbitCarousel } from './OrbitCarousel'

export type ComponentPreset = {
  id: string
  name: string
  config: OrbitCarouselConfig
  cards: OrbitCard[]
  updatedAt: number
}

type ProductTab = 'showcase' | 'customize' | 'install' | 'docs'
type ControlGroup = 'content' | 'geometry' | 'materials' | 'motion' | 'controls'
type PreviewDevice = 'desktop' | 'tablet' | 'phone'

type ComponentLabProps = {
  restoredPreset?: ComponentPreset | null
  onSave: (preset: ComponentPreset) => void
  onNavigate?: () => void
}

const productTabs: Array<{ id: ProductTab; label: string; meta: string }> = [
  { id: 'showcase', label: 'Showcase', meta: 'Experience it' },
  { id: 'customize', label: 'Customize', meta: 'Shape the system' },
  { id: 'install', label: 'Install', meta: 'Delivery path' },
  { id: 'docs', label: 'Documentation', meta: 'Use it correctly' },
]

const controlGroups: Array<{ id: ControlGroup; label: string }> = [
  { id: 'content', label: 'Content' },
  { id: 'geometry', label: 'Geometry' },
  { id: 'materials', label: 'Materials' },
  { id: 'motion', label: 'Motion' },
  { id: 'controls', label: 'Controls' },
]

function RangeControl({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  return (
    <label className="lab-range">
      <span><b>{label}</b><output>{value}{unit}</output></span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function ToggleControl({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="lab-toggle">
      <span><b>{label}</b><small>{detail}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  )
}

export function ComponentLab({ restoredPreset, onSave, onNavigate }: ComponentLabProps) {
  const [tab, setTab] = useState<ProductTab>(() => {
    const requested = new URLSearchParams(window.location.search).get('tab')
    return requested === 'customize' || requested === 'install' || requested === 'docs' ? requested : 'showcase'
  })
  const [group, setGroup] = useState<ControlGroup>('content')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [config, setConfig] = useState<OrbitCarouselConfig>(restoredPreset?.config ?? defaultOrbitConfig)
  const [cards, setCards] = useState<OrbitCard[]>(restoredPreset?.cards ?? orbitCards)
  const [presetName, setPresetName] = useState(restoredPreset?.name ?? 'My Orbit configuration')
  const [saveNotice, setSaveNotice] = useState(false)
  const [deliveryNotice, setDeliveryNotice] = useState(false)

  useEffect(() => {
    if (!restoredPreset) return
    setConfig(restoredPreset.config)
    setCards(restoredPreset.cards)
    setPresetName(restoredPreset.name)
    setTab('customize')
  }, [restoredPreset])

  const updateConfig = <Key extends keyof OrbitCarouselConfig>(key: Key, value: OrbitCarouselConfig[Key]) => {
    setConfig((current) => ({ ...current, [key]: value }))
  }

  const updateCard = (index: number, patch: Partial<OrbitCard>) => {
    setCards((current) => current.map((card, cardIndex) => cardIndex === index ? { ...card, ...patch } : card))
  }

  const savePreset = () => {
    onSave({ id: `orbit-${Date.now()}`, name: presetName.trim() || 'Orbit configuration', config, cards, updatedAt: Date.now() })
    setSaveNotice(true)
    window.setTimeout(() => setSaveNotice(false), 1400)
    onNavigate?.()
  }

  const exportPreset = () => {
    const blob = new Blob([JSON.stringify({ component: 'Orbit Cards', version: 1, config, cards }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'orbit-cards-preset.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const selectTab = (next: ProductTab) => {
    setTab(next)
    onNavigate?.()
  }

  return (
    <section className="component-world" aria-label="Orbit Cards component laboratory">
      <header className="product-command-bar">
        <div className="product-command-bar__identity">
          <span>01</span>
          <div><small>COMPONENT / INTERACTION</small><strong>Orbit Cards</strong></div>
          <i>LIVE</i>
        </div>
        <nav role="tablist" aria-label="Orbit Cards views">
          {productTabs.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'is-active' : ''} onClick={() => selectTab(item.id)}>
              <strong>{item.label}</strong><small>{item.meta}</small>
            </button>
          ))}
        </nav>
        <div className="product-command-bar__actions">
          <button type="button" onClick={savePreset}>{saveNotice ? 'SAVED ✓' : 'SAVE DESIGN'}</button>
          <button type="button" className="is-primary" onClick={() => setDeliveryNotice(true)}>BUY & DOWNLOAD</button>
        </div>
      </header>

      {tab === 'showcase' && (
        <div className="product-showcase" role="tabpanel">
          <div className="product-showcase__copy">
            <span className="console-kicker"><i />INTERACTIVE COMPONENT / 001</span>
            <h1>Cards with depth,<br /><em>gravity, and presence.</em></h1>
            <p>Orbit Cards is a tactile 3D carousel for products, stories, portfolios, and visual collections. Drag it, use the arrow keys, or let the system move on its own.</p>
            <div className="product-showcase__badges"><span>3D GEOMETRY</span><span>DRAG CONTROL</span><span>RESPONSIVE</span><span>REDUCED MOTION</span></div>
            <div className="product-showcase__buttons">
              <button type="button" className="is-primary" onClick={() => selectTab('customize')}>Customize this system <i>→</i></button>
              <button type="button" onClick={() => selectTab('docs')}>Read documentation</button>
            </div>
          </div>
          <div className="product-showcase__stage"><OrbitCarousel config={config} cards={cards} /></div>
          <aside className="product-showcase__telemetry">
            <span><small>CARDS</small><strong>{cards.length.toString().padStart(2, '0')}</strong></span>
            <span><small>INPUTS</small><strong>04</strong><i>DRAG / TOUCH / KEYS / AUTO</i></span>
            <span><small>STATE</small><strong>LIVE</strong></span>
          </aside>
        </div>
      )}

      {tab === 'customize' && (
        <div className="component-customizer" role="tabpanel">
          <aside className="component-customizer__controls">
            <header><span><i />CONFIGURATION MATRIX</span><strong>Shape Orbit Cards</strong><p>Every change is applied to the live system without reloading the experience.</p></header>
            <nav aria-label="Customization groups">
              {controlGroups.map((item, index) => <button key={item.id} type="button" className={group === item.id ? 'is-active' : ''} onClick={() => setGroup(item.id)}><span>0{index + 1}</span>{item.label}</button>)}
            </nav>
            <div className="component-controls-panel">
              {group === 'content' && (
                <div className="card-content-editor">
                  {cards.map((card, index) => (
                    <details key={`${card.title}-${index}`} open={index === 0}>
                      <summary><span style={{ background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})` }} /><b>Card {String(index + 1).padStart(2, '0')}</b><i>+</i></summary>
                      <label><span>Eyebrow</span><input value={card.eyebrow} onChange={(event) => updateCard(index, { eyebrow: event.target.value })} /></label>
                      <label><span>Title</span><input value={card.title} onChange={(event) => updateCard(index, { title: event.target.value })} /></label>
                      <label><span>Description</span><textarea rows={3} value={card.copy} onChange={(event) => updateCard(index, { copy: event.target.value })} /></label>
                      <div className="card-content-editor__colors">
                        <label><span>Surface</span><input type="color" value={card.colors[0]} onChange={(event) => updateCard(index, { colors: [event.target.value, card.colors[1]] })} /></label>
                        <label><span>Energy</span><input type="color" value={card.colors[1]} onChange={(event) => updateCard(index, { colors: [card.colors[0], event.target.value] })} /></label>
                      </div>
                    </details>
                  ))}
                </div>
              )}
              {group === 'geometry' && <div className="control-stack">
                <RangeControl label="Card width" value={config.cardWidth} min={180} max={320} unit="px" onChange={(value) => updateConfig('cardWidth', value)} />
                <RangeControl label="Card height" value={config.cardHeight} min={240} max={420} unit="px" onChange={(value) => updateConfig('cardHeight', value)} />
                <RangeControl label="Orbit radius" value={config.radius} min={200} max={520} unit="px" onChange={(value) => updateConfig('radius', value)} />
                <RangeControl label="Perspective" value={config.perspective} min={700} max={1800} unit="px" onChange={(value) => updateConfig('perspective', value)} />
                <RangeControl label="Stage tilt" value={config.tilt} min={-18} max={12} unit="°" onChange={(value) => updateConfig('tilt', value)} />
              </div>}
              {group === 'materials' && <div className="control-stack">
                <RangeControl label="Corner radius" value={config.cardRadius} min={0} max={48} unit="px" onChange={(value) => updateConfig('cardRadius', value)} />
                <label className="lab-color"><span><b>Interface accent</b><small>Controls and active signals</small></span><input type="color" value={config.accent} onChange={(event) => updateConfig('accent', event.target.value)} /></label>
                <label className="lab-color"><span><b>Stage background</b><small>Atmosphere behind the cards</small></span><input type="color" value={config.background} onChange={(event) => updateConfig('background', event.target.value)} /></label>
              </div>}
              {group === 'motion' && <div className="control-stack">
                <ToggleControl label="Autoplay" detail="Advance the orbit automatically" checked={config.autoplay} onChange={(value) => updateConfig('autoplay', value)} />
                <RangeControl label="Interval" value={config.speed} min={1.5} max={12} step={0.1} unit="s" onChange={(value) => updateConfig('speed', value)} />
                <ToggleControl label="Reverse orbit" detail="Change the automatic direction" checked={config.reverse} onChange={(value) => updateConfig('reverse', value)} />
                <ToggleControl label="Pause on hover" detail="Give pointer users control" checked={config.pauseOnHover} onChange={(value) => updateConfig('pauseOnHover', value)} />
              </div>}
              {group === 'controls' && <div className="control-stack">
                <ToggleControl label="Arrow controls" detail="Previous and next actions" checked={config.showControls} onChange={(value) => updateConfig('showControls', value)} />
                <ToggleControl label="Position dots" detail="Direct card selection" checked={config.showDots} onChange={(value) => updateConfig('showDots', value)} />
                <div className="control-assurance"><span>ALWAYS ACTIVE</span><strong>Touch drag</strong><strong>Pointer drag</strong><strong>Keyboard arrows</strong><strong>Reduced-motion fallback</strong></div>
              </div>}
            </div>
          </aside>

          <main className="component-customizer__preview">
            <div className="preview-toolbar" role="toolbar" aria-label="Preview controls">
              <span><i />LIVE PREVIEW</span>
              <div>
                {(['desktop', 'tablet', 'phone'] as PreviewDevice[]).map((device) => (
                  <button key={device} type="button" className={previewDevice === device ? 'is-active' : ''} onClick={() => setPreviewDevice(device)}>{device}</button>
                ))}
              </div>
              <button type="button" onClick={() => { setConfig(defaultOrbitConfig); setCards(orbitCards) }}>Reset</button>
            </div>
            <div className={`preview-stage is-${previewDevice}`}><div className="preview-device-frame"><OrbitCarousel config={config} cards={cards} compact /></div></div>
            <div className="preview-agent"><AgentCore compact state="linked" label="DESIGN LINK" /><p><span>CONFIGURATION RESPONSE</span>Your changes are being applied directly to the live geometry. Save the design when the system feels right.</p></div>
          </main>

          <aside className="component-customizer__output">
            <header><span><i />DESIGN OUTPUT</span><strong>Current configuration</strong></header>
            <label><span>Configuration name</span><input value={presetName} onChange={(event) => setPresetName(event.target.value)} /></label>
            <dl>
              <div><dt>Geometry</dt><dd>{config.cardWidth} × {config.cardHeight}</dd></div>
              <div><dt>Orbit</dt><dd>{config.radius}px</dd></div>
              <div><dt>Motion</dt><dd>{config.autoplay ? `${config.speed}s auto` : 'Manual'}</dd></div>
              <div><dt>Cards</dt><dd>{cards.length}</dd></div>
              <div><dt>Controls</dt><dd>{config.showControls || config.showDots ? 'Visible' : 'Gesture only'}</dd></div>
            </dl>
            <div className="component-customizer__actions">
              <button type="button" onClick={savePreset}>{saveNotice ? 'SAVED TO SESSION ✓' : 'SAVE DESIGN'}</button>
              <button type="button" onClick={exportPreset}>EXPORT PRESET</button>
              <button type="button" className="is-primary" onClick={() => setDeliveryNotice(true)}>BUY SOURCE PACKAGE</button>
            </div>
            <small>Preset export is functional. Source delivery will be connected only after its target format and commerce system are approved.</small>
          </aside>
        </div>
      )}

      {tab === 'install' && (
        <div className="product-document" role="tabpanel">
          <aside><span>INSTALLATION</span><nav><button className="is-active">Delivery model</button><button>Package anatomy</button><button>Integration</button><button>Updates</button></nav></aside>
          <main>
            <span className="console-kicker"><i />SOURCE DELIVERY</span>
            <h1>Code you can understand, own, and adapt.</h1>
            <p className="product-document__lead">Orbit Cards will be delivered as editable source, not as a locked visual embed. The exact framework package has intentionally not been declared until the supported target is chosen.</p>
            <section><h2>Required delivery standard</h2><div className="document-grid"><article><span>01</span><strong>Component source</strong><p>Readable implementation files with no hidden runtime dependency on this store.</p></article><article><span>02</span><strong>Styles and tokens</strong><p>Scoped styles, documented variables, and safe defaults.</p></article><article><span>03</span><strong>Working example</strong><p>A complete example using realistic data and every supported control.</p></article><article><span>04</span><strong>Integration guide</strong><p>Exact installation, compatibility, troubleshooting, and update instructions.</p></article></div></section>
            <section className="document-callout"><span>DELIVERY DECISION REQUIRED</span><h2>No framework has been silently selected.</h2><p>The production download must be built and tested for an explicitly approved target—such as framework-native source, a standards-based web component, or another platform package. The current console exports the complete visual configuration without pretending the final source package already exists.</p></section>
          </main>
        </div>
      )}

      {tab === 'docs' && (
        <div className="product-document" role="tabpanel">
          <aside><span>ORBIT CARDS / DOCS</span><nav><button className="is-active">Overview</button><button>Content model</button><button>Configuration</button><button>Interaction</button><button>Accessibility</button><button>Troubleshooting</button></nav></aside>
          <main>
            <span className="console-kicker"><i />DOCUMENTATION / VERSION 0.1</span>
            <h1>Orbit Cards system guide.</h1>
            <p className="product-document__lead">The documentation describes behavior and requirements independently from the eventual package technology.</p>
            <section><h2>Interaction contract</h2><div className="document-grid"><article><span>POINTER</span><strong>Drag the orbit</strong><p>Horizontal dragging advances or reverses the selected card.</p></article><article><span>TOUCH</span><strong>Swipe naturally</strong><p>Touch input uses the same direct manipulation model without page interference.</p></article><article><span>KEYBOARD</span><strong>Arrow navigation</strong><p>Left and Right Arrow change the active card while the carousel is focused.</p></article><article><span>AUTO</span><strong>Optional progression</strong><p>Autoplay can pause on hover and must stop when reduced motion is requested.</p></article></div></section>
            <section><h2>Configuration surface</h2><div className="document-table"><div><b>Content</b><span>Eyebrow, title, description, surface color, energy color</span></div><div><b>Geometry</b><span>Card width, height, orbit radius, perspective, tilt</span></div><div><b>Materials</b><span>Corner radius, interface accent, stage background</span></div><div><b>Motion</b><span>Autoplay, interval, direction, hover pause</span></div><div><b>Controls</b><span>Arrows, position dots, drag, keyboard</span></div></div></section>
            <section><h2>Accessibility requirements</h2><ul className="document-list"><li>One active card is exposed to assistive technology at a time.</li><li>Every control has an accessible name and visible focus state.</li><li>Keyboard navigation does not trap focus inside the carousel.</li><li>Autoplay respects reduced-motion preferences and user interaction.</li><li>Card content retains usable contrast independently from decorative effects.</li></ul></section>
          </main>
        </div>
      )}

      {deliveryNotice && (
        <div className="console-dialog-backdrop" role="presentation" onMouseDown={() => setDeliveryNotice(false)}>
          <section className="console-dialog" role="dialog" aria-modal="true" aria-labelledby="delivery-title" onMouseDown={(event) => event.stopPropagation()}>
            <AgentCore compact state="working" label="DELIVERY GATE" />
            <span className="console-kicker"><i />SOURCE PACKAGE</span>
            <h2 id="delivery-title">Commerce is not connected yet.</h2>
            <p>The design, saving system, configuration export, interaction, and documentation are real. Payment entitlement and the final code format require explicit provider and platform decisions, so this prototype does not fake a successful purchase.</p>
            <div><button type="button" onClick={() => { setDeliveryNotice(false); selectTab('install') }}>Review delivery requirements</button><button type="button" className="is-primary" onClick={() => setDeliveryNotice(false)}>Return to component</button></div>
          </section>
        </div>
      )}
    </section>
  )
}
