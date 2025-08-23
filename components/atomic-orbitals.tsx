"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AtomicOrbitals() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [orbital, setOrbital] = useState<"1s" | "2s" | "2p" | "3d">("1s")
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw nucleus
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add nucleus glow
      ctx.shadowColor = "#ef4444"
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw orbital based on type
      ctx.globalAlpha = 0.7

      switch (orbital) {
        case "1s":
          // Spherical orbital
          for (let r = 10; r < 100; r += 5) {
            const probability = Math.exp(-r / 30) * (1 + Math.sin(time * 0.1) * 0.2)
            ctx.strokeStyle = `rgba(59, 130, 246, ${probability})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
            ctx.stroke()
          }
          break

        case "2s":
          // Larger spherical orbital with node
          for (let r = 20; r < 150; r += 5) {
            let probability = Math.exp(-r / 50) * Math.sin(r / 25) * Math.sin(r / 25)
            probability *= 1 + Math.sin(time * 0.1) * 0.2
            if (probability > 0) {
              ctx.strokeStyle = `rgba(59, 130, 246, ${Math.abs(probability)})`
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
          break

        case "2p":
          // Dumbbell-shaped orbital
          for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            for (let r = 10; r < 80; r += 3) {
              const cosTheta = Math.cos(angle)
              const probability = Math.exp(-r / 40) * cosTheta * cosTheta * (1 + Math.sin(time * 0.1) * 0.2)
              if (probability > 0) {
                const x = centerX + r * Math.cos(angle)
                const y = centerY + r * Math.sin(angle)

                ctx.fillStyle = `rgba(16, 185, 129, ${Math.abs(probability)})`
                ctx.beginPath()
                ctx.arc(x, y, 2, 0, Math.PI * 2)
                ctx.fill()
              }
            }
          }
          break

        case "3d":
          // Complex d-orbital pattern
          for (let theta = 0; theta < Math.PI * 2; theta += 0.05) {
            for (let phi = 0; phi < Math.PI; phi += 0.05) {
              const r = 60
              const x = centerX + r * Math.sin(phi) * Math.cos(theta)
              const y = centerY + r * Math.sin(phi) * Math.sin(theta)

              // d-orbital angular function (simplified)
              const angularPart = Math.sin(phi) * Math.sin(phi) * Math.cos(2 * theta)
              const probability = Math.abs(angularPart) * (1 + Math.sin(time * 0.1) * 0.2)

              if (probability > 0.1) {
                ctx.fillStyle = `rgba(139, 92, 246, ${probability})`
                ctx.beginPath()
                ctx.arc(x, y, 1.5, 0, Math.PI * 2)
                ctx.fill()
              }
            }
          }
          break
      }

      ctx.globalAlpha = 1

      // Draw electron probability clouds
      if (isRunning) {
        for (let i = 0; i < 20; i++) {
          let x, y
          const rand1 = Math.random()
          const rand2 = Math.random()

          switch (orbital) {
            case "1s":
              const r1s = -30 * Math.log(rand1)
              const angle1s = rand2 * Math.PI * 2
              x = centerX + r1s * Math.cos(angle1s)
              y = centerY + r1s * Math.sin(angle1s)
              break

            case "2s":
              const r2s = -50 * Math.log(rand1)
              const angle2s = rand2 * Math.PI * 2
              x = centerX + r2s * Math.cos(angle2s)
              y = centerY + r2s * Math.sin(angle2s)
              break

            case "2p":
              const r2p = -40 * Math.log(rand1)
              const angle2p = rand2 * Math.PI * 2
              const cosTheta = Math.cos(angle2p)
              if (cosTheta * cosTheta > Math.random()) {
                x = centerX + r2p * Math.cos(angle2p)
                y = centerY + r2p * Math.sin(angle2p)
              } else {
                continue
              }
              break

            case "3d":
              const r3d = 60
              const theta3d = rand1 * Math.PI * 2
              const phi3d = rand2 * Math.PI
              x = centerX + r3d * Math.sin(phi3d) * Math.cos(theta3d)
              y = centerY + r3d * Math.sin(phi3d) * Math.sin(theta3d)
              break

            default:
              x = centerX
              y = centerY
          }

          ctx.fillStyle = "#f59e0b"
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()

          // Add electron glow
          ctx.shadowColor = "#f59e0b"
          ctx.shadowBlur = 5
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // Labels
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "16px sans-serif"
      ctx.fillText(`${orbital} Orbital`, 10, 30)
      ctx.fillText("Nucleus", centerX + 15, centerY - 10)

      if (isRunning) {
        ctx.fillStyle = "#f59e0b"
        ctx.fillText("Electron Probability", 10, canvas.height - 20)
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
  }, [isRunning, orbital])

  const orbitalInfo = {
    "1s": { name: "1s", description: "Spherical, lowest energy orbital", color: "text-blue-400" },
    "2s": { name: "2s", description: "Larger sphere with radial node", color: "text-blue-400" },
    "2p": { name: "2p", description: "Dumbbell-shaped orbital", color: "text-green-400" },
    "3d": { name: "3d", description: "Complex cloverleaf pattern", color: "text-purple-400" },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isRunning ? "Stop" : "Start"} Animation
        </Button>

        <div className="flex gap-2">
          {Object.entries(orbitalInfo).map(([key, info]) => (
            <Button
              key={key}
              onClick={() => setOrbital(key as any)}
              variant={orbital === key ? "default" : "outline"}
              className={`${orbital === key ? "bg-cyan-500 hover:bg-cyan-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}`}
            >
              {info.name}
            </Button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full border border-slate-600 rounded-lg bg-slate-900"
      />

      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className={orbitalInfo[orbital].color}>{orbitalInfo[orbital].name} Orbital</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm mb-4">{orbitalInfo[orbital].description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-red-400">●</span> Nucleus (protons + neutrons)
            </div>
            <div>
              <span className="text-cyan-400">○</span> Electron probability density
            </div>
            <div>
              <span className="text-yellow-400">●</span> Electron positions
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-cyan-400">Atomic Orbitals:</strong> These show where electrons are likely to be
            found around an atom's nucleus. The shapes represent probability clouds - electrons don't orbit like
            planets, but exist in these quantum probability distributions. Different orbitals have different energies
            and shapes!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
