import { useEffect, useRef, useState } from 'react'

type CodeBackgroundProps = {
  active: boolean
  effectsEnabled: boolean
  onReady?: () => void
}

const codeRows = [
  ['const', ' interface', ' = ', 'await', ' initialize();'],
  ['function', ' render', '(scene) {'],
  ['  return', ' pipeline', '.compose();'],
  ['if', ' (signal.ready) ', 'deploy', '();'],
  ['type', ' SystemState', ' = ', '{ online: true }'],
  ['export', ' default', ' createWorld', '();'],
]

const syntaxColors = ['#6ee7b7', '#c4b5fd', '#7dd3fc', '#9ca3af', '#f8fafc']

function seeded(index: number) {
  const value = Math.sin(index * 91.733) * 43758.5453
  return value - Math.floor(value)
}

export function CodeBackground({ active, effectsEnabled, onReady }: CodeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) {
      setReady(true)
      onReady?.()
      return
    }

    let frame = 0
    let lastFrame = 0
    let width = 0
    let height = 0
    const startedAt = performance.now()

    const draw = (now = startedAt) => {
      if (effectsEnabled && now - lastFrame < 50) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrame = now
      const time = effectsEnabled ? (now - startedAt) / 1000 : 0
      context.setTransform(canvas.width / Math.max(1, width), 0, 0, canvas.height / Math.max(1, height), 0, 0)

      const foundation = context.createLinearGradient(0, 0, width, height)
      foundation.addColorStop(0, '#010706')
      foundation.addColorStop(0.48, '#030711')
      foundation.addColorStop(1, '#06030d')
      context.fillStyle = foundation
      context.fillRect(0, 0, width, height)

      const glow = context.createRadialGradient(width * 0.5, height * 0.34, 0, width * 0.5, height * 0.34, Math.max(width, height) * 0.6)
      glow.addColorStop(0, 'rgba(36, 211, 163, .11)')
      glow.addColorStop(0.42, 'rgba(93, 69, 190, .055)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      context.lineWidth = 1
      for (let x = 0; x <= width; x += 48) {
        context.strokeStyle = x % 192 === 0 ? 'rgba(52, 211, 153, .075)' : 'rgba(52, 211, 153, .025)'
        context.beginPath()
        context.moveTo(x + 0.5, 0)
        context.lineTo(x + 0.5, height)
        context.stroke()
      }
      for (let y = 0; y <= height; y += 36) {
        context.strokeStyle = y % 144 === 0 ? 'rgba(139, 92, 246, .07)' : 'rgba(139, 92, 246, .022)'
        context.beginPath()
        context.moveTo(0, y + 0.5)
        context.lineTo(width, y + 0.5)
        context.stroke()
      }

      const columnCount = Math.max(8, Math.floor(width / 130))
      context.font = '11px "IBM Plex Mono", Consolas, monospace'
      context.textBaseline = 'middle'
      for (let column = 0; column < columnCount; column += 1) {
        const x = (column + 0.5) * (width / columnCount)
        const speed = 14 + seeded(column) * 24
        for (let row = 0; row < 9; row += 1) {
          const y = ((row * 94 + time * speed + seeded(column * 17 + row) * 150) % (height + 150)) - 75
          const token = ['{ }', '01', '</>', '=>', '::', '[]', 'RUN'][Math.floor(seeded(column * 31 + row) * 7)]
          context.fillStyle = column % 3 === 0 ? 'rgba(110, 231, 183, .18)' : column % 3 === 1 ? 'rgba(196, 181, 253, .15)' : 'rgba(125, 211, 252, .13)'
          context.fillText(token, x, y)
        }
      }

      const editorWidth = Math.min(width * 0.56, 760)
      const editorHeight = Math.min(height * 0.42, 360)
      const editorX = (width - editorWidth) / 2
      const editorY = Math.max(112, height * 0.22)
      context.fillStyle = 'rgba(2, 8, 12, .38)'
      context.strokeStyle = 'rgba(110, 231, 183, .12)'
      context.fillRect(editorX, editorY, editorWidth, editorHeight)
      context.strokeRect(editorX + 0.5, editorY + 0.5, editorWidth - 1, editorHeight - 1)

      context.fillStyle = 'rgba(110, 231, 183, .18)'
      context.fillRect(editorX, editorY, editorWidth, 1)
      context.fillStyle = 'rgba(196, 181, 253, .16)'
      context.fillRect(editorX + editorWidth * 0.58, editorY, editorWidth * 0.22, 1)

      const rowHeight = Math.min(34, editorHeight / 8)
      codeRows.forEach((segments, rowIndex) => {
        let cursorX = editorX + 38
        const rowY = editorY + 48 + rowIndex * rowHeight
        context.globalAlpha = 0.21 + (rowIndex === Math.floor(time * 0.75) % codeRows.length ? 0.09 : 0)
        segments.forEach((segment, segmentIndex) => {
          context.fillStyle = syntaxColors[segmentIndex % syntaxColors.length]
          context.fillText(segment, cursorX, rowY)
          cursorX += context.measureText(segment).width
        })
      })
      context.globalAlpha = 1

      const scanY = editorY + ((time * 42) % Math.max(1, editorHeight))
      const scan = context.createLinearGradient(editorX, 0, editorX + editorWidth, 0)
      scan.addColorStop(0, 'rgba(16, 185, 129, 0)')
      scan.addColorStop(0.5, 'rgba(110, 231, 183, .16)')
      scan.addColorStop(1, 'rgba(139, 92, 246, 0)')
      context.fillStyle = scan
      context.fillRect(editorX, scanY, editorWidth, 1)

      const vignette = context.createRadialGradient(width / 2, height / 2, height * 0.1, width / 2, height / 2, Math.max(width, height) * 0.72)
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignette.addColorStop(1, 'rgba(0, 0, 0, .72)')
      context.fillStyle = vignette
      context.fillRect(0, 0, width, height)

      if (active && effectsEnabled) frame = requestAnimationFrame(draw)
    }

    const resize = () => {
      width = innerWidth
      height = innerHeight
      const mobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches
      const pixelBudget = effectsEnabled ? (mobile ? 420_000 : 900_000) : 320_000
      const budgetRatio = Math.sqrt(pixelBudget / Math.max(1, width * height))
      const pixelRatio = Math.min(devicePixelRatio || 1, budgetRatio, effectsEnabled ? (mobile ? 0.68 : 0.86) : 0.55)
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      cancelAnimationFrame(frame)
      draw(performance.now())
    }

    resize()
    let readyFrame = requestAnimationFrame(() => {
      setReady(true)
      readyFrame = requestAnimationFrame(() => onReady?.())
    })
    addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(readyFrame)
      removeEventListener('resize', resize)
    }
  }, [active, effectsEnabled, onReady])

  return <canvas ref={canvasRef} className={`app-background app-background--code${ready ? ' is-ready' : ''}${active ? ' is-active' : ''}`} aria-hidden="true" />
}
