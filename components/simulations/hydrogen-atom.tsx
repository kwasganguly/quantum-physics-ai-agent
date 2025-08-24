"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HydrogenAtom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [principalQuantumNumber, setPrincipalQuantumNumber] = useState([1])
  const [azimuthalQuantumNumber, setAzimuthalQuantumNumber] = useState([0])
  const [magneticQuantumNumber, setMagneticQuantumNumber] = useState([0])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()

  const n = principalQuantumNumber[0]
  const l = azimuthalQuantumNumber[0]
  const m = magneticQuantumNumber[0]

  // Update quantum numbers based on selection rules
  useEffect(() => {
    if (l >= n) {
      setAzimuthalQuantumNumber([n - 1])
    }
    if (Math.abs(m) > l) {
      setMagneticQuantumNumber([0])
    }
  }, [n, l, m])

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

      // Draw nucleus
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw electron orbitals based on quantum numbers
      const radius = n * 40

      if (l === 0) {
        // s orbital (spherical)
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 2
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()

        // Probability density visualization
        const numPoints = 100
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2
          const r = radius + Math.random() * 20 - 10
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r

          ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + 0.2 * Math.random()})`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (l === 1) {
        // p orbital (dumbbell shape)
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2

        if (m === 0) {
          // pz orbital
          ctx.beginPath()
          ctx.ellipse(centerX, centerY - radius / 2, radius / 3, radius / 2, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.ellipse(centerX, centerY + radius / 2, radius / 3, radius / 2, 0, 0, Math.PI * 2)
          ctx.stroke()
        } else if (m === 1 || m === -1) {
          // px or py orbital
          const rotation = m === 1 ? 0 : Math.PI / 2
          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate(rotation)
          ctx.beginPath()
          ctx.ellipse(-radius / 2, 0, radius / 2, radius / 3, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.ellipse(radius / 2, 0, radius / 2, radius / 3, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
      } else if (l === 2) {
        // d orbital (more complex shapes)
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 2

        // Simplified d orbital representation
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + (m * Math.PI) / 4
          const x1 = centerX + Math.cos(angle) * radius * 0.7
          const y1 = centerY + Math.sin(angle) * radius * 0.7

          ctx.beginPath()
          ctx.ellipse(x1, y1, radius / 4, radius / 6, angle, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Draw energy levels
      const energyLevels = [-13.6, -3.4, -1.51, -0.85, -0.54] // eV for n=1,2,3,4,5
      const energy = energyLevels[n - 1] || -13.6 / (n * n)

      ctx.fillStyle = "#e2e8f0"
      ctx.font = "14px sans-serif"
      ctx.fillText(`Energy: ${energy.toFixed(2)} eV`, 10, 30)
      ctx.fillText(`n=${n}, l=${l}, m=${m}`, 10, 50)

      // Animate electron if enabled
      if (isAnimating) {
        const t = time * 0.003
        const electronX = centerX + Math.cos(t) * radius
        const electronY = centerY + Math.sin(t) * radius * 0.5

        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(electronX, electronY, 4, 0, Math.PI * 2)
        ctx.fill()
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
  }, [n, l, m, isAnimating])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Hydrogen Atom Model
              <Badge variant="secondary">
                n={n}, l={l}, m={m}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4">
              <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
                {isAnimating ? "Pause" : "Animate"} Electron
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quantum Numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Principal (n): {n}</label>
              <Slider
                value={principalQuantumNumber}
                onValueChange={setPrincipalQuantumNumber}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Azimuthal (l): {l}</label>
              <Slider
                value={azimuthalQuantumNumber}
                onValueChange={setAzimuthalQuantumNumber}
                max={n - 1}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Magnetic (m): {m}</label>
              <Slider
                value={magneticQuantumNumber}
                onValueChange={setMagneticQuantumNumber}
                max={l}
                min={-l}
                step={1}
                className="w-full"
              />
            </div>

            <div className="bg-slate-800 p-3 rounded space-y-2">
              <div className="text-slate-300 text-sm">Orbital Type:</div>
              <div className="text-lg font-bold">
                {l === 0 ? (
                  <span className="text-purple-400">s orbital</span>
                ) : l === 1 ? (
                  <span className="text-green-400">p orbital</span>
                ) : l === 2 ? (
                  <span className="text-yellow-400">d orbital</span>
                ) : (
                  <span className="text-blue-400">f orbital</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quantum Mechanical Hydrogen Atom</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            The hydrogen atom is the simplest atom and the only one with an exact analytical solution to the Schrödinger
            equation. Its electron orbitals are described by three quantum numbers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-blue-400 font-semibold">Principal (n):</h4>
              <p className="text-sm">Determines energy level and orbital size</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">Azimuthal (l):</h4>
              <p className="text-sm">Determines orbital shape (s, p, d, f)</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold">Magnetic (m):</h4>
              <p className="text-sm">Determines orbital orientation in space</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
