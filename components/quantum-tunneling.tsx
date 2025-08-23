"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuantumTunneling() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [barrierHeight, setBarrierHeight] = useState([80])
  const [particleEnergy, setParticleEnergy] = useState([60])
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; tunneled: boolean }>>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw energy barrier
      const barrierX = canvas.width * 0.4
      const barrierWidth = 60
      const barrierY = canvas.height - barrierHeight[0] * 2

      ctx.fillStyle = "#ef4444"
      ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight[0] * 2)

      // Add barrier glow
      ctx.shadowColor = "#ef4444"
      ctx.shadowBlur = 15
      ctx.fillRect(barrierX, barrierY, barrierWidth, barrierHeight[0] * 2)
      ctx.shadowBlur = 0

      // Draw energy levels
      ctx.strokeStyle = "#64748b"
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - particleEnergy[0] * 2)
      ctx.lineTo(canvas.width, canvas.height - particleEnergy[0] * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw particles
      particles.forEach((particle) => {
        ctx.fillStyle = particle.tunneled ? "#10b981" : "#3b82f6"
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 6, 0, Math.PI * 2)
        ctx.fill()

        // Add particle glow
        ctx.shadowColor = particle.tunneled ? "#10b981" : "#3b82f6"
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("Particle Energy", 10, 30)
      ctx.fillText("Energy Barrier", barrierX, barrierY - 10)
      ctx.fillText("Tunneled!", canvas.width - 80, 30)

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, barrierHeight, particleEnergy, particles])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => {
            const newX = p.x + p.vx
            const barrierX = 320 // canvas.width * 0.4
            const barrierEnd = barrierX + 60

            // Check if particle is at barrier
            if (newX >= barrierX && newX <= barrierEnd && !p.tunneled) {
              // Quantum tunneling probability
              const tunnelingProb = Math.exp(-2 * Math.sqrt(2 * (barrierHeight[0] - particleEnergy[0])) * 0.1)
              if (Math.random() < tunnelingProb) {
                return { ...p, x: barrierEnd + 5, tunneled: true }
              } else {
                return { ...p, vx: -p.vx, x: barrierX - 5 } // Reflect
              }
            }

            return { ...p, x: newX }
          })
          .filter((p) => p.x > -10 && p.x < 810)

        // Add new particle occasionally
        if (Math.random() < 0.1) {
          updated.push({
            x: 20,
            y: 300 - particleEnergy[0] * 2,
            vx: 2,
            tunneled: false,
          })
        }

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isRunning, barrierHeight, particleEnergy])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Tunneling
        </Button>
        <Button
          onClick={() => setParticles([])}
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
        >
          Clear Particles
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
            <CardTitle className="text-red-400">Barrier Height</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={barrierHeight}
              onValueChange={setBarrierHeight}
              max={120}
              min={40}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-slate-400 mt-2">Current: {barrierHeight[0]} units</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-blue-400">Particle Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={particleEnergy}
              onValueChange={setParticleEnergy}
              max={100}
              min={20}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-slate-400 mt-2">Current: {particleEnergy[0]} units</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-purple-400">Quantum Tunneling:</strong> Even when particles don't have enough energy
            to go over a barrier, they can still "tunnel" through it! Blue particles are approaching the barrier, green
            particles have successfully tunneled through. The probability depends on the barrier height and particle
            energy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
