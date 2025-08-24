"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuantumZenoEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [measurementFrequency, setMeasurementFrequency] = useState([1])
  const [isRunning, setIsRunning] = useState(false)
  const [evolutionTime, setEvolutionTime] = useState(0)
  const [measurements, setMeasurements] = useState<number[]>([])
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
      const centerY = height / 2

      // Draw time axis
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, centerY + 100)
      ctx.lineTo(width - 50, centerY + 100)
      ctx.stroke()

      // Draw probability evolution
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.beginPath()

      const timeScale = (width - 100) / 10 // 10 seconds total
      const freq = measurementFrequency[0]

      for (let t = 0; t <= 10; t += 0.1) {
        const x = 50 + t * timeScale

        // Calculate probability with Zeno effect
        let probability
        if (freq === 0) {
          // No measurements - normal evolution
          probability = Math.sin((t * Math.PI) / 4) ** 2
        } else {
          // With measurements - suppressed evolution
          const measurementInterval = 1 / freq
          const numMeasurements = Math.floor(t / measurementInterval)
          const timeSinceLastMeasurement = t - numMeasurements * measurementInterval

          // Probability resets after each measurement
          probability = Math.sin((timeSinceLastMeasurement * Math.PI) / 4) ** 2
          probability *= Math.exp(-freq * 0.1) // Suppression factor
        }

        const y = centerY + 100 - probability * 80

        if (t === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw measurement points
      if (freq > 0) {
        ctx.fillStyle = "#ef4444"
        const measurementInterval = 1 / freq
        for (let t = measurementInterval; t <= 10; t += measurementInterval) {
          const x = 50 + t * timeScale
          ctx.beginPath()
          ctx.arc(x, centerY + 100, 4, 0, Math.PI * 2)
          ctx.fill()

          // Vertical line showing measurement
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 1
          ctx.setLineDash([2, 2])
          ctx.beginPath()
          ctx.moveTo(x, centerY + 20)
          ctx.lineTo(x, centerY + 100)
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // Draw current time indicator
      if (isRunning) {
        const currentX = 50 + (evolutionTime % 10) * timeScale
        ctx.strokeStyle = "#fbbf24"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(currentX, centerY + 20)
        ctx.lineTo(currentX, centerY + 180)
        ctx.stroke()
      }

      // Draw quantum state visualization
      const stateX = width * 0.8
      const stateY = centerY - 50

      // Ground state
      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(stateX, stateY, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("|0⟩", stateX, stateY + 4)

      // Excited state
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(stateX, stateY - 60, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.fillText("|1⟩", stateX, stateY - 56)

      // Transition probability arrow
      const currentProb = isRunning
        ? freq === 0
          ? Math.sin((evolutionTime * Math.PI) / 4) ** 2
          : Math.sin(((evolutionTime % (1 / Math.max(freq, 0.1))) * Math.PI) / 4) ** 2 * Math.exp(-freq * 0.1)
        : 0

      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(stateX, stateY - 10)
      ctx.lineTo(stateX, stateY - 50 + (1 - currentProb) * 40)
      ctx.stroke()

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Time (s)", width - 100, centerY + 130)
      ctx.save()
      ctx.translate(20, centerY + 50)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("Transition Probability", 0, 0)
      ctx.restore()
    }

    const animate = () => {
      draw()
      if (isRunning) {
        setEvolutionTime((prev) => prev + 0.05)
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [measurementFrequency, isRunning, evolutionTime])

  const startSimulation = () => {
    setIsRunning(true)
    setEvolutionTime(0)
    setMeasurements([])
  }

  const stopSimulation = () => {
    setIsRunning(false)
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setEvolutionTime(0)
    setMeasurements([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quantum Zeno Effect</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Measurement Frequency: {measurementFrequency[0]} Hz
              </label>
              <Slider
                value={measurementFrequency}
                onValueChange={setMeasurementFrequency}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={startSimulation} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
                Start Evolution
              </Button>
              <Button onClick={stopSimulation} disabled={!isRunning} className="w-full bg-red-600 hover:bg-red-700">
                Stop
              </Button>
              <Button onClick={resetSimulation} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset
              </Button>
            </div>

            <div className="bg-slate-800 p-3 rounded">
              <div className="text-slate-300 text-sm">Evolution Time:</div>
              <div className="text-yellow-400 text-lg font-mono">{evolutionTime.toFixed(2)}s</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Understanding the Quantum Zeno Effect</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The Quantum Zeno Effect demonstrates that frequent measurements can freeze quantum evolution. Just like
            Zeno's paradox where an arrow never reaches its target, frequent quantum measurements can prevent a system
            from evolving to a different state.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold">No Measurements:</h4>
              <p className="text-sm">System evolves naturally between quantum states</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">Frequent Measurements:</h4>
              <p className="text-sm">Evolution is suppressed, system stays in initial state</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
