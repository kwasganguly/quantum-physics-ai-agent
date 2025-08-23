"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type SpinState = "up" | "down" | "superposition"

export function EntanglementSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isEntangled, setIsEntangled] = useState(true)
  const [particleA, setParticleA] = useState<SpinState>("superposition")
  const [particleB, setParticleB] = useState<SpinState>("superposition")
  const [measurementsMade, setMeasurementsMade] = useState(0)
  const [correlationData, setCorrelationData] = useState<Array<{ a: SpinState; b: SpinState }>>([])
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

      drawEntangledSystem(ctx, time, particleA, particleB, isEntangled)

      time += 0.05
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleA, particleB, isEntangled])

  const drawEntangledSystem = (
    ctx: CanvasRenderingContext2D,
    time: number,
    stateA: SpinState,
    stateB: SpinState,
    entangled: boolean,
  ) => {
    const centerY = ctx.canvas.height / 2
    const particleAX = 200
    const particleBX = 600

    // Draw entanglement connection
    if (entangled && stateA === "superposition" && stateB === "superposition") {
      // Draw quantum correlation field
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      for (let i = 0; i < 5; i++) {
        const y = centerY + Math.sin(time + i * 0.5) * 20
        ctx.beginPath()
        ctx.moveTo(particleAX + 50, y)
        ctx.lineTo(particleBX - 50, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Draw entanglement label
      ctx.fillStyle = "#8b5cf6"
      ctx.font = "16px sans-serif"
      ctx.fillText("Quantum Entanglement", 320, centerY - 50)
      ctx.font = "12px sans-serif"
      ctx.fillText("|ψ⟩ = (1/√2)(|↑↓⟩ - |↓↑⟩)", 300, centerY - 30)
    }

    // Draw Particle A
    drawParticle(ctx, particleAX, centerY, stateA, "A", time)

    // Draw Particle B
    drawParticle(ctx, particleBX, centerY, stateB, "B", time + Math.PI)

    // Draw measurement apparatus
    if (stateA !== "superposition") {
      drawMeasurementDevice(ctx, particleAX, centerY - 100, "A")
    }
    if (stateB !== "superposition") {
      drawMeasurementDevice(ctx, particleBX, centerY - 100, "B")
    }
  }

  const drawParticle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    state: SpinState,
    label: string,
    phase: number,
  ) => {
    // Draw particle
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw spin state
    if (state === "superposition") {
      // Draw superposition as rotating vector
      const spinX = Math.cos(phase) * 15
      const spinY = Math.sin(phase) * 15

      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + spinX, y + spinY)
      ctx.stroke()

      // Draw probability clouds
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"
      ctx.beginPath()
      ctx.arc(x, y - 30, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(239, 68, 68, 0.3)"
      ctx.beginPath()
      ctx.arc(x, y + 30, 10, 0, Math.PI * 2)
      ctx.fill()
    } else if (state === "up") {
      // Draw up arrow
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - 25)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(x - 5, y - 20)
      ctx.lineTo(x, y - 25)
      ctx.lineTo(x + 5, y - 20)
      ctx.stroke()
    } else if (state === "down") {
      // Draw down arrow
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + 25)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(x - 5, y + 20)
      ctx.lineTo(x, y + 25)
      ctx.lineTo(x + 5, y + 20)
      ctx.stroke()
    }

    // Draw label
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "18px sans-serif"
    ctx.fillText(`Particle ${label}`, x - 30, y + 50)
  }

  const drawMeasurementDevice = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string) => {
    // Draw detector
    ctx.fillStyle = "#64748b"
    ctx.fillRect(x - 25, y - 15, 50, 30)

    ctx.fillStyle = "#e2e8f0"
    ctx.font = "12px sans-serif"
    ctx.fillText(`Detector ${label}`, x - 25, y - 20)
  }

  const measureParticle = (particle: "A" | "B") => {
    if (particle === "A" && particleA === "superposition") {
      const result: SpinState = Math.random() < 0.5 ? "up" : "down"
      setParticleA(result)

      if (isEntangled && particleB === "superposition") {
        // Instant correlation due to entanglement
        setParticleB(result === "up" ? "down" : "up")
      }

      setMeasurementsMade((prev) => prev + 1)
      setCorrelationData((prev) => [
        ...prev,
        { a: result, b: particleB === "superposition" ? (result === "up" ? "down" : "up") : particleB },
      ])
    } else if (particle === "B" && particleB === "superposition") {
      const result: SpinState = Math.random() < 0.5 ? "up" : "down"
      setParticleB(result)

      if (isEntangled && particleA === "superposition") {
        // Instant correlation due to entanglement
        setParticleA(result === "up" ? "down" : "up")
      }

      setMeasurementsMade((prev) => prev + 1)
      setCorrelationData((prev) => [
        ...prev,
        { a: particleA === "superposition" ? (result === "up" ? "down" : "up") : particleA, b: result },
      ])
    }
  }

  const resetSystem = () => {
    setParticleA("superposition")
    setParticleB("superposition")
    setMeasurementsMade(0)
    setCorrelationData([])
  }

  const calculateCorrelation = () => {
    if (correlationData.length === 0) return 0

    let matches = 0
    correlationData.forEach((data) => {
      if ((data.a === "up" && data.b === "down") || (data.a === "down" && data.b === "up")) {
        matches++
      }
    })

    return (matches / correlationData.length) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => measureParticle("A")}
            disabled={particleA !== "superposition"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Measure A
          </Button>
          <Button
            onClick={() => measureParticle("B")}
            disabled={particleB !== "superposition"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Measure B
          </Button>
          <Button onClick={resetSystem} variant="outline" className="border-slate-600 bg-transparent">
            Reset System
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Badge variant={isEntangled ? "default" : "secondary"} className="bg-purple-600">
            {isEntangled ? "Entangled" : "Separable"}
          </Badge>
          <Button onClick={() => setIsEntangled(!isEntangled)} variant="outline" size="sm" className="border-slate-600">
            Toggle
          </Button>
        </div>
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
        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-200 mb-2">Particle A</h3>
            <p className="text-sm text-blue-100">
              State: {particleA === "superposition" ? "|+⟩ + |−⟩" : particleA === "up" ? "|↑⟩" : "|↓⟩"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-200 mb-2">Particle B</h3>
            <p className="text-sm text-blue-100">
              State: {particleB === "superposition" ? "|+⟩ + |−⟩" : particleB === "up" ? "|↑⟩" : "|↓⟩"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-600">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-200 mb-2">Correlation</h3>
            <p className="text-sm text-blue-100">Anti-correlation: {calculateCorrelation().toFixed(1)}%</p>
            <p className="text-xs text-blue-200 mt-1">Measurements: {measurementsMade}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-800/30 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">Quantum Entanglement:</h3>
        <p className="text-sm text-blue-100">
          {isEntangled
            ? 'The particles are quantum entangled in a singlet state. Measuring one particle instantly determines the state of the other, regardless of distance. This demonstrates "spooky action at a distance" - the non-local correlations that Einstein found troubling.'
            : "The particles are in separable states. Each measurement is independent and random, showing no correlation between the particles."}
        </p>
      </div>
    </div>
  )
}
