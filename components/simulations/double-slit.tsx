"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DoubleSlitExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [detectorOn, setDetectorOn] = useState(false)
  const [particleCount, setParticleCount] = useState(0)
  const [pattern, setPattern] = useState<number[]>(new Array(100).fill(0))
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

      // Draw slits
      ctx.fillStyle = "#374151"
      ctx.fillRect(width * 0.3, 0, 20, height * 0.4)
      ctx.fillRect(width * 0.3, height * 0.6, 20, height * 0.4)

      // Draw slit openings
      ctx.fillStyle = "#000"
      ctx.fillRect(width * 0.3, height * 0.4, 20, height * 0.1)
      ctx.fillRect(width * 0.3, height * 0.5, 20, height * 0.1)

      // Draw screen
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(width * 0.8, 0, 10, height)

      // Draw interference pattern
      if (!detectorOn) {
        // Wave interference pattern
        for (let i = 0; i < pattern.length; i++) {
          const intensity = pattern[i]
          const y = (i / pattern.length) * height
          const alpha = Math.min(intensity / 50, 1)
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`
          ctx.fillRect(width * 0.8, y, 10, height / pattern.length)
        }
      } else {
        // Particle detection pattern (two bands)
        ctx.fillStyle = "rgba(34, 197, 94, 0.6)"
        ctx.fillRect(width * 0.8, height * 0.35, 10, height * 0.15)
        ctx.fillRect(width * 0.8, height * 0.5, 10, height * 0.15)
      }

      // Draw particles
      if (isRunning) {
        const time = Date.now() * 0.001
        for (let i = 0; i < 5; i++) {
          const x = (time * 100 + i * 50) % (width * 0.9)
          const y = height * 0.5 + Math.sin(time + i) * 20

          ctx.fillStyle = "#fbbf24"
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (detectorOn) {
        // Draw detector
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(width * 0.5, height * 0.35, 5, height * 0.3)
      }
    }

    const animate = () => {
      draw()
      if (isRunning) {
        // Update interference pattern
        if (!detectorOn) {
          setPattern((prev) =>
            prev.map((val, i) => {
              const y = i / prev.length
              const interference =
                Math.sin(y * Math.PI * 8) *
                Math.sin(y * Math.PI * 8) *
                Math.cos(y * Math.PI * 4) *
                Math.cos(y * Math.PI * 4)
              return Math.min(val + interference * 2, 100)
            }),
          )
        }
        setParticleCount((prev) => prev + 1)
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, detectorOn, pattern])

  const startExperiment = () => {
    setIsRunning(true)
    setParticleCount(0)
    if (!detectorOn) {
      setPattern(new Array(100).fill(0))
    }
  }

  const stopExperiment = () => {
    setIsRunning(false)
  }

  const resetExperiment = () => {
    setIsRunning(false)
    setParticleCount(0)
    setPattern(new Array(100).fill(0))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Double-Slit Experiment
                <Badge variant={detectorOn ? "destructive" : "secondary"}>
                  {detectorOn ? "Detector ON" : "Detector OFF"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border border-slate-600 rounded bg-black"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={startExperiment} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
                Start Experiment
              </Button>
              <Button onClick={stopExperiment} disabled={!isRunning} className="w-full bg-red-600 hover:bg-red-700">
                Stop
              </Button>
              <Button onClick={resetExperiment} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-600">
              <Button
                onClick={() => setDetectorOn(!detectorOn)}
                className={`w-full ${detectorOn ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {detectorOn ? "Remove Detector" : "Add Detector"}
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-600 text-slate-300">
              <p className="text-sm">
                Particles fired: <span className="text-yellow-400">{particleCount}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Wave-Particle Duality</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            This experiment demonstrates the fundamental mystery of quantum mechanics: particles behave like waves when
            unobserved, but like particles when measured.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold">Without Detector:</h4>
              <p className="text-sm">Particles create an interference pattern, proving wave-like behavior.</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">With Detector:</h4>
              <p className="text-sm">Particles create two bands, proving particle-like behavior.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
