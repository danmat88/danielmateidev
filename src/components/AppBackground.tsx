import { useEffect, useRef, useState } from 'react'

const vertexShader = `
attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`

const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;

#define PI 3.14159265

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1,0)), f.x),
             mix(hash21(i + vec2(0,1)), hash21(i + vec2(1)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0, amplitude = 0.52;
  mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.03 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

vec3 starLayer(vec2 uv, float scale, float threshold, vec3 tint) {
  vec2 grid = uv * scale;
  vec2 id = floor(grid);
  vec2 gv = fract(grid) - 0.5;
  float seed = hash21(id);
  vec2 offset = vec2(hash21(id + 7.1), hash21(id + 19.3)) - 0.5;
  float distanceToStar = length(gv - offset * 0.72);
  float core = smoothstep(0.026, 0.0, distanceToStar) * step(threshold, seed);
  float halo = smoothstep(0.105, 0.0, distanceToStar) * step(0.982, seed);
  float flare = smoothstep(0.11, 0.0, abs(gv.x - offset.x * 0.72)) *
                smoothstep(0.015, 0.0, abs(gv.y - offset.y * 0.72));
  flare += smoothstep(0.11, 0.0, abs(gv.y - offset.y * 0.72)) *
           smoothstep(0.015, 0.0, abs(gv.x - offset.x * 0.72));
  float pulse = 0.78 + 0.22 * sin(time * (0.35 + seed) + seed * 20.0);
  return tint * (core * (1.45 + seed * 2.55) + halo * 0.11 + flare * 0.18 * step(0.985, seed)) * pulse;
}

vec3 galaxy(vec2 uv, vec2 center, float size, float rotation, vec3 color) {
  vec2 p = uv - center;
  float c = cos(rotation), s = sin(rotation);
  p = mat2(c,-s,s,c) * p;
  p.y *= 3.2;
  float r = length(p) / size;
  float angle = atan(p.y, p.x);
  float arms = pow(max(0.0, 0.5 + 0.5 * cos(angle * 2.0 - r * 14.0)), 5.0);
  float body = exp(-r * 3.8);
  float dust = fbm(p * 38.0 + angle) * 0.6 + 0.4;
  float core = exp(-r * 18.0) * 2.2;
  return color * (body * (0.18 + arms * dust * 0.72) + core);
}

vec3 planet(vec2 uv, vec2 center, float radius, vec3 base, vec2 lightDir) {
  vec2 p = (uv - center) / radius;
  float rr = dot(p,p);
  if (rr > 1.0) return vec3(0.0);
  float z = sqrt(1.0 - rr);
  vec3 normal = normalize(vec3(p, z));
  vec3 light = normalize(vec3(lightDir, 0.65));
  float diffuse = max(0.0, dot(normal, light));
  float limb = pow(z, 0.45);
  float bands = fbm(vec2(atan(p.y,p.x) * 2.0, p.y * 13.0) + 4.0);
  vec3 surface = base * (0.48 + bands * 0.72);
  return surface * diffuse * limb + pow(diffuse, 22.0) * vec3(0.18);
}

vec3 flightDust(vec2 uv) {
  vec3 dust = vec3(0.0);
  // Independent depth sheets create a continuous, slow passage through space.
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float z = fract(fi * 0.143 + time * 0.0075);
    float perspective = mix(7.0, 1.15, z);
    vec2 projected = uv * perspective + vec2(fi * 17.31, fi * 9.73);
    vec2 cell = floor(projected);
    vec2 local = fract(projected) - 0.5;
    float seed = hash21(cell + fi * 31.7);
    vec2 offset = vec2(hash21(cell + 4.2), hash21(cell + 11.8)) - 0.5;
    float mote = smoothstep(0.026 + z * 0.018, 0.0, length(local - offset * 0.74));
    float fade = smoothstep(0.0, 0.2, z) * smoothstep(1.0, 0.76, z);
    vec3 temperature = mix(vec3(0.45,0.65,0.78), vec3(0.78,0.66,0.52), seed);
    dust += temperature * mote * fade * step(0.91, seed) * (0.12 + z * 0.38);
  }
  return dust;
}

vec3 stellarBeacon(vec2 uv, vec2 center) {
  vec2 delta = uv - center;
  float distanceToLight = length(delta);
  float core = exp(-distanceToLight * 760.0) * 5.0;
  float innerGlow = exp(-distanceToLight * 92.0) * 0.72;
  float outerGlow = exp(-distanceToLight * 18.0) * 0.075;
  float horizontal = exp(-abs(delta.y) * 520.0) * exp(-abs(delta.x) * 18.0);
  float vertical = exp(-abs(delta.x) * 680.0) * exp(-abs(delta.y) * 24.0);
  vec2 diagonalSpace = mat2(0.707,-0.707,0.707,0.707) * delta;
  float diagonal = exp(-abs(diagonalSpace.y) * 620.0) * exp(-abs(diagonalSpace.x) * 30.0);
  float shimmer = 0.94 + sin(time * 0.7) * 0.06;
  vec3 warmth = vec3(0.72,0.86,1.0);
  return warmth * (core + innerGlow + outerGlow + horizontal * 0.11 + vertical * 0.08 + diagonal * 0.045) * shimmer;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * resolution) / resolution.y;
  float aspect = resolution.x / resolution.y;
  float portrait = 1.0 - smoothstep(0.62, 0.88, aspect);
  // Foreground objects remain fixed; only distant gas responds to the viewer.
  vec2 drift = (pointer - 0.5) * 0.012;
  vec2 cameraDrift = vec2(sin(time * 0.025), cos(time * 0.019)) * 0.0035;
  vec2 p = uv + cameraDrift;
  vec2 gasP = uv + drift + cameraDrift * 0.5;

  vec3 color = vec3(0.0025, 0.0045, 0.009);

  // Deep, uneven interstellar dust rather than a flat colored gradient.
  float cloudA = fbm(gasP * 2.15 + vec2(time * 0.006, -time * 0.003));
  float cloudB = fbm(gasP * 4.4 - vec2(8.2, 3.7));
  float ridge = pow(max(0.0, cloudA * 1.15 - cloudB * 0.46 - 0.27), 2.2);
  float veil = pow(max(0.0, fbm(gasP * 1.25 + 20.0) - 0.42), 2.0);
  color += ridge * vec3(0.05, 0.23, 0.18) * 1.7;
  color += veil * vec3(0.18, 0.055, 0.28) * 1.25;
  color *= 0.72 + cloudB * 0.48;

  // A fractured galactic dust lane crossing the frame at a natural angle.
  vec2 bandP = mat2(0.82,-0.57,0.57,0.82) * gasP;
  float bandShape = exp(-abs(bandP.y + 0.04) * 7.5);
  float bandDust = fbm(vec2(bandP.x * 3.1, bandP.y * 16.0) + 31.0);
  float darkRifts = smoothstep(0.44, 0.75, fbm(bandP * vec2(5.0, 23.0) - 8.0));
  color += bandShape * bandDust * vec3(0.045,0.075,0.10) * (1.0 - darkRifts * 0.72);

  // Two distant spiral galaxies embedded in the field.
  vec2 galaxyA = mix(vec2(0.34, 0.24), vec2(0.11, 0.27), portrait);
  vec2 galaxyB = mix(vec2(-0.43, -0.25), vec2(-0.14, -0.19), portrait);
  color += galaxy(p + drift * 0.18, galaxyA, mix(0.15, 0.115, portrait), -0.55, vec3(0.22, 0.18, 0.42));
  color += galaxy(p + drift * 0.1, galaxyB, mix(0.095, 0.075, portrait), 0.32, vec3(0.12, 0.30, 0.25)) * 0.72;

  color += starLayer(p, 72.0, 0.955, vec3(0.62,0.73,0.82));
  color += starLayer(p, 138.0, 0.975, vec3(0.72,0.82,1.0)) * 0.65;
  color += starLayer(p, 238.0, 0.988, vec3(1.0,0.78,0.55)) * 0.48;
  color += flightDust(uv);

  // One visual anchor creates hierarchy and softly illuminates surrounding dust.
  vec2 beaconCenter = mix(vec2(0.08, 0.335), vec2(0.09, 0.37), portrait);
  float beaconInfluence = exp(-length(p - beaconCenter) * 5.8);
  float illuminatedDust = pow(max(0.0, fbm((p - beaconCenter) * 8.0 + 44.0) - 0.47), 2.0);
  color += illuminatedDust * beaconInfluence * vec3(0.11,0.16,0.24) * 1.6;
  color += stellarBeacon(p, beaconCenter);

  // A distant world gives the scene scale while leaving space for interface content.
  vec2 planetCenter = mix(vec2(0.47, -0.39), vec2(0.155, -0.405), portrait);
  float planetRadius = mix(0.175, 0.135, portrait);
  vec3 world = planet(p, planetCenter, planetRadius, vec3(0.11,0.16,0.19), vec2(-0.8,0.55));
  float worldMask = 1.0 - smoothstep(0.985, 1.015, length((p - planetCenter) / planetRadius));
  float atmosphere = exp(-abs(length(p - planetCenter) - planetRadius) * 210.0) * 0.18;
  color = mix(color, world, worldMask);
  color += atmosphere * vec3(0.2,0.58,0.63);

  // A remote rust-colored world and tiny moon deepen the field of view.
  vec2 remoteCenter = mix(vec2(-0.43, 0.31), vec2(-0.15, 0.215), portrait);
  float remoteRadius = mix(0.042, 0.033, portrait);
  vec3 remote = planet(p, remoteCenter, remoteRadius, vec3(0.23,0.105,0.055), vec2(-0.65,0.72));
  float remoteMask = 1.0 - smoothstep(0.97, 1.03, length((p - remoteCenter) / remoteRadius));
  color = mix(color, remote, remoteMask);
  vec2 moonCenter = remoteCenter + mix(vec2(0.073, 0.035), vec2(0.052, 0.028), portrait);
  float moonRadius = 0.009;
  vec3 moon = planet(p, moonCenter, moonRadius, vec3(0.30,0.31,0.32), vec2(-0.65,0.72));
  float moonMask = 1.0 - smoothstep(0.92, 1.08, length((p - moonCenter) / moonRadius));
  color = mix(color, moon, moonMask);

  // Extremely faint local scattering ties the worlds and star into one exposure.
  color += pow(max(0.0, 1.0 - length(p - beaconCenter) * 1.35), 4.0) * vec3(0.006,0.012,0.024);

  float vignette = 1.0 - smoothstep(0.38, 1.0, length(uv * vec2(0.72,1.0)));
  color *= 0.48 + vignette * 0.62;
  color = pow(color, vec3(0.82));
  color += (hash21(frag + fract(time)) - 0.5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}
`

type AppBackgroundProps = { onReady?: () => void }

export function AppBackground({ onReady }: AppBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { alpha: false, antialias: false })
    if (!canvas || !gl) return

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('Unable to create WebGL shader')
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation failed')
      return shader
    }

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'resolution')
    const pointer = gl.getUniformLocation(program, 'pointer')
    const clock = gl.getUniformLocation(program, 'time')
    const mobile = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches

    const render = () => {
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform2f(pointer, 0.5, 0.5)
      gl.uniform1f(clock, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.65)
      canvas.width = Math.round(innerWidth * dpr)
      canvas.height = Math.round(innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      render()
    }

    resize()
    // Wait until the rendered canvas has reached the compositor before the
    // opaque boot scene is allowed to reveal it.
    let readyFrame = requestAnimationFrame(() => {
      setReady(true)
      readyFrame = requestAnimationFrame(() => onReady?.())
    })
    addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(readyFrame)
      removeEventListener('resize', resize)
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
  }, [onReady])

  return <canvas ref={canvasRef} className={`app-background${ready ? ' is-ready' : ''}`} aria-hidden="true" />
}
