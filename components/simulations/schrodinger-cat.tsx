"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function SchrodingerCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [boxState, setBoxState] = useState<"closed" | "open">("closed")
  const [catState, setCatState] = useState<"superposition" | "alive" | "dead">("superposition")
  const [decayProbability, setDecayProbability] = useState(50)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const animationRef = useRef<number>()
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isRunning && boxState === "closed") {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        setDecayProbability((prev) => Math.min(95, prev + 0.5))
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, boxState])

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

      // Draw box
      if (boxState === "closed") {
        // Closed box
        ctx.fillStyle = "#374151"
        ctx.fillRect(centerX - 100, centerY - 60, 200, 120)
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 3
        ctx.strokeRect(centerX - 100, centerY - 60, 200, 120)

        // Box lid
        ctx.fillStyle = "#4b5563"
        ctx.fillRect(centerX - 105, centerY - 65, 210, 10)

        // Superposition visualization
        if (catState === "superposition") {
          const t = time * 0.005
          const alpha = 0.3 + 0.2 * Math.sin(t)

          // Quantum field effect
          for (let i = 0; i < 20; i++) {
            const x = centerX - 80 + (i % 5) * 40
            const y = centerY - 40 + Math.floor(i / 5) * 20
            const phase = t + i * 0.5

            ctx.fillStyle = `rgba(139, 92, 246, ${alpha * Math.sin(phase)})`
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill()
          }

          // Probability waves
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
          ctx.lineWidth = 2
          ctx.beginPath()
          for (let x = centerX - 90; x < centerX + 90; x += 2) {
            const wave = Math.sin((x - centerX) * 0.1 + t) * 10
            const y = centerY + wave
            if (x === centerX - 90) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }

        // Question marks for uncertainty
        ctx.fillStyle = "#fbbf24"
        ctx.font = "bold 24px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("?", centerX - 30, centerY)
        ctx.fillText("?", centerX + 30, centerY)
      } else {
        // Open box
        ctx.fillStyle = "#374151"
        ctx.fillRect(centerX - 100, centerY - 60, 200, 120)
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 3
        ctx.strokeRect(centerX - 100, centerY - 60, 200, 120)

        // Open lid
        ctx.save()
        ctx.translate(centerX - 100, centerY - 60)
        ctx.rotate(-Math.PI / 6)
        ctx.fillStyle = "#4b5563"
        ctx.fillRect(0, -10, 210, 10)
        ctx.restore()

        // Draw cat based on state
        if (catState === "alive") {
          // Alive cat (green)
          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.arc(centerX, centerY - 10, 25, 0, Math.PI * 2)
          ctx.fill()

          // Cat ears
          ctx.beginPath()
          ctx.moveTo(centerX - 15, centerY - 25)
          ctx.lineTo(centerX - 5, centerY - 35)
          ctx.lineTo(centerX - 5, centerY - 25)
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(centerX + 15, centerY - 25)
          ctx.lineTo(centerX + 5, centerY - 35)
          ctx.lineTo(centerX + 5, centerY - 25)
          ctx.fill()

          // Eyes
          ctx.fillStyle = "#000"
          ctx.beginPath()
          ctx.arc(centerX - 8, centerY - 15, 3, 0, Math.PI * 2)
          ctx.arc(centerX + 8, centerY - 15, 3, 0, Math.PI * 2)
          ctx.fill()

          // Smile
          ctx.strokeStyle = "#000"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(centerX, centerY - 5, 8, 0, Math.PI)
          ctx.stroke()
        } else if (catState === "dead") {
          // Dead cat (red)
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(centerX, centerY + 10, 25, 0, Math.PI * 2)
          ctx.fill()

          // X eyes
          ctx.strokeStyle = "#000"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(centerX - 12, centerY + 2)
          ctx.lineTo(centerX - 4, centerY + 10)
          ctx.moveTo(centerX - 4, centerY + 2)
          ctx.lineTo(centerX - 12, centerY + 10)
          ctx.moveTo(centerX + 4, centerY + 2)
          ctx.lineTo(centerX + 12, centerY + 10)
          ctx.moveTo(centerX + 12, centerY + 2)
          ctx.lineTo(centerX + 4, centerY + 10)
          ctx.stroke()
        }
      }

      // Draw Geiger counter
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(width - 120, 20, 100, 60)
      ctx.strokeStyle = "#6b7280"
      ctx.strokeRect(width - 120, 20, 100, 60)

      ctx.fillStyle = "#e2e8f0"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Geiger Counter", width - 70, 35)

      // Decay probability display
      const probColor = decayProbability > 50 ? "#ef4444" : "#22c55e"
      ctx.fillStyle = probColor
      ctx.font = "bold 12px sans-serif"
      ctx.fillText(`${decayProbability.toFixed(1)}%`, width - 70, 55)

      // Radioactive atom
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(width - 70, 120, 15, 0, Math.PI * 2)
      ctx.fill()

      // Radiation particles
      if (isRunning) {
        const t = time * 0.01
        for (let i = 0; i < 3; i++) {
          const angle = (t + (i * Math.PI * 2) / 3) % (Math.PI * 2)
          const x = width - 70 + Math.cos(angle) * 30
          const y = 120 + Math.sin(angle) * 30

          ctx.fillStyle = `rgba(239, 68, 68, ${0.5 + 0.3 * Math.sin(t + i)})`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [boxState, catState, decayProbability, isRunning])

  const openBox = () => {
    if (boxState === "closed" && catState === "superposition") {
      // Collapse the wave function
      const result = Math.random() < decayProbability / 100 ? "dead" : "alive"
      setCatState(result)
    }
    setBoxState("open")
    setIsRunning(false)
  }

  const closeBox = () => {
    setBoxState("closed")
    setCatState("superposition")
    setDecayProbability(50)
    setTimeElapsed(0)
  }

  const startExperiment = () => {
    if (boxState === "closed") {
      setIsRunning(true)
      setCatState("superposition")
    }
  }

  const stopExperiment = () => {
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Schrödinger's Cat Experiment
              <Badge
                variant={catState === "superposition" ? "secondary" : catState === "alive" ? "default" : "destructive"}
              >
                {catState === "superposition" ? "Superposition" : catState === "alive" ? "Alive" : "Dead"}
              </Badge>
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
              <Button
                onClick={startExperiment}
                disabled={isRunning || boxState === "open"}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Experiment
              </Button>
              <Button onClick={stopExperiment} disabled={!isRunning} className="w-full bg-red-600 hover:bg-red-700">
                Stop Experiment
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openBox}
                disabled={boxState === "open"}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Open Box (Measure!)
              </Button>
              <Button onClick={closeBox} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset Experiment
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-600 space-y-3">
              <div>
                <div className="text-slate-300 text-sm mb-1">Decay Probability:</div>
                <Progress value={decayProbability} className="w-full" />
                <div className="text-center text-sm text-slate-400 mt-1">{decayProbability.toFixed(1)}%</div>
              </div>

              <div className="text-slate-300 text-sm">
                <div>
                  Time Elapsed: <span className="text-yellow-400">{(timeElapsed / 10).toFixed(1)}s</span>
                </div>
                <div>
                  Box Status: <span className="text-blue-400">{boxState}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">The Measurement Problem</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Schrödinger's cat illustrates the bizarre implications of quantum superposition when applied to macroscopic
            objects. The cat exists in a superposition of alive and dead states until the box is opened and a
            measurement is made.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold">Superposition:</h4>
              <p className="text-sm">The cat is simultaneously alive AND dead until observed</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold">Measurement:</h4>
              <p className="text-sm">Opening the box collapses the wave function to a definite state</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">Decoherence:</h4>
              <p className="text-sm">Real systems interact with environment, preventing macroscopic superposition</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
