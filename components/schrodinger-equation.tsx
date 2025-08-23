"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SchrodingerEquation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [potential, setPotential] = useState([1])
  const [energy, setEnergy] = useState([2])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw coordinate system
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1

      // Grid
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      const centerY = canvas.height / 2

      // Draw potential well
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const normalizedX = (x - canvas.width / 2) / 100
        const V = potential[0] * normalizedX * normalizedX // Harmonic oscillator potential
        const y = centerY - V * 20

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw energy level
      ctx.strokeStyle = "#10b981"
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, centerY - energy[0] * 40)
      ctx.lineTo(canvas.width, centerY - energy[0] * 40)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw wavefunction
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const normalizedX = (x - canvas.width / 2) / 100

        // Simplified harmonic oscillator wavefunction
        const psi =
          Math.exp((-potential[0] * normalizedX * normalizedX) / 2) *
          Math.cos(Math.sqrt(energy[0]) * normalizedX + time * 0.1)

        const y = centerY - energy[0] * 40 + psi * 30

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Add glow to wavefunction
      ctx.shadowColor = "#3b82f6"
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw probability density
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.beginPath()
      ctx.moveTo(0, centerY - energy[0] * 40)

      for (let x = 0; x < canvas.width; x++) {
        const normalizedX = (x - canvas.width / 2) / 100
        const psi =
          Math.exp((-potential[0] * normalizedX * normalizedX) / 2) *
          Math.cos(Math.sqrt(energy[0]) * normalizedX + time * 0.1)
        const probability = psi * psi
        const y = centerY - energy[0] * 40 + probability * 30
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, centerY - energy[0] * 40)
      ctx.closePath()
      ctx.fill()

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("Ψ(x,t)", 10, 30)
      ctx.fillText("V(x)", canvas.width - 50, 30)
      ctx.fillText("E", canvas.width - 30, centerY - energy[0] * 40 - 10)

      // Equation
      ctx.fillStyle = "#06b6d4"
      ctx.font = "16px monospace"
      ctx.fillText("iℏ ∂Ψ/∂t = ĤΨ", 10, canvas.height - 20)

      if (isRunning) {
        time += 1
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    } else {
      animate() // Draw static frame
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, potential, energy])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Evolution
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full border border-slate-600 rounded-lg bg-slate-900"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-red-400">Potential Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider value={potential} onValueChange={setPotential} max={3} min={0.5} step={0.1} className="w-full" />
            <p className="text-sm text-slate-400 mt-2">ω = {potential[0].toFixed(1)}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-green-400">Energy Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider value={energy} onValueChange={setEnergy} max={4} min={0.5} step={0.1} className="w-full" />
            <p className="text-sm text-slate-400 mt-2">E = {energy[0].toFixed(1)} ℏω</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm mb-2">
            <strong className="text-cyan-400">Schrödinger Equation:</strong> The fundamental equation governing quantum
            mechanics:
            <span className="font-mono text-cyan-300"> iℏ ∂Ψ/∂t = ĤΨ</span>
          </p>
          <p className="text-slate-300 text-sm">
            This shows a particle in a harmonic oscillator potential (red curve). The blue wave is the wavefunction
            Ψ(x,t), and the shaded area represents the probability density |Ψ|². The green line shows the energy level.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
