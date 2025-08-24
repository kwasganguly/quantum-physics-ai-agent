"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BellInequality() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [measurements, setMeasurements] = useState<
    {
      angleA: number
      angleB: number
      resultA: number
      resultB: number
      correlation: number
    }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)
  const [bellValue, setBellValue] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Draw measurement setup
      // Alice's detector
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(centerX - 150, centerY, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Alice", centerX - 150, centerY + 4)

      // Bob's detector
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX + 150, centerY, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Bob", centerX + 150, centerY + 4)

      // Entangled particle source
      ctx.fillStyle = "#8b5cf6"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Entanglement lines
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX - 15, centerY)
      ctx.lineTo(centerX - 120, centerY)
      ctx.moveTo(centerX + 15, centerY)
      ctx.lineTo(centerX + 120, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw measurement angles
      if (measurements.length > 0) {
        const latest = measurements[measurements.length - 1]

        // Alice's measurement angle
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(centerX - 150, centerY)
        ctx.lineTo(centerX - 150 + Math.cos(latest.angleA) * 40, centerY - Math.sin(latest.angleA) * 40)
        ctx.stroke()

        // Bob's measurement angle
        ctx.strokeStyle = "#ef4444"
        ctx.beginPath()
        ctx.moveTo(centerX + 150, centerY)
        ctx.lineTo(centerX + 150 + Math.cos(latest.angleB) * 40, centerY - Math.sin(latest.angleB) * 40)
        ctx.stroke()
      }

      // Draw correlation plot
      const plotX = centerX
      const plotY = height - 80
      const plotWidth = 200
      const plotHeight = 60

      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.rect(plotX - plotWidth / 2, plotY - plotHeight / 2, plotWidth, plotHeight)
      ctx.stroke()

      // Plot correlation data
      if (measurements.length > 1) {
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2
        ctx.beginPath()

        measurements.slice(-50).forEach((measurement, i) => {
          const x = plotX - plotWidth / 2 + (i / 49) * plotWidth
          const y = plotY - (measurement.correlation * plotHeight) / 4

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Correlation", centerX, plotY + 40)
      ctx.fillText(`Bell Value: ${bellValue.toFixed(3)}`, centerX, plotY + 55)

      // Classical limit line
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(plotX - plotWidth / 2, plotY - plotHeight / 4)
      ctx.lineTo(plotX + plotWidth / 2, plotY - plotHeight / 4)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillText("Classical Limit (2)", plotX + plotWidth / 2 + 30, plotY - plotHeight / 4 + 4)
    }

    draw()
  }, [measurements, bellValue])

  const runMeasurement = () => {
    // Random measurement angles
    const angleA = Math.random() * Math.PI * 2
    const angleB = Math.random() * Math.PI * 2

    // Quantum correlation for entangled particles
    const correlation = -Math.cos(angleA - angleB)

    // Measurement results (+1 or -1)
    const resultA = Math.random() > 0.5 ? 1 : -1
    const resultB = correlation > 0 ? -resultA : resultA // Anti-correlated for entangled state

    const newMeasurement = {
      angleA,
      angleB,
      resultA,
      resultB,
      correlation: resultA * resultB,
    }

    setMeasurements((prev) => [...prev.slice(-99), newMeasurement])

    // Calculate Bell parameter (CHSH inequality)
    if (measurements.length >= 4) {
      const recent = [...measurements.slice(-3), newMeasurement]
      const S = Math.abs(recent[0].correlation + recent[1].correlation + recent[2].correlation - recent[3].correlation)
      setBellValue(S)
    }
  }

  const runMultipleMeasurements = () => {
    setIsRunning(true)
    const interval = setInterval(() => {
      runMeasurement()
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      setIsRunning(false)
    }, 5000)
  }

  const resetExperiment = () => {
    setMeasurements([])
    setBellValue(0)
    setIsRunning(false)
  }

  const averageCorrelation =
    measurements.length > 0 ? measurements.reduce((sum, m) => sum + m.correlation, 0) / measurements.length : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Bell Test Experiment
              <Badge variant={bellValue > 2 ? "default" : "secondary"}>{bellValue > 2 ? "Quantum" : "Classical"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Experiment Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={runMeasurement} disabled={isRunning} className="w-full bg-blue-600 hover:bg-blue-700">
                Single Measurement
              </Button>
              <Button
                onClick={runMultipleMeasurements}
                disabled={isRunning}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Run 50 Measurements
              </Button>
              <Button onClick={resetExperiment} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset Experiment
              </Button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Measurements:</div>
                <div className="text-yellow-400 text-lg font-mono">{measurements.length}</div>
              </div>

              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Average Correlation:</div>
                <div className="text-green-400 text-lg font-mono">{averageCorrelation.toFixed(3)}</div>
              </div>

              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Bell Parameter (S):</div>
                <div className={`text-lg font-mono ${bellValue > 2 ? "text-purple-400" : "text-orange-400"}`}>
                  {bellValue.toFixed(3)}
                </div>
                <div className="text-xs text-slate-400">
                  {bellValue > 2 ? "Violates Bell inequality!" : "Within classical bounds"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Bell's Inequality Test</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Bell's inequality provides a way to test whether quantum mechanics or local hidden variable theories
            correctly describe nature. Quantum mechanics predicts violations of Bell's inequality that classical physics
            cannot explain.
          </p>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-center text-lg font-mono mb-2">
              <span className="text-yellow-400">CHSH Inequality:</span> |S| ≤ 2 (Classical)
            </div>
            <div className="text-center text-lg font-mono">
              <span className="text-purple-400">Quantum Maximum:</span> |S| ≤ 2√2 ≈ 2.828
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-blue-400 font-semibold">Alice & Bob:</h4>
              <p className="text-sm">Two distant observers measuring entangled particles</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">Correlation Plot:</h4>
              <p className="text-sm">Shows the correlation between measurement results</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
