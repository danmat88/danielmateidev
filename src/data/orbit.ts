export type OrbitCard = {
  eyebrow: string
  title: string
  copy: string
  colors: [string, string]
}

export type OrbitCarouselConfig = {
  cardWidth: number
  cardHeight: number
  radius: number
  perspective: number
  tilt: number
  cardRadius: number
  accent: string
  background: string
  speed: number
  autoplay: boolean
  reverse: boolean
  pauseOnHover: boolean
  showControls: boolean
  showDots: boolean
}

export const defaultOrbitConfig: OrbitCarouselConfig = {
  cardWidth: 238,
  cardHeight: 318,
  radius: 300,
  perspective: 1180,
  tilt: -7,
  cardRadius: 24,
  accent: '#65f0bd',
  background: '#060b0d',
  speed: 4.8,
  autoplay: true,
  reverse: false,
  pauseOnHover: true,
  showControls: true,
  showDots: true,
}

export const orbitCards: OrbitCard[] = [
  { eyebrow: 'FIELD / 01', title: 'Aether', copy: 'An atmosphere shaped by light, depth, and deliberate motion.', colors: ['#103d36', '#67efbd'] },
  { eyebrow: 'FIELD / 02', title: 'Vanta', copy: 'Deep material surfaces with a sharp violet energy signature.', colors: ['#161129', '#a879ff'] },
  { eyebrow: 'FIELD / 03', title: 'Solaris', copy: 'Warm orbital gradients built for launch moments and stories.', colors: ['#3b1b17', '#ff9566'] },
  { eyebrow: 'FIELD / 04', title: 'Glacier', copy: 'A crisp, technical world with calm directional movement.', colors: ['#0d2b38', '#67d8ff'] },
  { eyebrow: 'FIELD / 05', title: 'Lumen', copy: 'Soft electric color arranged around a precise visual core.', colors: ['#2d1533', '#f183ff'] },
  { eyebrow: 'FIELD / 06', title: 'Signal', copy: 'High-contrast surfaces tuned for product and editorial cards.', colors: ['#27320d', '#d5ff62'] },
]
