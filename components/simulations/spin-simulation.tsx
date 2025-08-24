"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SpinSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spinState, setSpinState] = useState<"up" | "down" | "superposition">("superposition")
  const [measurementBasis, setMeasurementBasis] = useState<"z" | "x" | "y">("z")
  const [measurements, setMeasurements] = useState<{ basis: string; result: string }[]>([])
  const [isAnimating, setIsAnimating] = useState(true)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Draw Bloch sphere
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1

      // Sphere outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
      ctx.stroke()

      // Axes
      ctx.beginPath()
      ctx.moveTo(centerX - 120, centerY)
      ctx.lineTo(centerX + 120, centerY)
      ctx.moveTo(centerX, centerY - 120)
      ctx.lineTo(centerX, centerY + 120)
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("X", centerX + 125, centerY + 5)
      ctx.fillText("Y", centerX - 10, centerY - 125)
      ctx.fillText("Z", centerX + 5, centerY - 125)

      // Draw spin vector
      let vectorX = 0,
        vectorY = 0,
        vectorZ = 0

      if (spinState === "up") {
        vectorZ = 1
      } else if (spinState === "down") {
        vectorZ = -1
      } else {
        // Superposition - rotating vector
        const t = isAnimating ? time * 0.002 : 0
        vectorX = Math.cos(t) * 0.7
        vectorY = Math.sin(t) * 0.7
        vectorZ = 0.3
      }

      // Project 3D vector to 2D
      const projX = centerX + vectorX * 100
      const projY = centerY - vectorZ * 100

      // Draw vector
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(projX, projY)
      ctx.stroke()

      // Draw vector tip
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(projX, projY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw measurement basis indicator
      ctx.strokeStyle = measurementBasis === "z" ? "#22c55e" : measurementBasis === "x" ? "#ef4444" : "#3b82f6"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])

      if (measurementBasis === "z") {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - 110)
        ctx.lineTo(centerX, centerY + 110)
        ctx.stroke()
      } else if (measurementBasis === "x") {
        ctx.beginPath()
        ctx.moveTo(centerX - 110, centerY)
        ctx.lineTo(centerX + 110, centerY)
        ctx.stroke()
      } else {
        // Y basis (into/out of screen - show as circle)
        ctx.beginPath()
        ctx.arc(centerX, centerY, 110, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.setLineDash([])

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
  }, [spinState, measurementBasis, isAnimating])

  const measureSpin = () => {
    let result: "up" | "down"

    if (spinState === "superposition") {
      // Random measurement result for superposition
      result = Math.random() > 0.5 ? "up" : "down"
    } else {
      // Deterministic result for definite states
      if (measurementBasis === "z") {
        result = spinState
      } else {
        // For other bases, random result
        result = Math.random() > 0.5 ? "up" : "down"
      }
    }

    setSpinState(result)
    setMeasurements((prev) => [
      ...prev.slice(-9),
      {
        basis: measurementBasis,
        result: result === "up" ? "↑" : "↓",
      },
    ])
  }

  const resetSpin = () => {
    setSpinState("superposition")
    setMeasurements([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Bloch Sphere
              <Badge variant={spinState === "superposition" ? "secondary" : "outline"}>
                {spinState === "superposition" ? "Superposition" : `Spin ${spinState}`}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4">
              <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
                {isAnimating ? "Pause" : "Animate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quantum Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-slate-300 mb-2">Measurement Basis:</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => setMeasurementBasis("z")}
                  variant={measurementBasis === "z" ? "default" : "outline"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Z-axis
                </Button>
                <Button
                  onClick={() => setMeasurementBasis("x")}
                  variant={measurementBasis === "x" ? "default" : "outline"}
                  className="bg-red-600 hover:bg-red-700"
                >
                  X-axis
                </Button>
                <Button
                  onClick={() => setMeasurementBasis("y")}
                  variant={measurementBasis === "y" ? "default" : "outline"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Y-axis
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={measureSpin} className="w-full bg-yellow-600 hover:bg-yellow-700">
                Measure Spin
              </Button>
              <Button onClick={resetSpin} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset to Superposition
              </Button>
            </div>

            <div>
              <h4 className="text-slate-300 mb-2">Recent Measurements:</h4>
              <div className="grid grid-cols-5 gap-1">
                {measurements.map((measurement, i) => (
                  <div key={i} className="text-center p-2 bg-slate-800 rounded text-sm">
                    <div className="text-slate-400">{measurement.basis.toUpperCase()}</div>
                    <div className="text-lg">{measurement.result}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Understanding Quantum Spin</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Quantum spin is an intrinsic property of particles that has no classical analog. The Bloch sphere represents
            all possible spin states of a spin-1/2 particle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-yellow-400 font-semibold">Spin Vector:</h4>
              <p className="text-sm">Points to the current quantum state on the Bloch sphere</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">Measurement Basis:</h4>
              <p className="text-sm">The direction along which we measure the spin</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold">Superposition:</h4>
              <p className="text-sm">Quantum state existing in multiple states simultaneously</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
