import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { orbitCards, type OrbitCard, type OrbitCarouselConfig } from '../data/orbit'

type OrbitCarouselProps = {
  config: OrbitCarouselConfig
  cards?: OrbitCard[]
  compact?: boolean
}

export function OrbitCarousel({ config, cards = orbitCards, compact = false }: OrbitCarouselProps) {
  const [active, setActive] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [fitScale, setFitScale] = useState(1)
  const viewport = useRef<HTMLDivElement | null>(null)
  const drag = useRef<{ pointerId: number; startX: number; lastX: number } | null>(null)
  const step = 360 / cards.length
  const controlsReserve = config.showControls ? (compact ? 76 : 92) : config.showDots ? 42 : 28
  const sceneDepth = Math.min(config.radius, config.perspective - 1)
  const renderedDepth = sceneDepth * fitScale
  const renderedProjection = config.perspective / Math.max(1, config.perspective - renderedDepth)
  const tiltOffset = Math.sin(config.tilt * Math.PI / 180) * renderedDepth * renderedProjection

  const move = useCallback((direction: number) => {
    setActive((current) => (current + direction + cards.length) % cards.length)
    setDragOffset(0)
  }, [cards.length])

  useEffect(() => {
    if (!config.autoplay || (config.pauseOnHover && hovered) || drag.current) return
    const timer = window.setInterval(() => move(config.reverse ? -1 : 1), config.speed * 1000)
    return () => window.clearInterval(timer)
  }, [config.autoplay, config.pauseOnHover, config.reverse, config.speed, hovered, move])

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const previewStage = element.closest<HTMLElement>('.preview-stage')
    const previewWorkspace = element.closest<HTMLElement>('.component-customizer__preview')
    let frame = 0

    const fitScene = () => {
      const elementBounds = element.getBoundingClientRect()
      const parentBounds = element.parentElement?.getBoundingClientRect()
      const stageStyles = previewStage ? window.getComputedStyle(previewStage) : null
      const stageWidth = previewStage && stageStyles
        ? previewStage.clientWidth - Number.parseFloat(stageStyles.paddingLeft) - Number.parseFloat(stageStyles.paddingRight)
        : 0
      const stageHeight = previewStage && stageStyles
        ? previewStage.clientHeight - Number.parseFloat(stageStyles.paddingTop) - Number.parseFloat(stageStyles.paddingBottom)
        : 0
      const workspaceToolbar = previewWorkspace?.querySelector<HTMLElement>(':scope > .preview-toolbar')
      const workspaceAgent = previewWorkspace?.querySelector<HTMLElement>(':scope > .preview-agent')
      const workspaceWidth = previewWorkspace && stageStyles
        ? previewWorkspace.clientWidth - Number.parseFloat(stageStyles.paddingLeft) - Number.parseFloat(stageStyles.paddingRight)
        : 0
      const workspaceHeight = previewWorkspace && stageStyles
        ? previewWorkspace.clientHeight
          - (workspaceToolbar?.offsetHeight ?? 0)
          - (workspaceAgent?.offsetHeight ?? 0)
          - Number.parseFloat(stageStyles.paddingTop)
          - Number.parseFloat(stageStyles.paddingBottom)
        : 0
      const width = Math.max(elementBounds.width, parentBounds?.width ?? 0, stageWidth, workspaceWidth)
      const height = Math.max(elementBounds.height, parentBounds?.height ?? 0, stageHeight, workspaceHeight)
      if (!width || !height) return

      // translateZ enlarges the active card under perspective. Fit the projected
      // card, not its untransformed CSS dimensions, and reserve space for UI.
      const horizontalReserve = compact ? 24 : 40
      const effectiveControlsReserve = compact && config.showControls
        ? Math.min(controlsReserve, Math.max(48, height * 0.34))
        : controlsReserve
      if (width <= horizontalReserve || height <= effectiveControlsReserve) return
      const availableWidth = Math.max(1, width - horizontalReserve)
      const availableHeight = Math.max(1, height - effectiveControlsReserve)
      const horizontalScale = availableWidth * config.perspective
        / (config.perspective * config.cardWidth + availableWidth * sceneDepth)
      const verticalScale = availableHeight * config.perspective
        / (config.perspective * config.cardHeight + availableHeight * sceneDepth)
      const nextScale = Math.min(
        1,
        horizontalScale,
        verticalScale,
      )
      const safeScale = Math.max(0.06, Number.isFinite(nextScale) ? nextScale : 1)

      setFitScale((current) => Math.abs(current - safeScale) > 0.005 ? safeScale : current)
    }

    const scheduleFit = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(fitScene)
    }

    scheduleFit()
    const settleTimers = [
      window.setTimeout(scheduleFit, 120),
      window.setTimeout(scheduleFit, 480),
    ]
    const observer = new ResizeObserver(scheduleFit)
    observer.observe(element)
    if (element.parentElement) observer.observe(element.parentElement)
    if (previewStage) observer.observe(previewStage)
    if (previewWorkspace) observer.observe(previewWorkspace)
    window.addEventListener('resize', scheduleFit)
    return () => {
      settleTimers.forEach((timer) => window.clearTimeout(timer))
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleFit)
      observer.disconnect()
    }
  }, [compact, config.cardHeight, config.cardWidth, config.perspective, config.showControls, controlsReserve, sceneDepth])

  const rotation = -active * step + dragOffset
  const style = useMemo(() => ({
    '--orbit-card-width': `${config.cardWidth}px`,
    '--orbit-card-height': `${config.cardHeight}px`,
    '--orbit-radius': `${config.radius}px`,
    '--orbit-perspective': `${config.perspective}px`,
    '--orbit-tilt': `${config.tilt}deg`,
    '--orbit-card-radius': `${config.cardRadius}px`,
    '--orbit-accent': config.accent,
    '--orbit-background': config.background,
    '--orbit-rotation': `${rotation}deg`,
    '--orbit-fit-scale': fitScale,
    '--orbit-ui-reserve': compact && config.showControls ? 'clamp(48px, 34%, 76px)' : `${controlsReserve}px`,
    '--orbit-tilt-offset': `${tiltOffset}px`,
  }) as CSSProperties, [compact, config, controlsReserve, fitScale, rotation, tiltOffset])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { pointerId: event.pointerId, startX: event.clientX, lastX: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    drag.current.lastX = event.clientX
    setDragOffset((event.clientX - drag.current.startX) * 0.24)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const distance = drag.current.lastX - drag.current.startX
    drag.current = null
    if (Math.abs(distance) > 38) move(distance > 0 ? -1 : 1)
    else setDragOffset(0)
  }

  return (
    <div
      ref={viewport}
      className={`orbit-carousel${compact ? ' is-compact' : ''}${drag.current ? ' is-dragging' : ''}`}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label="Orbit Cards interactive 3D carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') move(-1)
        if (event.key === 'ArrowRight') move(1)
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="orbit-carousel__atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <div className="orbit-carousel__viewport">
        <div className="orbit-carousel__fit">
          <div className="orbit-carousel__ring">
            {cards.map((card, index) => {
              const angle = index * step
              const isActive = index === active
              return (
                <article
                  key={`${card.title}-${index}`}
                  className={`orbit-card${isActive ? ' is-active' : ''}`}
                  style={{
                    '--card-angle': `${angle}deg`,
                    '--card-color-a': card.colors[0],
                    '--card-color-b': card.colors[1],
                  } as CSSProperties}
                  aria-hidden={!isActive}
                >
                  <div className="orbit-card__visual">
                    <span className="orbit-card__grid" />
                    <span className="orbit-card__planet"><i /><b /></span>
                    <span className="orbit-card__coordinates">{String(index + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span>
                  </div>
                  <div className="orbit-card__copy">
                    <small>{card.eyebrow}</small>
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {config.showControls && (
        <div className="orbit-carousel__controls" aria-label="Carousel controls">
          <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => move(-1)} aria-label="Previous card">←</button>
          <span><b>{String(active + 1).padStart(2, '0')}</b><i />{String(cards.length).padStart(2, '0')}</span>
          <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => move(1)} aria-label="Next card">→</button>
        </div>
      )}

      {config.showDots && (
        <div className="orbit-carousel__dots" role="tablist" aria-label="Choose carousel card" onPointerDown={(event) => event.stopPropagation()}>
          {cards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              className={index === active ? 'is-active' : ''}
              onClick={() => { setActive(index); setDragOffset(0) }}
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${card.title}`}
            />
          ))}
        </div>
      )}
      <span className="orbit-carousel__hint" aria-hidden="true">DRAG / ARROW KEYS</span>
    </div>
  )
}
