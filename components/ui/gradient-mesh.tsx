'use client'

import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = (distortion: number) => `
precision highp float;

uniform float uTime;
uniform float uSwirl;
uniform float uSpeed;
uniform float uScale;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uRotation;
uniform float uWaveAmp;
uniform float uWaveFreq;
uniform float uWaveSpeed;
uniform float uGrain;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uResolution;

varying vec2 vUv;

float wave(vec2 uv, float freq, float speed, float time) {
  return sin(uv.x * freq + time * speed) * cos(uv.y * freq + time * speed);
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv = uv * uScale + vec2(uOffsetX, uOffsetY);

  float cosR = cos(uRotation);
  float sinR = sin(uRotation);
  uv = vec2(uv.x * cosR - uv.y * sinR, uv.x * sinR + uv.y * cosR);

  uv.x += wave(uv, uWaveFreq, uWaveSpeed, uTime) * uWaveAmp;
  uv.y += wave(uv + 10.0, uWaveFreq * 1.5, uWaveSpeed * 0.8, uTime) * uWaveAmp * 0.5;

  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle += uSwirl * radius;
  uv = vec2(cos(angle), sin(angle)) * radius;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;

  for (float i = 0.0; i < ${distortion.toFixed(1)}; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }

  d += uTime * 0.5 * uSpeed;

  float mix1 = (sin(d) + 1.0) * 0.5;
  float mix2 = (cos(a) + 1.0) * 0.5;
  vec3 col = mix(uColorA, uColorB, mix1);
  col = mix(col, uColorC, mix2);

  float grain = (random(gl_FragCoord.xy + uTime) - 0.5) * uGrain;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`

interface GradientMeshProps {
  className?: string
  colors?: [string, string, string]
  distortion?: number
  swirl?: number
  speed?: number
  scale?: number
  offsetX?: number
  offsetY?: number
  rotation?: number
  waveAmp?: number
  waveFreq?: number
  waveSpeed?: number
  grain?: number
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '')
  return [
    parseInt(cleanHex.substring(0, 2), 16) / 255,
    parseInt(cleanHex.substring(2, 4), 16) / 255,
    parseInt(cleanHex.substring(4, 6), 16) / 255,
  ]
}

export function GradientMesh({
  className,
  colors = ['#F7F1E6', '#D9C39A', '#9A7E4F'],
  distortion = 4,
  swirl = 0.42,
  speed = 0.28,
  scale = 1.22,
  offsetX = 0,
  offsetY = 0,
  rotation = 18,
  waveAmp = 0.07,
  waveFreq = 7,
  waveSpeed = 0.18,
  grain = 0.035,
}: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const target = container
    const renderer = new Renderer({ alpha: true, antialias: true })
    const gl = renderer.gl
    const geometry = new Triangle(gl)
    const [colorA, colorB, colorC] = colors.map(hexToRgb)
    const uniforms = {
      uTime: { value: 0 },
      uSwirl: { value: swirl },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uOffsetX: { value: offsetX },
      uOffsetY: { value: offsetY },
      uRotation: { value: (rotation * Math.PI) / 180 },
      uWaveAmp: { value: waveAmp },
      uWaveFreq: { value: waveFreq },
      uWaveSpeed: { value: waveSpeed },
      uGrain: { value: grain },
      uColorA: { value: new Color(...colorA) },
      uColorB: { value: new Color(...colorB) },
      uColorC: { value: new Color(...colorC) },
      uResolution: { value: new Color(1, 1, 1) },
    }
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader(distortion),
      uniforms,
    })
    const mesh = new Mesh(gl, { geometry, program })
    let frame = 0

    function resize() {
      const width = Math.max(target.clientWidth, 1)
      const height = Math.max(target.clientHeight, 1)
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = new Color(width, height, width / height)
    }

    function update(time: number) {
      frame = requestAnimationFrame(update)
      program.uniforms.uTime.value = time * 0.001
      renderer.render({ scene: mesh })
    }

    resize()
    window.addEventListener('resize', resize)
    target.appendChild(gl.canvas)
    frame = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentElement === target) target.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [colors, distortion, grain, offsetX, offsetY, rotation, scale, speed, swirl, waveAmp, waveFreq, waveSpeed])

  return <div ref={containerRef} className={className} />
}
