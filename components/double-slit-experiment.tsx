"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DoubleSlitExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [observing, setObserving] = useState(false)
  const [detectionPattern, setDetectionPattern] = useState<number[]>(new Array(100).fill(0))
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw slits
      const slitX = canvas.width * 0.3
      const slitWidth = 4
      const slitHeight = 40
      const slitSeparation = 60
      const centerY = canvas.height / 2

      // Draw barrier with slits
      ctx.fillStyle = "#374151"
      ctx.fillRect(slitX - 10, 0, 20, centerY - slitSeparation / 2 - slitHeight / 2)
      ctx.fillRect(slitX - 10, centerY - slitSeparation / 2 + slitHeight / 2, 20, slitSeparation - slitHeight)
      ctx.fillRect(
        slitX - 10,
        centerY + slitSeparation / 2 + slitHeight / 2,
        20,
        canvas.height - (centerY + slitSeparation / 2 + slitHeight / 2),
      )

      // Draw screen
      const screenX = canvas.width * 0.8
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(screenX, 0)
      ctx.lineTo(screenX, canvas.height)
      ctx.stroke()

      if (observing) {
        // Particle behavior - two distinct bands
        ctx.fillStyle = "#f59e0b"
        for (let i = 0; i < 50; i++) {
          const x = 50 + ((time + i * 10) % (slitX - 50))
          const slit = Math.random() > 0.5 ? 1 : -1
          const y = centerY + (slit * slitSeparation) / 4

          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Detection pattern - two bands
        ctx.fillStyle = "#f59e0b"
        for (let i = 0; i < canvas.height; i += 2) {
          const intensity1 = Math.exp(-Math.pow(i - (centerY - slitSeparation / 4), 2) / 200)
          const intensity2 = Math.exp(-Math.pow(i - (centerY + slitSeparation / 4), 2) / 200)
          const totalIntensity = (intensity1 + intensity2) * 50

          ctx.fillRect(screenX + 5, i, totalIntensity, 2)
        }
      } else {
        // Wave behavior - interference pattern
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 2

        // Draw waves from each slit
        for (let slit = -1; slit <= 1; slit += 2) {
          const slitY = centerY + (slit * slitSeparation) / 4

          for (let r = 10; r < 200; r += 20) {
            ctx.beginPath()
            ctx.arc(slitX, slitY, r + time * 2, 0, Math.PI * 2)
            ctx.globalAlpha = 0.3
            ctx.stroke()
          }
        }
        ctx.globalAlpha = 1

        // Interference pattern on screen
        ctx.fillStyle = "#06b6d4"
        for (let i = 0; i < canvas.height; i += 1) {
          const y = i
          const d1 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(y - (centerY - slitSeparation / 4), 2))
          const d2 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(y - (centerY + slitSeparation / 4), 2))
          const phaseDiff = (d2 - d1) * 0.1
          const intensity = Math.pow(Math.cos(phaseDiff), 2) * 30

          ctx.fillRect(screenX + 5, y, intensity, 1)
        }
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText("Electron Source", 10, 30)
      ctx.fillText("Double Slit", slitX - 30, 30)
      ctx.fillText("Detection Screen", screenX - 50, 30)

      if (observing) {
        ctx.fillStyle = "#f59e0b"
        ctx.fillText("Observer Present", 10, canvas.height - 20)
        ctx.fillText("Particle Pattern", screenX + 20, 30)
      } else {
        ctx.fillStyle = "#06b6d4"
        ctx.fillText("No Observer", 10, canvas.height - 20)
        ctx.fillText("Wave Interference", screenX + 20, 30)
      }

      if (isRunning) {
        time += 1
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    } else {
      animate() // Draw static frame
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, observing])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Experiment
        </Button>
        <Button
          onClick={() => setObserving(!observing)}
          variant="outline"
          className={`${observing ? "border-orange-500 text-orange-400 hover:bg-orange-500/10" : "border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"}`}
        >
          {observing ? "Remove Observer" : "Add Observer"}
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full border border-slate-600 rounded-lg bg-slate-900"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-cyan-400">Wave Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">
              When unobserved, electrons behave as waves, creating an interference pattern with alternating bright and
              dark bands.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-orange-400">Particle Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">
              When observed, electrons behave as particles, creating two distinct bands corresponding to each slit.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-green-400">The Observer Effect:</strong> This famous experiment demonstrates that
            the act of observation fundamentally changes the behavior of quantum particles. Without observation,
            electrons create wave interference patterns. With observation, they behave like classical particles!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
