"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WaveSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [frequency, setFrequency] = useState([1])
  const [amplitude, setAmplitude] = useState([50])
  const [waveType, setWaveType] = useState<"sine" | "particle">("sine")
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      const centerY = canvas.height / 2

      if (waveType === "sine") {
        // Draw wave
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 3
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + amplitude[0] * Math.sin(x * frequency[0] * 0.02 + time * 0.1)
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Add glow effect
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
      } else {
        // Draw particles
        ctx.fillStyle = "#f59e0b"
        for (let i = 0; i < 20; i++) {
          const x = (i * 30 + time * 2) % canvas.width
          const y = centerY + amplitude[0] * Math.sin(x * frequency[0] * 0.02 + time * 0.1)

          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fill()

          // Add glow
          ctx.shadowColor = "#f59e0b"
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

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
  }, [isRunning, frequency, amplitude, waveType])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Simulation
        </Button>
        <Button
          onClick={() => setWaveType(waveType === "sine" ? "particle" : "sine")}
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
        >
          {waveType === "sine" ? "Show Particles" : "Show Wave"}
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
            <CardTitle className="text-cyan-400">Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider value={frequency} onValueChange={setFrequency} max={5} min={0.1} step={0.1} className="w-full" />
            <p className="text-sm text-slate-400 mt-2">Current: {frequency[0].toFixed(1)} Hz</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-cyan-400">Amplitude</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider value={amplitude} onValueChange={setAmplitude} max={100} min={10} step={5} className="w-full" />
            <p className="text-sm text-slate-400 mt-2">Current: {amplitude[0]} px</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-cyan-400">Wave-Particle Duality:</strong> This simulation demonstrates how quantum
            objects can exhibit both wave-like and particle-like properties. Toggle between wave and particle views to
            see how the same phenomenon can be visualized differently depending on how we observe it.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
