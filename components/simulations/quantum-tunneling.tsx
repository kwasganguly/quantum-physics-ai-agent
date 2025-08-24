"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuantumTunneling() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [energy, setEnergy] = useState([50])
  const [barrierHeight, setBarrierHeight] = useState([80])
  const [barrierWidth, setBarrierWidth] = useState([50])
  const [isAnimating, setIsAnimating] = useState(false)
  const [tunnelingProbability, setTunnelingProbability] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Calculate tunneling probability
    const E = energy[0]
    const V = barrierHeight[0]
    const a = barrierWidth[0] / 10 // Scale for calculation

    if (E >= V) {
      setTunnelingProbability(1)
    } else {
      const k = Math.sqrt(2 * (V - E)) / 10 // Simplified calculation
      const T = 1 / (1 + (V * V * Math.sinh(k * a) * Math.sinh(k * a)) / (4 * E * (V - E)))
      setTunnelingProbability(Math.max(0, Math.min(1, T)))
    }
  }, [energy, barrierHeight, barrierWidth])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerY = height * 0.7

      // Draw energy level
      ctx.strokeStyle = "#22d3ee"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      const energyY = centerY - (energy[0] / 100) * (height * 0.4)
      ctx.beginPath()
      ctx.moveTo(0, energyY)
      ctx.lineTo(width, energyY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw potential barrier
      const barrierStart = width * 0.4
      const barrierEnd = barrierStart + (barrierWidth[0] / 100) * (width * 0.3)
      const barrierTop = centerY - (barrierHeight[0] / 100) * (height * 0.4)

      ctx.fillStyle = "#ef4444"
      ctx.fillRect(barrierStart, barrierTop, barrierEnd - barrierStart, centerY - barrierTop)

      // Draw wave function
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3

      // Incident wave
      ctx.beginPath()
      for (let x = 0; x < barrierStart; x++) {
        const k = Math.sqrt(energy[0]) / 10
        const waveValue = Math.sin(k * x + (isAnimating ? time * 0.005 : 0))
        const y = centerY - waveValue * 30
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Transmitted wave (if tunneling occurs)
      if (tunnelingProbability > 0.01) {
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 3 * Math.sqrt(tunnelingProbability)
        ctx.beginPath()
        for (let x = barrierEnd; x < width; x++) {
          const k = Math.sqrt(energy[0]) / 10
          const waveValue = Math.sin(k * x + (isAnimating ? time * 0.005 : 0)) * Math.sqrt(tunnelingProbability)
          const y = centerY - waveValue * 30
          if (x === barrierEnd) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Draw particle
      if (isAnimating) {
        const particleX = ((time * 0.1) % (width + 100)) - 50
        if (particleX > 0 && particleX < width) {
          ctx.fillStyle = "#fbbf24"
          ctx.beginPath()
          ctx.arc(particleX, energyY, 5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

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
  }, [energy, barrierHeight, barrierWidth, isAnimating, tunnelingProbability])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quantum Tunneling Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
                {isAnimating ? "Pause" : "Animate"}
              </Button>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-sm">Tunneling Probability:</span>
                <span className="text-green-400 font-bold">{(tunnelingProbability * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Particle Energy: {energy[0]} eV</label>
              <Slider value={energy} onValueChange={setEnergy} max={120} min={10} step={5} className="w-full" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Barrier Height: {barrierHeight[0]} eV
              </label>
              <Slider
                value={barrierHeight}
                onValueChange={setBarrierHeight}
                max={150}
                min={20}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Barrier Width: {barrierWidth[0]}</label>
              <Slider
                value={barrierWidth}
                onValueChange={setBarrierWidth}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Understanding Quantum Tunneling</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Quantum tunneling allows particles to pass through energy barriers that would be impossible to cross
            classically. This phenomenon is crucial in many quantum devices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-cyan-400 font-semibold">Energy Level (Blue):</h4>
              <p className="text-sm">The kinetic energy of the incoming particle</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">Barrier (Red):</h4>
              <p className="text-sm">Potential energy barrier the particle encounters</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">Transmitted Wave:</h4>
              <p className="text-sm">Probability amplitude of particle after tunneling</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
