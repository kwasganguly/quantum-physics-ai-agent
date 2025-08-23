"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SuperpositionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [coherenceTime, setCoherenceTime] = useState([100])
  const [stateAmplitude, setStateAmplitude] = useState([70])
  const [measurementMade, setMeasurementMade] = useState(false)
  const [measuredState, setMeasuredState] = useState<"up" | "down" | null>(null)
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

      if (measurementMade) {
        drawCollapsedState(ctx, measuredState)
      } else {
        drawSuperposition(ctx, time, stateAmplitude[0], coherenceTime[0])
      }

      time += 0.02
      if (isRunning && !measurementMade) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, coherenceTime, stateAmplitude, measurementMade, measuredState])

  const drawSuperposition = (ctx: CanvasRenderingContext2D, time: number, amplitude: number, coherence: number) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    // Draw quantum state sphere (Bloch sphere representation)
    ctx.strokeStyle = "#475569"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2)
    ctx.stroke()

    // Draw coordinate axes
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 1
    // X axis
    ctx.beginPath()
    ctx.moveTo(centerX - 140, centerY)
    ctx.lineTo(centerX + 140, centerY)
    ctx.stroke()
    // Y axis
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 140)
    ctx.lineTo(centerX, centerY + 140)
    ctx.stroke()

    // Labels
    ctx.fillStyle = "#94a3b8"
    ctx.font = "14px sans-serif"
    ctx.fillText("|↑⟩", centerX - 10, centerY - 130)
    ctx.fillText("|↓⟩", centerX - 10, centerY + 145)
    ctx.fillText("|+⟩", centerX + 125, centerY + 5)
    ctx.fillText("|−⟩", centerX - 140, centerY + 5)

    // Calculate superposition state vector
    const theta = (amplitude / 100) * Math.PI
    const phi = (time * 2 * Math.PI) / (coherence / 10)

    const stateX = Math.sin(theta) * Math.cos(phi) * 120
    const stateY = -Math.cos(theta) * 120
    const stateZ = Math.sin(theta) * Math.sin(phi) * 60

    // Draw state vector
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + stateX, centerY + stateY)
    ctx.stroke()

    // Draw state vector tip
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(centerX + stateX, centerY + stateY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw probability clouds
    const upProb = Math.cos(theta / 2) ** 2
    const downProb = Math.sin(theta / 2) ** 2

    // Up state cloud
    ctx.fillStyle = `rgba(34, 197, 94, ${upProb * 0.3})`
    ctx.beginPath()
    ctx.arc(centerX, centerY - 120, 30 * upProb, 0, Math.PI * 2)
    ctx.fill()

    // Down state cloud
    ctx.fillStyle = `rgba(239, 68, 68, ${downProb * 0.3})`
    ctx.beginPath()
    ctx.arc(centerX, centerY + 120, 30 * downProb, 0, Math.PI * 2)
    ctx.fill()

    // Draw probability text
    ctx.fillStyle = "#22c55e"
    ctx.font = "16px sans-serif"
    ctx.fillText(`P(↑) = ${(upProb * 100).toFixed(1)}%`, centerX + 160, centerY - 60)

    ctx.fillStyle = "#ef4444"
    ctx.fillText(`P(↓) = ${(downProb * 100).toFixed(1)}%`, centerX + 160, centerY - 30)

    // Phase information
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText(`φ = ${(phi % (2 * Math.PI)).toFixed(2)} rad`, centerX + 160, centerY + 10)
  }

  const drawCollapsedState = (ctx: CanvasRenderingContext2D, state: "up" | "down" | null) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    // Draw collapsed state
    ctx.strokeStyle = "#475569"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2)
    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 140)
    ctx.lineTo(centerX, centerY + 140)
    ctx.stroke()

    if (state === "up") {
      // Draw up state
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX, centerY - 120)
      ctx.stroke()

      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(centerX, centerY - 120, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#22c55e"
      ctx.font = "20px sans-serif"
      ctx.fillText("State: |↑⟩", centerX + 160, centerY - 20)
      ctx.fillText("P(↑) = 100%", centerX + 160, centerY + 10)
    } else if (state === "down") {
      // Draw down state
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX, centerY + 120)
      ctx.stroke()

      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX, centerY + 120, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ef4444"
      ctx.font = "20px sans-serif"
      ctx.fillText("State: |↓⟩", centerX + 160, centerY - 20)
      ctx.fillText("P(↓) = 100%", centerX + 160, centerY + 10)
    }
  }

  const makeMeasurement = () => {
    const theta = (stateAmplitude[0] / 100) * Math.PI
    const upProb = Math.cos(theta / 2) ** 2
    const result = Math.random() < upProb ? "up" : "down"

    setMeasuredState(result)
    setMeasurementMade(true)
    setIsRunning(false)
  }

  const resetSimulation = () => {
    setMeasurementMade(false)
    setMeasuredState(null)
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            disabled={measurementMade}
            variant={isRunning ? "destructive" : "default"}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRunning ? "Pause" : "Start"} Evolution
          </Button>
          <Button onClick={makeMeasurement} disabled={measurementMade} className="bg-purple-600 hover:bg-purple-700">
            Measure State
          </Button>
          <Button onClick={resetSimulation} variant="outline" className="border-slate-600 bg-transparent">
            Reset
          </Button>
        </div>

        {measurementMade && (
          <Badge variant="secondary" className="bg-slate-700 text-white">
            Wavefunction Collapsed!
          </Badge>
        )}
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
          <label className="text-sm font-medium text-blue-200">State Amplitude: {stateAmplitude[0]}%</label>
          <Slider
            value={stateAmplitude}
            onValueChange={setStateAmplitude}
            max={100}
            min={0}
            step={5}
            disabled={measurementMade}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Coherence Time: {coherenceTime[0]}</label>
          <Slider
            value={coherenceTime}
            onValueChange={setCoherenceTime}
            max={200}
            min={20}
            step={10}
            disabled={measurementMade}
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-slate-800/30 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">Quantum State:</h3>
        <p className="text-sm text-blue-100">
          {measurementMade
            ? `The quantum system has collapsed to a definite state: ${measuredState === "up" ? "|↑⟩" : "|↓⟩"}. The superposition is destroyed and the system now has a definite value.`
            : "The quantum system exists in a superposition of |↑⟩ and |↓⟩ states. The rotating vector shows the quantum phase evolution, and the probability clouds show the likelihood of measuring each state."}
        </p>
      </div>
    </div>
  )
}
