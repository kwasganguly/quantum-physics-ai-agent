"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function WaveParticleSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<"wave" | "particle">("wave")
  const [intensity, setIntensity] = useState([50])
  const [slitWidth, setSlitWidth] = useState([30])
  const [isRunning, setIsRunning] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 400

    let time = 0

    const animate = () => {
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (mode === "wave") {
        drawWaveInterference(ctx, time, intensity[0], slitWidth[0])
      } else {
        drawParticleDetection(ctx, time, intensity[0])
      }

      time += 0.05
      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    } else {
      // Draw static state
      if (mode === "wave") {
        drawWaveInterference(ctx, 0, intensity[0], slitWidth[0])
      } else {
        drawParticleDetection(ctx, 0, intensity[0])
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mode, intensity, slitWidth, isRunning])

  const drawWaveInterference = (ctx: CanvasRenderingContext2D, time: number, intensity: number, slitWidth: number) => {
    const centerY = ctx.canvas.height / 2
    const slitY1 = centerY - slitWidth
    const slitY2 = centerY + slitWidth

    // Draw barrier with slits
    ctx.fillStyle = "#64748b"
    ctx.fillRect(300, 0, 20, slitY1 - 10)
    ctx.fillRect(300, slitY1 + 10, 20, slitY2 - slitY1 - 20)
    ctx.fillRect(300, slitY2 + 10, 20, ctx.canvas.height - slitY2 - 10)

    // Draw wave interference pattern
    for (let x = 320; x < ctx.canvas.width; x += 2) {
      for (let y = 0; y < ctx.canvas.height; y += 2) {
        const d1 = Math.sqrt((x - 310) ** 2 + (y - slitY1) ** 2)
        const d2 = Math.sqrt((x - 310) ** 2 + (y - slitY2) ** 2)

        const wave1 = Math.sin(d1 * 0.1 - time * 2) * (intensity / 100)
        const wave2 = Math.sin(d2 * 0.1 - time * 2) * (intensity / 100)
        const interference = wave1 + wave2

        const brightness = Math.abs(interference) * 255
        ctx.fillStyle = `rgba(59, 130, 246, ${brightness / 255})`
        ctx.fillRect(x, y, 2, 2)
      }
    }

    // Draw incoming wave
    for (let x = 0; x < 300; x += 5) {
      const wave = Math.sin(x * 0.1 - time * 2) * 20
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, centerY + wave - 10)
      ctx.lineTo(x + 5, centerY + Math.sin((x + 5) * 0.1 - time * 2) * 20 - 10)
      ctx.stroke()
    }
  }

  const drawParticleDetection = (ctx: CanvasRenderingContext2D, time: number, intensity: number) => {
    const centerY = ctx.canvas.height / 2

    // Draw barrier
    ctx.fillStyle = "#64748b"
    ctx.fillRect(300, 0, 20, centerY - 30)
    ctx.fillRect(300, centerY + 30, 20, ctx.canvas.height - centerY - 30)

    // Draw detector screen
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(700, 0, 10, ctx.canvas.height)

    // Simulate particle hits on detector
    const particles = Math.floor(intensity / 10)
    for (let i = 0; i < particles; i++) {
      const hitY = centerY + (Math.random() - 0.5) * 200
      const brightness = 0.3 + Math.random() * 0.7
      ctx.fillStyle = `rgba(239, 68, 68, ${brightness})`
      ctx.fillRect(700, hitY, 10, 2)
    }

    // Draw individual particles in flight
    for (let i = 0; i < 5; i++) {
      const x = (time * 100 + i * 150) % 700
      const y = centerY + Math.sin(time + i) * 10

      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={mode === "wave" ? "default" : "outline"}
            onClick={() => setMode("wave")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Wave Mode
          </Button>
          <Button
            variant={mode === "particle" ? "default" : "outline"}
            onClick={() => setMode("particle")}
            className="bg-red-600 hover:bg-red-700"
          >
            Particle Mode
          </Button>
        </div>

        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunning ? "Pause" : "Start"} Simulation
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardContent className="p-6">
          <canvas
            ref={canvasRef}
            className="w-full border border-slate-600 rounded-lg bg-slate-900"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Intensity: {intensity[0]}%</label>
          <Slider value={intensity} onValueChange={setIntensity} max={100} min={10} step={5} className="w-full" />
        </div>

        {mode === "wave" && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-blue-200">Slit Separation: {slitWidth[0]}px</label>
            <Slider value={slitWidth} onValueChange={setSlitWidth} max={60} min={20} step={5} className="w-full" />
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">Current Observation:</h3>
        <p className="text-sm text-blue-100">
          {mode === "wave"
            ? "Wave mode shows interference patterns - the quantum object behaves as a wave, creating constructive and destructive interference through both slits simultaneously."
            : 'Particle mode shows discrete detection events - when we try to detect "which slit" the quantum object goes through, it behaves as a particle and the interference pattern disappears.'}
        </p>
      </div>
    </div>
  )
}
