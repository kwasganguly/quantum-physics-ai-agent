"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ParticleAccelerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [energy, setEnergy] = useState([50])
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number; type: string; energy: number }>
  >([])
  const [collisions, setCollisions] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw accelerator ring
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 120

      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw magnetic field indicators
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x = centerX + Math.cos(angle) * (radius + 20)
        const y = centerY + Math.sin(angle) * (radius + 20)

        ctx.fillStyle = "#10b981"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw collision point
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX + radius, centerY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add glow to collision point
      ctx.shadowColor = "#ef4444"
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw particles
      particles.forEach((particle) => {
        let color = "#3b82f6"
        if (particle.type === "proton") color = "#ef4444"
        if (particle.type === "electron") color = "#10b981"
        if (particle.type === "photon") color = "#f59e0b"
        if (particle.type === "muon") color = "#8b5cf6"

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, Math.max(2, particle.energy / 20), 0, Math.PI * 2)
        ctx.fill()

        // Add particle trail
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw energy beam
      if (isRunning) {
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("Particle Accelerator", 10, 30)
      ctx.fillText("Collision Point", centerX + radius + 15, centerY - 10)
      ctx.fillText(`Energy: ${energy[0]} GeV`, 10, canvas.height - 40)
      ctx.fillText(`Collisions: ${collisions}`, 10, canvas.height - 20)

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
  }, [isRunning, energy, particles, collisions])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setParticles((prev) => {
        const centerX = 400
        const centerY = 150
        const radius = 120

        let updated = prev.map((p) => {
          // Circular motion
          const angle = Math.atan2(p.y - centerY, p.x - centerX)
          const speed = p.energy / 10
          const newAngle = angle + speed * 0.01

          const newX = centerX + Math.cos(newAngle) * radius
          const newY = centerY + Math.sin(newAngle) * radius

          return { ...p, x: newX, y: newY }
        })

        // Check for collisions at collision point
        const collisionX = centerX + radius
        const collisionY = centerY

        updated.forEach((p, i) => {
          const dist = Math.sqrt(Math.pow(p.x - collisionX, 2) + Math.pow(p.y - collisionY, 2))
          if (dist < 15 && p.type === "proton") {
            // Create collision products
            setCollisions((prev) => prev + 1)

            // Remove original particle and add products
            updated = updated.filter((_, idx) => idx !== i)

            // Add collision products based on energy
            const products = []
            if (energy[0] > 30) {
              products.push({ x: collisionX + 20, y: collisionY, vx: 2, vy: 0, type: "muon", energy: energy[0] * 0.3 })
            }
            if (energy[0] > 20) {
              products.push({
                x: collisionX - 20,
                y: collisionY,
                vx: -2,
                vy: 0,
                type: "electron",
                energy: energy[0] * 0.2,
              })
            }
            products.push({ x: collisionX, y: collisionY + 20, vx: 0, vy: 2, type: "photon", energy: energy[0] * 0.1 })

            updated.push(...products)
          }
        })

        // Add new particles occasionally
        if (Math.random() < 0.05 && updated.length < 10) {
          updated.push({
            x: centerX + radius,
            y: centerY,
            vx: 0,
            vy: 0,
            type: "proton",
            energy: energy[0],
          })
        }

        // Remove particles that are too far
        return updated.filter((p) => {
          const dist = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
          return dist < 200
        })
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, energy])

  const clearParticles = () => {
    setParticles([])
    setCollisions(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Accelerator
        </Button>
        <Button
          onClick={clearParticles}
          variant="outline"
          className="border-orange-500 text-orange-400 hover:bg-orange-500/10 bg-transparent"
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

      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-cyan-400">Beam Energy</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider value={energy} onValueChange={setEnergy} max={100} min={10} step={5} className="w-full" />
          <p className="text-sm text-slate-400 mt-2">Current: {energy[0]} GeV</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Protons</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Electrons</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Photons</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-slate-300">Muons</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-orange-400">Particle Accelerator:</strong> Protons are accelerated around the ring
            using magnetic fields. When they collide at high energies, they create new particles like muons, electrons,
            and photons. Higher energies produce more exotic particles!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
