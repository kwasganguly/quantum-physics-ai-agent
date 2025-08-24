"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PhotoelectricEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frequency, setFrequency] = useState([500]) // THz
  const [intensity, setIntensity] = useState([50])
  const [workFunction, setWorkFunction] = useState([300]) // THz equivalent
  const [isAnimating, setIsAnimating] = useState(false)
  const [electronCount, setElectronCount] = useState(0)
  const animationRef = useRef<number>()

  const photonEnergy = frequency[0] * 4.14e-3 // Convert THz to eV (simplified)
  const workFunctionEV = workFunction[0] * 4.14e-3
  const kineticEnergy = Math.max(0, photonEnergy - workFunctionEV)
  const canEmitElectrons = frequency[0] > workFunction[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height

      // Draw metal surface
      ctx.fillStyle = "#6b7280"
      ctx.fillRect(width * 0.6, height * 0.3, width * 0.35, height * 0.4)
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.strokeRect(width * 0.6, height * 0.3, width * 0.35, height * 0.4)

      // Draw work function energy level
      const workFunctionY = height * 0.7 - (workFunction[0] / 1000) * height * 0.3
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(width * 0.6, workFunctionY)
      ctx.lineTo(width * 0.95, workFunctionY)
      ctx.stroke()
      ctx.setLineDash([])

      // Work function label
      ctx.fillStyle = "#ef4444"
      ctx.font = "12px sans-serif"
      ctx.fillText(`φ = ${workFunctionEV.toFixed(2)} eV`, width * 0.65, workFunctionY - 5)

      // Draw incoming photons
      if (isAnimating) {
        const numPhotons = Math.floor(intensity[0] / 20) + 1
        for (let i = 0; i < numPhotons; i++) {
          const t = time * 0.003 + i * 0.5
          const x = (t % 2) * width * 0.6
          const y = height * 0.5 + Math.sin(t + i) * 50

          if (x < width * 0.6) {
            // Photon color based on frequency
            const hue = Math.min(300, frequency[0] / 2)
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`

            // Draw photon as wave packet
            ctx.beginPath()
            for (let j = 0; j < 20; j++) {
              const waveX = x + j * 2
              const waveY = y + Math.sin((waveX - t * 100) * 0.1) * 5
              if (j === 0) ctx.moveTo(waveX, waveY)
              else ctx.lineTo(waveX, waveY)
            }
            ctx.stroke()

            // Photon particle representation
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Draw emitted electrons
      if (isAnimating && canEmitElectrons) {
        const numElectrons = Math.floor(intensity[0] / 30) + 1
        for (let i = 0; i < numElectrons; i++) {
          const t = time * 0.002 + i * 0.7
          const startX = width * 0.6
          const electronX = startX + (t % 1.5) * width * 0.3
          const electronY = height * 0.5 + Math.sin(t + i) * 30

          if (electronX > startX && electronX < width) {
            // Electron speed based on kinetic energy
            const speed = Math.sqrt(kineticEnergy) * 10

            ctx.fillStyle = "#22c55e"
            ctx.beginPath()
            ctx.arc(electronX, electronY, 4, 0, Math.PI * 2)
            ctx.fill()

            // Electron trail
            ctx.strokeStyle = "rgba(34, 197, 94, 0.3)"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(electronX - 20, electronY)
            ctx.lineTo(electronX, electronY)
            ctx.stroke()
          }
        }
      }

      // Draw energy diagram
      const diagramX = width * 0.05
      const diagramY = height * 0.1
      const diagramWidth = width * 0.4
      const diagramHeight = height * 0.8

      // Energy axis
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(diagramX, diagramY)
      ctx.lineTo(diagramX, diagramY + diagramHeight)
      ctx.moveTo(diagramX, diagramY + diagramHeight)
      ctx.lineTo(diagramX + diagramWidth, diagramY + diagramHeight)
      ctx.stroke()

      // Photon energy bar
      const photonBarHeight = (photonEnergy / 3) * diagramHeight
      ctx.fillStyle = `hsl(${Math.min(300, frequency[0] / 2)}, 70%, 60%)`
      ctx.fillRect(diagramX + 50, diagramY + diagramHeight - photonBarHeight, 40, photonBarHeight)

      // Work function bar
      const workBarHeight = (workFunctionEV / 3) * diagramHeight
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(diagramX + 120, diagramY + diagramHeight - workBarHeight, 40, workBarHeight)

      // Kinetic energy bar
      if (kineticEnergy > 0) {
        const kineticBarHeight = (kineticEnergy / 3) * diagramHeight
        ctx.fillStyle = "#22c55e"
        ctx.fillRect(diagramX + 190, diagramY + diagramHeight - kineticBarHeight, 40, kineticBarHeight)
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Photon", diagramX + 70, diagramY + diagramHeight + 15)
      ctx.fillText("Work Fn", diagramX + 140, diagramY + diagramHeight + 15)
      ctx.fillText("Kinetic", diagramX + 210, diagramY + diagramHeight + 15)

      // Energy values
      ctx.fillText(`${photonEnergy.toFixed(2)} eV`, diagramX + 70, diagramY + diagramHeight + 30)
      ctx.fillText(`${workFunctionEV.toFixed(2)} eV`, diagramX + 140, diagramY + diagramHeight + 30)
      ctx.fillText(`${kineticEnergy.toFixed(2)} eV`, diagramX + 210, diagramY + diagramHeight + 30)

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
  }, [frequency, intensity, workFunction, isAnimating, photonEnergy, workFunctionEV, kineticEnergy, canEmitElectrons])

  const startAnimation = () => {
    setIsAnimating(true)
    setElectronCount(0)
  }

  const stopAnimation = () => {
    setIsAnimating(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Photoelectric Effect</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4 space-x-2">
              <Button onClick={startAnimation} disabled={isAnimating} className="bg-green-600 hover:bg-green-700">
                Start
              </Button>
              <Button onClick={stopAnimation} disabled={!isAnimating} className="bg-red-600 hover:bg-red-700">
                Stop
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
                Light Frequency: {frequency[0]} THz
              </label>
              <Slider
                value={frequency}
                onValueChange={setFrequency}
                max={1000}
                min={100}
                step={50}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Light Intensity: {intensity[0]}%</label>
              <Slider value={intensity} onValueChange={setIntensity} max={100} min={10} step={10} className="w-full" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Work Function: {workFunction[0]} THz
              </label>
              <Slider
                value={workFunction}
                onValueChange={setWorkFunction}
                max={800}
                min={200}
                step={50}
                className="w-full"
              />
            </div>

            <div className="bg-slate-800 p-3 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Photon Energy:</span>
                <span className="text-yellow-400">{photonEnergy.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Work Function:</span>
                <span className="text-red-400">{workFunctionEV.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Kinetic Energy:</span>
                <span className="text-green-400">{kineticEnergy.toFixed(2)} eV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Electron Emission:</span>
                <span className={canEmitElectrons ? "text-green-400" : "text-red-400"}>
                  {canEmitElectrons ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Einstein's Photoelectric Effect</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The photoelectric effect demonstrates the particle nature of light. Einstein showed that light consists of
            discrete packets of energy called photons, and electrons are only emitted when the photon energy exceeds the
            material's work function.
          </p>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-center text-lg font-mono mb-2">
              <span className="text-yellow-400">Einstein's Equation:</span> E = hf = φ + KE
            </div>
            <div className="text-center text-sm text-slate-400">Photon Energy = Work Function + Kinetic Energy</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
