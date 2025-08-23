"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function QuantumTunnelingSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [barrierHeight, setBarrierHeight] = useState([80])
  const [barrierWidth, setBarrierWidth] = useState([60])
  const [particleEnergy, setParticleEnergy] = useState([50])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 400

    let time = 0
    const particles: Array<{ x: number; y: number; vx: number; tunneled: boolean; reflected: boolean }> = []

    const animate = () => {
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw potential barrier
      drawPotentialBarrier(ctx, barrierHeight[0], barrierWidth[0])

      // Draw energy level
      drawEnergyLevel(ctx, particleEnergy[0])

      // Spawn new particles
      if (Math.random() < 0.1 && particles.length < 20) {
        particles.push({
          x: 50,
          y: 200 + (Math.random() - 0.5) * 40,
          vx: 2,
          tunneled: false,
          reflected: false,
        })
      }

      // Update and draw particles
      updateParticles(ctx, particles, barrierHeight[0], barrierWidth[0], particleEnergy[0])

      // Draw wavefunction
      drawWavefunction(ctx, time, barrierHeight[0], barrierWidth[0], particleEnergy[0])

      time += 0.1
      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    } else {
      // Draw static state
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawPotentialBarrier(ctx, barrierHeight[0], barrierWidth[0])
      drawEnergyLevel(ctx, particleEnergy[0])
      drawWavefunction(ctx, 0, barrierHeight[0], barrierWidth[0], particleEnergy[0])
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, barrierHeight, barrierWidth, particleEnergy])

  const drawPotentialBarrier = (ctx: CanvasRenderingContext2D, height: number, width: number) => {
    const barrierX = 350
    const barrierY = 300 - (height / 100) * 200

    // Draw barrier
    ctx.fillStyle = "#64748b"
    ctx.fillRect(barrierX, barrierY, width, 300 - barrierY)

    // Draw potential energy curve
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 300)
    ctx.lineTo(barrierX, 300)
    ctx.lineTo(barrierX, barrierY)
    ctx.lineTo(barrierX + width, barrierY)
    ctx.lineTo(barrierX + width, 300)
    ctx.lineTo(ctx.canvas.width, 300)
    ctx.stroke()

    // Label
    ctx.fillStyle = "#f59e0b"
    ctx.font = "14px sans-serif"
    ctx.fillText(`V = ${height}%`, barrierX + 10, barrierY - 10)
  }

  const drawEnergyLevel = (ctx: CanvasRenderingContext2D, energy: number) => {
    const energyY = 300 - (energy / 100) * 200

    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, energyY)
    ctx.lineTo(ctx.canvas.width, energyY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = "#22c55e"
    ctx.font = "14px sans-serif"
    ctx.fillText(`E = ${energy}%`, 10, energyY - 10)
  }

  const updateParticles = (
    ctx: CanvasRenderingContext2D,
    particles: Array<{ x: number; y: number; vx: number; tunneled: boolean; reflected: boolean }>,
    barrierHeight: number,
    barrierWidth: number,
    energy: number,
  ) => {
    const barrierX = 350
    const transmissionProb = calculateTransmissionProbability(energy, barrierHeight, barrierWidth)

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      // Update position
      particle.x += particle.vx

      // Check barrier interaction
      if (
        particle.x >= barrierX &&
        particle.x <= barrierX + barrierWidth &&
        !particle.tunneled &&
        !particle.reflected
      ) {
        if (Math.random() < transmissionProb) {
          particle.tunneled = true
          // Particle tunnels through
        } else {
          particle.reflected = true
          particle.vx = -particle.vx
        }
      }

      // Remove particles that are off screen
      if (particle.x < -10 || particle.x > ctx.canvas.width + 10) {
        particles.splice(i, 1)
        continue
      }

      // Draw particle
      if (particle.tunneled) {
        ctx.fillStyle = "#3b82f6"
      } else if (particle.reflected) {
        ctx.fillStyle = "#ef4444"
      } else {
        ctx.fillStyle = "#fbbf24"
      }

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const calculateTransmissionProbability = (energy: number, barrierHeight: number, barrierWidth: number) => {
    if (energy >= barrierHeight) {
      return 0.9 // Classical case - particle has enough energy
    }

    // Quantum tunneling probability (simplified)
    const kappa = Math.sqrt(2 * (barrierHeight - energy)) * 0.1
    return Math.exp(-2 * kappa * barrierWidth * 0.01)
  }

  const drawWavefunction = (
    ctx: CanvasRenderingContext2D,
    time: number,
    barrierHeight: number,
    barrierWidth: number,
    energy: number,
  ) => {
    const barrierX = 350
    const k = Math.sqrt(energy) * 0.1 // Wave number
    const kappa = Math.sqrt(Math.abs(barrierHeight - energy)) * 0.1 // Decay constant

    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 2
    ctx.beginPath()

    // Region 1: Before barrier (incident + reflected wave)
    for (let x = 0; x < barrierX; x += 2) {
      const incident = Math.sin(k * x - time)
      const reflected = 0.3 * Math.sin(-k * x - time) // Reduced amplitude
      const psi = incident + reflected
      const y = 200 + psi * 30

      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    // Region 2: Inside barrier (exponentially decaying)
    for (let x = barrierX; x < barrierX + barrierWidth; x += 2) {
      const decay = Math.exp(-kappa * (x - barrierX))
      const psi = decay * Math.sin(k * barrierX - time)
      const y = 200 + psi * 30
      ctx.lineTo(x, y)
    }

    // Region 3: After barrier (transmitted wave)
    const transmissionAmplitude = calculateTransmissionProbability(energy, barrierHeight, barrierWidth)
    for (let x = barrierX + barrierWidth; x < ctx.canvas.width; x += 2) {
      const transmitted = transmissionAmplitude * Math.sin(k * x - time)
      const y = 200 + transmitted * 30
      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }

  const transmissionProb = calculateTransmissionProbability(particleEnergy[0], barrierHeight[0], barrierWidth[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunning ? "Pause" : "Start"} Simulation
        </Button>

        <div className="text-sm text-blue-200">Transmission Probability: {(transmissionProb * 100).toFixed(1)}%</div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Particle Energy: {particleEnergy[0]}%</label>
          <Slider
            value={particleEnergy}
            onValueChange={setParticleEnergy}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Barrier Height: {barrierHeight[0]}%</label>
          <Slider
            value={barrierHeight}
            onValueChange={setBarrierHeight}
            max={100}
            min={30}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Barrier Width: {barrierWidth[0]}px</label>
          <Slider value={barrierWidth} onValueChange={setBarrierWidth} max={100} min={20} step={5} className="w-full" />
        </div>
      </div>

      <div className="bg-slate-800/30 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">Quantum Tunneling Effect:</h3>
        <p className="text-sm text-blue-100">
          {particleEnergy[0] >= barrierHeight[0]
            ? "Classical regime: Particles have enough energy to go over the barrier. Most particles pass through."
            : `Quantum regime: Particles tunnel through the barrier with ${(transmissionProb * 100).toFixed(1)}% probability, even though they lack sufficient classical energy. The purple wavefunction shows exponential decay inside the barrier.`}
        </p>
      </div>
    </div>
  )
}
