"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UncertaintyPrinciple() {
  const positionCanvasRef = useRef<HTMLCanvasElement>(null)
  const momentumCanvasRef = useRef<HTMLCanvasElement>(null)
  const [positionUncertainty, setPositionUncertainty] = useState([50])
  const [momentumUncertainty, setMomentumUncertainty] = useState([50])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  // Calculate momentum uncertainty based on position uncertainty (simplified)
  useEffect(() => {
    const deltaX = positionUncertainty[0]
    const deltaP = Math.max(10, 2500 / deltaX) // Simplified uncertainty relation
    setMomentumUncertainty([Math.min(100, deltaP)])
  }, [positionUncertainty])

  useEffect(() => {
    const posCanvas = positionCanvasRef.current
    const momCanvas = momentumCanvasRef.current
    if (!posCanvas || !momCanvas) return

    const posCtx = posCanvas.getContext("2d")
    const momCtx = momCanvas.getContext("2d")
    if (!posCtx || !momCtx) return

    const draw = (time = 0) => {
      // Clear canvases
      posCtx.clearRect(0, 0, posCanvas.width, posCanvas.height)
      momCtx.clearRect(0, 0, momCanvas.width, momCanvas.height)

      const width = posCanvas.width
      const height = posCanvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Draw position distribution
      posCtx.strokeStyle = "#3b82f6"
      posCtx.fillStyle = "rgba(59, 130, 246, 0.3)"
      posCtx.lineWidth = 2

      const posWidth = (positionUncertainty[0] / 100) * width * 0.6
      const posHeight = 80

      posCtx.beginPath()
      for (let x = -posWidth / 2; x <= posWidth / 2; x += 2) {
        const gaussian = Math.exp(-(x * x) / (2 * (posWidth / 4) * (posWidth / 4)))
        const y = centerY - gaussian * posHeight
        if (x === -posWidth / 2) {
          posCtx.moveTo(centerX + x, y)
        } else {
          posCtx.lineTo(centerX + x, y)
        }
      }
      posCtx.stroke()

      // Fill position distribution
      posCtx.beginPath()
      posCtx.moveTo(centerX - posWidth / 2, centerY)
      for (let x = -posWidth / 2; x <= posWidth / 2; x += 2) {
        const gaussian = Math.exp(-(x * x) / (2 * (posWidth / 4) * (posWidth / 4)))
        const y = centerY - gaussian * posHeight
        posCtx.lineTo(centerX + x, y)
      }
      posCtx.lineTo(centerX + posWidth / 2, centerY)
      posCtx.closePath()
      posCtx.fill()

      // Draw momentum distribution
      momCtx.strokeStyle = "#ef4444"
      momCtx.fillStyle = "rgba(239, 68, 68, 0.3)"
      momCtx.lineWidth = 2

      const momWidth = (momentumUncertainty[0] / 100) * width * 0.6
      const momHeight = 80

      momCtx.beginPath()
      for (let x = -momWidth / 2; x <= momWidth / 2; x += 2) {
        const gaussian = Math.exp(-(x * x) / (2 * (momWidth / 4) * (momWidth / 4)))
        const y = centerY - gaussian * momHeight
        if (x === -momWidth / 2) {
          momCtx.moveTo(centerX + x, y)
        } else {
          momCtx.lineTo(centerX + x, y)
        }
      }
      momCtx.stroke()

      // Fill momentum distribution
      momCtx.beginPath()
      momCtx.moveTo(centerX - momWidth / 2, centerY)
      for (let x = -momWidth / 2; x <= momWidth / 2; x += 2) {
        const gaussian = Math.exp(-(x * x) / (2 * (momWidth / 4) * (momWidth / 4)))
        const y = centerY - gaussian * momHeight
        momCtx.lineTo(centerX + x, y)
      }
      momCtx.lineTo(centerX + momWidth / 2, centerY)
      momCtx.closePath()
      momCtx.fill()

      // Draw axes
      ;[posCtx, momCtx].forEach((ctx) => {
        ctx.strokeStyle = "#64748b"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, centerY)
        ctx.lineTo(width, centerY)
        ctx.moveTo(centerX, 0)
        ctx.lineTo(centerX, height)
        ctx.stroke()
      })

      // Add particle animation
      if (isAnimating) {
        const t = time * 0.003
        const particleX = centerX + Math.sin(t) * (posWidth / 4)

        posCtx.fillStyle = "#fbbf24"
        posCtx.beginPath()
        posCtx.arc(particleX, centerY + 20, 4, 0, Math.PI * 2)
        posCtx.fill()

        const momParticleX = centerX + Math.cos(t * 3) * (momWidth / 4)
        momCtx.fillStyle = "#fbbf24"
        momCtx.beginPath()
        momCtx.arc(momParticleX, centerY + 20, 4, 0, Math.PI * 2)
        momCtx.fill()
      }

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
  }, [positionUncertainty, momentumUncertainty, isAnimating])

  const uncertaintyProduct = (positionUncertainty[0] * momentumUncertainty[0]) / 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-blue-400">Position Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={positionCanvasRef}
              width={400}
              height={200}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-2 text-center text-slate-300">Δx = {positionUncertainty[0].toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-red-400">Momentum Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={momentumCanvasRef}
              width={400}
              height={200}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-2 text-center text-slate-300">Δp = {momentumUncertainty[0].toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Position Uncertainty (Δx): {positionUncertainty[0]}
            </label>
            <Slider
              value={positionUncertainty}
              onValueChange={setPositionUncertainty}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
              {isAnimating ? "Pause" : "Animate"} Particles
            </Button>

            <div className="text-right">
              <div className="text-slate-300 text-sm">Uncertainty Product:</div>
              <div className="text-yellow-400 text-lg font-bold">Δx·Δp = {uncertaintyProduct.toFixed(1)}</div>
              <div className="text-slate-400 text-xs">(Must be ≥ ℏ/2 ≈ 25)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Heisenberg Uncertainty Principle</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The uncertainty principle states that you cannot simultaneously know both the exact position and momentum of
            a particle. The more precisely you know one, the less precisely you can know the other.
          </p>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-center text-lg font-mono">
              <span className="text-blue-400">Δx</span> · <span className="text-red-400">Δp</span> ≥{" "}
              <span className="text-yellow-400">ℏ/2</span>
            </div>
            <div className="text-center text-sm text-slate-400 mt-2">
              Position uncertainty × Momentum uncertainty ≥ Reduced Planck constant / 2
            </div>
          </div>
          <p className="text-sm">
            This isn't due to measurement limitations, but is a fundamental property of quantum mechanics. Try adjusting
            the position uncertainty and watch how the momentum uncertainty changes automatically!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
