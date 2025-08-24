"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuantumHarmonic() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [energyLevel, setEnergyLevel] = useState([0])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height * 0.8

      // Draw potential well (parabola)
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const xNorm = (x - centerX) / (width * 0.3)
        const y = centerY - xNorm * xNorm * 100
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw energy levels
      const n = energyLevel[0]
      const maxLevels = 5

      for (let level = 0; level < maxLevels; level++) {
        const energy = (level + 0.5) * 30 // E = ℏω(n + 1/2)
        const y = centerY - energy

        ctx.strokeStyle = level === n ? "#22c55e" : "#374151"
        ctx.lineWidth = level === n ? 3 : 1
        ctx.setLineDash(level === n ? [] : [5, 5])

        // Find turning points for this energy level
        const amplitude = Math.sqrt(energy / 100) * width * 0.3

        ctx.beginPath()
        ctx.moveTo(centerX - amplitude, y)
        ctx.lineTo(centerX + amplitude, y)
        ctx.stroke()

        // Energy level labels
        ctx.fillStyle = level === n ? "#22c55e" : "#9ca3af"
        ctx.font = "12px sans-serif"
        ctx.fillText(`n=${level}`, centerX + amplitude + 10, y + 4)
      }
      ctx.setLineDash([])

      // Draw wave function for selected energy level
      const selectedEnergy = (n + 0.5) * 30
      const selectedY = centerY - selectedEnergy
      const amplitude = Math.sqrt(selectedEnergy / 100) * width * 0.3

      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = centerX - amplitude; x <= centerX + amplitude; x += 2) {
        const xNorm = (x - centerX) / (width * 0.1)

        // Simplified Hermite polynomial approximation
        let waveValue = 0
        if (n === 0) {
          waveValue = Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 1) {
          waveValue = xNorm * Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 2) {
          waveValue = (2 * xNorm * xNorm - 1) * Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 3) {
          waveValue = xNorm * (2 * xNorm * xNorm - 3) * Math.exp((-xNorm * xNorm) / 2)
        } else {
          waveValue = Math.sin((n * Math.PI * xNorm) / 4) * Math.exp((-xNorm * xNorm) / 2)
        }

        const t = isAnimating ? time * 0.002 : 0
        const phase = Math.cos(t * (n + 1))
        const y = selectedY - waveValue * 40 * phase

        if (x === centerX - amplitude) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw probability density
      ctx.fillStyle = "rgba(139, 92, 246, 0.3)"
      ctx.beginPath()
      ctx.moveTo(centerX - amplitude, selectedY)

      for (let x = centerX - amplitude; x <= centerX + amplitude; x += 2) {
        const xNorm = (x - centerX) / (width * 0.1)

        let waveValue = 0
        if (n === 0) {
          waveValue = Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 1) {
          waveValue = xNorm * Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 2) {
          waveValue = (2 * xNorm * xNorm - 1) * Math.exp((-xNorm * xNorm) / 2)
        } else if (n === 3) {
          waveValue = xNorm * (2 * xNorm * xNorm - 3) * Math.exp((-xNorm * xNorm) / 2)
        } else {
          waveValue = Math.sin((n * Math.PI * xNorm) / 4) * Math.exp((-xNorm * xNorm) / 2)
        }

        const probability = Math.abs(waveValue) * 40
        const y = selectedY - probability
        ctx.lineTo(x, y)
      }

      ctx.lineTo(centerX + amplitude, selectedY)
      ctx.closePath()
      ctx.fill()

      // Draw classical particle position (if animating)
      if (isAnimating) {
        const t = time * 0.001 * (n + 1)
        const classicalX = centerX + Math.cos(t) * amplitude * 0.8
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(classicalX, selectedY + 10, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("Position", width - 60, height - 10)
      ctx.save()
      ctx.translate(15, height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("Energy", 0, 0)
      ctx.restore()

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [energyLevel, isAnimating])

  const energy = (energyLevel[0] + 0.5) * 0.5 // ℏω(n + 1/2) in arbitrary units

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Quantum Harmonic Oscillator
              <Badge variant="secondary">n = {energyLevel[0]}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4">
              <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
                {isAnimating ? "Pause" : "Animate"} Oscillation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Energy Level Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Quantum Number (n): {energyLevel[0]}
              </label>
              <Slider value={energyLevel} onValueChange={setEnergyLevel} max={4} min={0} step={1} className="w-full" />
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Energy:</div>
                <div className="text-green-400 text-lg font-mono">
                  E = ℏω({energyLevel[0]} + ½) = {energy.toFixed(1)}ℏω
                </div>
              </div>

              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Zero-point Energy:</div>
                <div className="text-yellow-400 text-lg font-mono">E₀ = ½ℏω = 0.5ℏω</div>
              </div>
            </div>

            <div className="text-slate-300 text-sm space-y-2">
              <p>
                <strong className="text-purple-400">Purple curve:</strong> Wave function ψₙ(x)
              </p>
              <p>
                <strong className="text-purple-400">Shaded area:</strong> Probability density |ψₙ(x)|²
              </p>
              <p>
                <strong className="text-yellow-400">Yellow dot:</strong> Classical particle motion
              </p>
              <p>
                <strong className="text-green-400">Green line:</strong> Current energy level
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Understanding Energy Quantization</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The quantum harmonic oscillator demonstrates energy quantization - energy can only exist in discrete levels,
            not continuous values. This is fundamental to understanding molecular vibrations, phonons in solids, and
            quantum field theory.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-green-400 font-semibold">Energy Levels:</h4>
              <p className="text-sm">E = ℏω(n + ½) where n = 0, 1, 2, 3...</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold">Zero-point Energy:</h4>
              <p className="text-sm">Even at n=0, the system has energy ½ℏω</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold">Wave Functions:</h4>
              <p className="text-sm">Hermite polynomials × Gaussian envelope</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
