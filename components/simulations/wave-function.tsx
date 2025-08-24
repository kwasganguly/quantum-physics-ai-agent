"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WaveFunction() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [amplitude, setAmplitude] = useState([1])
  const [frequency, setFrequency] = useState([1])
  const [phase, setPhase] = useState([0])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set up canvas
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2

      // Draw axes
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.stroke()

      // Draw wave function
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x < width; x++) {
        const t = isAnimating ? time * 0.001 : 0
        const y = centerY - amplitude[0] * 50 * Math.sin(frequency[0] * x * 0.02 + (phase[0] * Math.PI) / 180 + t)

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw probability density
      ctx.fillStyle = "rgba(139, 92, 246, 0.3)"
      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let x = 0; x < width; x++) {
        const t = isAnimating ? time * 0.001 : 0
        const waveValue = amplitude[0] * Math.sin(frequency[0] * x * 0.02 + (phase[0] * Math.PI) / 180 + t)
        const probability = Math.abs(waveValue) * 50
        const y = centerY - probability
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, centerY)
      ctx.closePath()
      ctx.fill()

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
  }, [amplitude, frequency, phase, isAnimating])

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Wave Function Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4">
              <Button onClick={toggleAnimation} className="bg-purple-600 hover:bg-purple-700">
                {isAnimating ? "Pause" : "Animate"} Wave
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Amplitude: {amplitude[0].toFixed(1)}
              </label>
              <Slider value={amplitude} onValueChange={setAmplitude} max={2} min={0.1} step={0.1} className="w-full" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Frequency: {frequency[0].toFixed(1)}
              </label>
              <Slider value={frequency} onValueChange={setFrequency} max={3} min={0.1} step={0.1} className="w-full" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Phase: {phase[0]}°</label>
              <Slider value={phase} onValueChange={setPhase} max={360} min={0} step={10} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Understanding Wave Functions</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The wave function ψ(x,t) is the fundamental description of a quantum system. The purple curve shows the wave
            function, while the shaded area represents |ψ|², the probability density of finding a particle at each
            position.
          </p>
          <p>
            <strong className="text-purple-400">Key Concepts:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Amplitude controls the maximum probability density</li>
            <li>Frequency determines the wavelength (related to momentum)</li>
            <li>Phase shifts the entire wave pattern</li>
            <li>The probability density is always positive (|ψ|²)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
