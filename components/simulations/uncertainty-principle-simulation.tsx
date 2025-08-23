"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function UncertaintyPrincipleSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [measurementType, setMeasurementType] = useState<"position" | "momentum">("position")
  const [precision, setPrecision] = useState([50])
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

      drawUncertaintyVisualization(ctx, time, measurementType, precision[0])

      time += 0.05
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
  }, [measurementType, precision, isRunning])

  const drawUncertaintyVisualization = (
    ctx: CanvasRenderingContext2D,
    time: number,
    type: "position" | "momentum",
    precision: number,
  ) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    // Calculate uncertainties based on Heisenberg principle
    const positionUncertainty = type === "position" ? 100 - precision : precision
    const momentumUncertainty = type === "momentum" ? 100 - precision : precision

    // Draw position measurement
    drawPositionMeasurement(ctx, centerX - 200, centerY, positionUncertainty, time)

    // Draw momentum measurement
    drawMomentumMeasurement(ctx, centerX + 200, centerY, momentumUncertainty, time)

    // Draw uncertainty relationship
    drawUncertaintyRelation(ctx, positionUncertainty, momentumUncertainty)
  }

  const drawPositionMeasurement = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    uncertainty: number,
    time: number,
  ) => {
    // Draw position axis
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 100, y + 50)
    ctx.lineTo(x + 100, y + 50)
    ctx.stroke()

    // Draw position distribution (Gaussian)
    const sigma = (uncertainty / 100) * 50 + 5
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let i = -100; i <= 100; i += 2) {
      const gaussian = Math.exp(-(i * i) / (2 * sigma * sigma))
      const plotY = y + 50 - gaussian * 40

      if (i === -100) {
        ctx.moveTo(x + i, plotY)
      } else {
        ctx.lineTo(x + i, plotY)
      }
    }
    ctx.stroke()

    // Draw particle position indicator
    const particleX = x + Math.sin(time) * sigma * 0.5
    ctx.fillStyle = "#fbbf24"
    ctx.beginPath()
    ctx.arc(particleX, y + 50, 4, 0, Math.PI * 2)
    ctx.fill()

    // Labels
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "16px sans-serif"
    ctx.fillText("Position", x - 30, y - 60)
    ctx.font = "12px sans-serif"
    ctx.fillText(`Δx ≈ ${(uncertainty / 10).toFixed(1)}`, x - 25, y - 40)
  }

  const drawMomentumMeasurement = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    uncertainty: number,
    time: number,
  ) => {
    // Draw momentum axis
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 100, y + 50)
    ctx.lineTo(x + 100, y + 50)
    ctx.stroke()

    // Draw momentum distribution
    const sigma = (uncertainty / 100) * 50 + 5
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let i = -100; i <= 100; i += 2) {
      const gaussian = Math.exp(-(i * i) / (2 * sigma * sigma))
      const plotY = y + 50 - gaussian * 40

      if (i === -100) {
        ctx.moveTo(x + i, plotY)
      } else {
        ctx.lineTo(x + i, plotY)
      }
    }
    ctx.stroke()

    // Draw momentum vector
    const momentumLength = 30 + Math.cos(time * 2) * sigma * 0.3
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(x, y + 50)
    ctx.lineTo(x + momentumLength, y + 50)
    ctx.stroke()

    // Arrow head
    ctx.beginPath()
    ctx.moveTo(x + momentumLength - 5, y + 45)
    ctx.lineTo(x + momentumLength, y + 50)
    ctx.lineTo(x + momentumLength - 5, y + 55)
    ctx.stroke()

    // Labels
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "16px sans-serif"
    ctx.fillText("Momentum", x - 35, y - 60)
    ctx.font = "12px sans-serif"
    ctx.fillText(`Δp ≈ ${(uncertainty / 10).toFixed(1)}`, x - 25, y - 40)
  }

  const drawUncertaintyRelation = (ctx: CanvasRenderingContext2D, posUncertainty: number, momUncertainty: number) => {
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    // Draw Heisenberg inequality
    ctx.fillStyle = "#8b5cf6"
    ctx.font = "20px sans-serif"
    ctx.fillText("Δx · Δp ≥ ℏ/2", centerX - 50, centerY - 100)

    // Calculate product
    const product = (posUncertainty / 10) * (momUncertainty / 10)
    const minProduct = 2.5 // Representing ℏ/2 in our units

    ctx.font = "16px sans-serif"
    ctx.fillStyle = product >= minProduct ? "#22c55e" : "#ef4444"
    ctx.fillText(`Δx · Δp = ${product.toFixed(2)}`, centerX - 40, centerY - 70)

    ctx.fillStyle = "#94a3b8"
    ctx.font = "14px sans-serif"
    ctx.fillText(`Minimum: ${minProduct}`, centerX - 30, centerY - 50)

    // Draw connecting line showing trade-off
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX - 150, centerY)
    ctx.lineTo(centerX + 150, centerY)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const positionUncertainty = measurementType === "position" ? 100 - precision[0] : precision[0]
  const momentumUncertainty = measurementType === "momentum" ? 100 - precision[0] : precision[0]
  const product = (positionUncertainty / 10) * (momentumUncertainty / 10)
  const isValidMeasurement = product >= 2.5

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={measurementType === "position" ? "default" : "outline"}
            onClick={() => setMeasurementType("position")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Precise Position
          </Button>
          <Button
            variant={measurementType === "momentum" ? "default" : "outline"}
            onClick={() => setMeasurementType("momentum")}
            className="bg-red-600 hover:bg-red-700"
          >
            Precise Momentum
          </Button>
        </div>

        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunning ? "Pause" : "Start"} Animation
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

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-blue-200">Measurement Precision: {precision[0]}%</label>
          <Slider value={precision} onValueChange={setPrecision} max={95} min={5} step={5} className="w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-200 mb-2">Position Uncertainty</h3>
              <p className="text-sm text-blue-100">Δx ≈ {(positionUncertainty / 10).toFixed(1)}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-600">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-200 mb-2">Momentum Uncertainty</h3>
              <p className="text-sm text-red-100">Δp ≈ {(momentumUncertainty / 10).toFixed(1)}</p>
            </CardContent>
          </Card>

          <Card className={`border-slate-600 ${isValidMeasurement ? "bg-green-800/30" : "bg-red-800/30"}`}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-purple-200 mb-2">Uncertainty Product</h3>
              <p className="text-sm text-purple-100">Δx·Δp = {product.toFixed(2)}</p>
              <p className="text-xs text-purple-200 mt-1">{isValidMeasurement ? "✓ Valid" : "✗ Violates HUP"}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-slate-800/30 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">Heisenberg Uncertainty Principle:</h3>
        <p className="text-sm text-blue-100">
          {measurementType === "position"
            ? "Focusing on precise position measurement increases position certainty but decreases momentum certainty. The more precisely we know where a particle is, the less we can know about its momentum."
            : "Focusing on precise momentum measurement increases momentum certainty but decreases position certainty. The more precisely we know a particle's momentum, the less we can know about its position."}{" "}
          The product Δx·Δp must always be greater than or equal to ℏ/2, representing a fundamental limit of nature.
        </p>
      </div>
    </div>
  )
}
