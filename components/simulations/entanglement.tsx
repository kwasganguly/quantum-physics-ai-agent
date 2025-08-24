"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EntanglementDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isEntangled, setIsEntangled] = useState(true)
  const [particle1State, setParticle1State] = useState<"up" | "down" | "superposition">("superposition")
  const [particle2State, setParticle2State] = useState<"up" | "down" | "superposition">("superposition")
  const [measurements, setMeasurements] = useState<{ particle: number; result: string }[]>([])
  const [correlationCount, setCorrelationCount] = useState({ same: 0, different: 0 })
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
      const centerY = height / 2

      // Draw particles
      const particle1X = width * 0.25
      const particle2X = width * 0.75

      // Particle 1
      ctx.fillStyle = particle1State === "up" ? "#22c55e" : particle1State === "down" ? "#ef4444" : "#8b5cf6"
      ctx.beginPath()
      ctx.arc(particle1X, centerY, 30, 0, Math.PI * 2)
      ctx.fill()

      // Particle 2
      ctx.fillStyle = particle2State === "up" ? "#22c55e" : particle2State === "down" ? "#ef4444" : "#8b5cf6"
      ctx.beginPath()
      ctx.arc(particle2X, centerY, 30, 0, Math.PI * 2)
      ctx.fill()

      // Draw entanglement connection
      if (isEntangled && particle1State === "superposition" && particle2State === "superposition") {
        const t = time * 0.005
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.5 + 0.3 * Math.sin(t)})`
        ctx.lineWidth = 3
        ctx.setLineDash([10, 10])
        ctx.beginPath()
        ctx.moveTo(particle1X + 30, centerY)
        ctx.lineTo(particle2X - 30, centerY)
        ctx.stroke()
        ctx.setLineDash([])

        // Quantum field visualization
        for (let i = 0; i < 5; i++) {
          const x = particle1X + 60 + i * 30
          const y = centerY + Math.sin(t + i) * 20
          ctx.fillStyle = `rgba(139, 92, 246, ${0.3 + 0.2 * Math.sin(t + i)})`
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw spin arrows
      if (particle1State !== "superposition") {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.beginPath()
        if (particle1State === "up") {
          ctx.moveTo(particle1X, centerY + 10)
          ctx.lineTo(particle1X, centerY - 10)
          ctx.lineTo(particle1X - 5, centerY - 5)
          ctx.moveTo(particle1X, centerY - 10)
          ctx.lineTo(particle1X + 5, centerY - 5)
        } else {
          ctx.moveTo(particle1X, centerY - 10)
          ctx.lineTo(particle1X, centerY + 10)
          ctx.lineTo(particle1X - 5, centerY + 5)
          ctx.moveTo(particle1X, centerY + 10)
          ctx.lineTo(particle1X + 5, centerY + 5)
        }
        ctx.stroke()
      }

      if (particle2State !== "superposition") {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.beginPath()
        if (particle2State === "up") {
          ctx.moveTo(particle2X, centerY + 10)
          ctx.lineTo(particle2X, centerY - 10)
          ctx.lineTo(particle2X - 5, centerY - 5)
          ctx.moveTo(particle2X, centerY - 10)
          ctx.lineTo(particle2X + 5, centerY - 5)
        } else {
          ctx.moveTo(particle2X, centerY - 10)
          ctx.lineTo(particle2X, centerY + 10)
          ctx.lineTo(particle2X - 5, centerY + 5)
          ctx.moveTo(particle2X, centerY + 10)
          ctx.lineTo(particle2X + 5, centerY + 5)
        }
        ctx.stroke()
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Particle 1", particle1X, centerY + 60)
      ctx.fillText("Particle 2", particle2X, centerY + 60)

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isEntangled, particle1State, particle2State])

  const measureParticle = (particleNum: 1 | 2) => {
    if (particleNum === 1 && particle1State === "superposition") {
      const result = Math.random() > 0.5 ? "up" : "down"
      setParticle1State(result)

      if (isEntangled && particle2State === "superposition") {
        // Entangled particles have opposite spins
        setParticle2State(result === "up" ? "down" : "up")
        setMeasurements((prev) => [
          ...prev.slice(-8),
          { particle: 1, result: result === "up" ? "↑" : "↓" },
          { particle: 2, result: result === "up" ? "↓" : "↑" },
        ])
        setCorrelationCount((prev) => ({ ...prev, different: prev.different + 1 }))
      } else {
        setMeasurements((prev) => [...prev.slice(-9), { particle: 1, result: result === "up" ? "↑" : "↓" }])
      }
    } else if (particleNum === 2 && particle2State === "superposition") {
      const result = Math.random() > 0.5 ? "up" : "down"
      setParticle2State(result)

      if (isEntangled && particle1State === "superposition") {
        // Entangled particles have opposite spins
        setParticle1State(result === "up" ? "down" : "up")
        setMeasurements((prev) => [
          ...prev.slice(-8),
          { particle: 1, result: result === "up" ? "↓" : "↑" },
          { particle: 2, result: result === "up" ? "↑" : "↓" },
        ])
        setCorrelationCount((prev) => ({ ...prev, different: prev.different + 1 }))
      } else {
        setMeasurements((prev) => [...prev.slice(-9), { particle: 2, result: result === "up" ? "↑" : "↓" }])
        if (!isEntangled) {
          const otherResult = Math.random() > 0.5 ? "↑" : "↓"
          if (otherResult === (result === "up" ? "↑" : "↓")) {
            setCorrelationCount((prev) => ({ ...prev, same: prev.same + 1 }))
          } else {
            setCorrelationCount((prev) => ({ ...prev, different: prev.different + 1 }))
          }
        }
      }
    }
  }

  const resetSystem = () => {
    setParticle1State("superposition")
    setParticle2State("superposition")
    setMeasurements([])
    setCorrelationCount({ same: 0, different: 0 })
  }

  const toggleEntanglement = () => {
    setIsEntangled(!isEntangled)
    resetSystem()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Entangled Particle System
              <Badge variant={isEntangled ? "default" : "secondary"}>{isEntangled ? "Entangled" : "Independent"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full border border-slate-600 rounded bg-slate-800"
            />
            <div className="mt-4 flex justify-center gap-4">
              <Button
                onClick={() => measureParticle(1)}
                disabled={particle1State !== "superposition"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Measure Particle 1
              </Button>
              <Button
                onClick={() => measureParticle(2)}
                disabled={particle2State !== "superposition"}
                className="bg-green-600 hover:bg-green-700"
              >
                Measure Particle 2
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Controls & Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button
                onClick={toggleEntanglement}
                className={`w-full ${isEntangled ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {isEntangled ? "Break Entanglement" : "Create Entanglement"}
              </Button>
              <Button onClick={resetSystem} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset System
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-600">
              <h4 className="text-slate-300 mb-2">Correlation Statistics:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-green-400">Same: {correlationCount.same}</div>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-red-400">Different: {correlationCount.different}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-slate-300 mb-2">Recent Measurements:</h4>
              <div className="grid grid-cols-5 gap-1">
                {measurements.map((measurement, i) => (
                  <div key={i} className="text-center p-2 bg-slate-800 rounded text-sm">
                    <div className="text-slate-400">P{measurement.particle}</div>
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
          <CardTitle className="text-white">Quantum Entanglement</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Quantum entanglement creates correlations between particles that Einstein called "spooky action at a
            distance." When particles are entangled, measuring one instantly affects the other, regardless of distance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold">Entangled State:</h4>
              <p className="text-sm">Particles show perfect anti-correlation - if one is ↑, the other is ↓</p>
            </div>
            <div>
              <h4 className="text-gray-400 font-semibold">Independent State:</h4>
              <p className="text-sm">Particles behave randomly with no correlation between measurements</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
