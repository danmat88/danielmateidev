import { useCallback, useEffect, useRef } from 'react'

export type InterfaceCue = 'navigate' | 'scene' | 'activate' | 'deactivate' | 'performance'

type Voice = {
  type: OscillatorType
  frequency: number
  endFrequency: number
  delay?: number
  duration: number
  volume: number
}

const cues: Record<InterfaceCue, Voice[]> = {
  navigate: [
    { type: 'sine', frequency: 360, endFrequency: 520, duration: 0.07, volume: 0.34 },
    { type: 'triangle', frequency: 720, endFrequency: 610, delay: 0.018, duration: 0.055, volume: 0.12 },
  ],
  scene: [
    { type: 'sine', frequency: 180, endFrequency: 430, duration: 0.16, volume: 0.32 },
    { type: 'triangle', frequency: 540, endFrequency: 820, delay: 0.045, duration: 0.13, volume: 0.16 },
  ],
  activate: [
    { type: 'sine', frequency: 240, endFrequency: 480, duration: 0.2, volume: 0.3 },
    { type: 'triangle', frequency: 480, endFrequency: 840, delay: 0.065, duration: 0.18, volume: 0.16 },
  ],
  deactivate: [
    { type: 'sine', frequency: 440, endFrequency: 160, duration: 0.18, volume: 0.25 },
    { type: 'triangle', frequency: 660, endFrequency: 230, delay: 0.025, duration: 0.14, volume: 0.1 },
  ],
  performance: [
    { type: 'square', frequency: 150, endFrequency: 210, duration: 0.09, volume: 0.09 },
    { type: 'sine', frequency: 410, endFrequency: 300, delay: 0.035, duration: 0.12, volume: 0.24 },
  ],
}

class InterfaceAudioEngine {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private enabled = false

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  async unlock() {
    if (!this.context) {
      this.context = new AudioContext({ latencyHint: 'interactive' })
      const compressor = this.context.createDynamicsCompressor()
      compressor.threshold.value = -22
      compressor.knee.value = 16
      compressor.ratio.value = 5
      compressor.attack.value = 0.003
      compressor.release.value = 0.14
      this.master = this.context.createGain()
      this.master.gain.value = 0.14
      this.master.connect(compressor)
      compressor.connect(this.context.destination)
    }
    if (this.context.state === 'suspended') await this.context.resume()
  }

  async play(cue: InterfaceCue, force = false) {
    if (!this.enabled && !force) return
    await this.unlock()
    if (!this.context || !this.master) return
    const now = this.context.currentTime

    cues[cue].forEach((voice) => {
      if (!this.context || !this.master) return
      const startsAt = now + (voice.delay ?? 0)
      const endsAt = startsAt + voice.duration
      const oscillator = this.context.createOscillator()
      const gain = this.context.createGain()
      oscillator.type = voice.type
      oscillator.frequency.setValueAtTime(voice.frequency, startsAt)
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, voice.endFrequency), endsAt)
      gain.gain.setValueAtTime(0.0001, startsAt)
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, voice.volume), startsAt + Math.min(0.018, voice.duration * 0.25))
      gain.gain.exponentialRampToValueAtTime(0.0001, endsAt)
      oscillator.connect(gain)
      gain.connect(this.master)
      oscillator.start(startsAt)
      oscillator.stop(endsAt + 0.01)
    })
  }
}

export function useInterfaceAudio(enabled: boolean) {
  const engineRef = useRef<InterfaceAudioEngine | null>(null)
  if (!engineRef.current) engineRef.current = new InterfaceAudioEngine()

  useEffect(() => {
    engineRef.current?.setEnabled(enabled)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const unlock = () => void engineRef.current?.unlock()
    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [enabled])

  const play = useCallback((cue: InterfaceCue) => {
    void engineRef.current?.play(cue)
  }, [])

  const enable = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.setEnabled(true)
    void engine.play('activate', true)
  }, [])

  const disable = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    void engine.play('deactivate', true)
    engine.setEnabled(false)
  }, [])

  return { play, enable, disable }
}
