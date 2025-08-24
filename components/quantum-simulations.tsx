"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Zap, Atom, Eye, EyeOff } from "lucide-react"

interface WavePoint {
  x: number
  y: number
  amplitude: number
}

interface SimulationProps {
  onComplete?: () => void
}

export function DoubleSlit({ onComplete }: SimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [observing, setObserving] = useState(false)
  const [intensity, setIntensity] = useState([50])
  const [hasCompleted, setHasCompleted] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (isRunning) {
      animate()
      if (!hasCompleted) {
        setTimeout(() => {
          setHasCompleted(true)
          onComplete?.()
        }, 5000)
      }
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, observing, intensity, hasCompleted, onComplete])

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw slits
    ctx.fillStyle = "#374151"
    ctx.fillRect(150, 0, 20, 120)
    ctx.fillRect(150, 160, 20, 280)
    ctx.fillRect(150, 130, 20, 20) // barrier between slits

    // Draw interference pattern
    if (!observing) {
      // Wave interference pattern
      for (let x = 200; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          const d1 = Math.sqrt((x - 160) ** 2 + (y - 125) ** 2)
          const d2 = Math.sqrt((x - 160) ** 2 + (y - 155) ** 2)
          const phase = (d1 - d2) * 0.1 + Date.now() * 0.01
          const amplitude = Math.cos(phase) * (intensity[0] / 100)
          const brightness = Math.abs(amplitude) * 255
          ctx.fillStyle = `rgba(59, 130, 246, ${brightness / 255})`
          ctx.fillRect(x, y, 2, 2)
        }
      }
    } else {
      // Particle pattern (two bands)
      ctx.fillStyle = "rgba(59, 130, 246, 0.6)"
      for (let i = 0; i < 100; i++) {
        const x = 200 + Math.random() * 200
        const y1 = 125 + (Math.random() - 0.5) * 40
        const y2 = 155 + (Math.random() - 0.5) * 40
        ctx.fillRect(x, y1, 2, 2)
        ctx.fillRect(x, y2, 2, 2)
      }
    }

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setHasCompleted(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Double-Slit Experiment
          {hasCompleted && (
            <Badge variant="secondary" className="ml-2">
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Observe wave-particle duality in real-time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={toggleSimulation} className="flex items-center gap-2">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            variant={observing ? "default" : "outline"}
            onClick={() => setObserving(!observing)}
            className="flex items-center gap-2"
          >
            {observing ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {observing ? "Observing" : "Not Observing"}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Intensity: {intensity[0]}%</label>
          <Slider value={intensity} onValueChange={setIntensity} max={100} step={1} className="w-full" />
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={280}
          className="border rounded-lg bg-black w-full max-w-md mx-auto"
        />

        <div className="text-sm text-muted-foreground">
          {observing ? (
            <p>🔍 Observer present: Particles behave like particles, creating two bands</p>
          ) : (
            <p>👁️ No observer: Particles behave like waves, creating interference pattern</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function SchrodingersCat({ onComplete }: SimulationProps) {
  const [boxOpen, setBoxOpen] = useState(false)
  const [catState, setCatState] = useState<"superposition" | "alive" | "dead">("superposition")
  const [probability, setProbability] = useState([50])
  const [hasCompleted, setHasCompleted] = useState(false)

  const openBox = () => {
    setBoxOpen(true)
    // Collapse the wave function
    const random = Math.random() * 100
    setCatState(random < probability[0] ? "alive" : "dead")

    if (!hasCompleted) {
      setHasCompleted(true)
      onComplete?.()
    }
  }

  const reset = () => {
    setBoxOpen(false)
    setCatState("superposition")
    setHasCompleted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="h-5 w-5 text-purple-500" />
          Schrödinger's Cat
          {hasCompleted && (
            <Badge variant="secondary" className="ml-2">
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Explore quantum superposition and measurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Probability of Alive: {probability[0]}%</label>
          <Slider
            value={probability}
            onValueChange={setProbability}
            max={100}
            step={1}
            className="w-full"
            disabled={boxOpen}
          />
        </div>

        <div className="flex justify-center">
          <div className="relative w-48 h-48 border-4 border-gray-400 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {!boxOpen ? (
              <div className="text-center">
                <div className="text-6xl mb-2">📦</div>
                <Badge variant="secondary">Superposition</Badge>
                <p className="text-xs text-muted-foreground mt-2">Cat is both alive AND dead</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">{catState === "alive" ? "😸" : "💀"}</div>
                <Badge variant={catState === "alive" ? "default" : "destructive"}>
                  {catState === "alive" ? "Alive" : "Dead"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">Wave function collapsed!</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={openBox} disabled={boxOpen}>
            Open Box
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset Experiment
          </Button>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {!boxOpen
            ? "The cat exists in a superposition of alive and dead states until observed"
            : "Observation has collapsed the quantum superposition into a definite state"}
        </div>
      </CardContent>
    </Card>
  )
}

export function QuantumTunneling({ onComplete }: SimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [barrierHeight, setBarrierHeight] = useState([70])
  const [particleEnergy, setParticleEnergy] = useState([50])
  const [hasCompleted, setHasCompleted] = useState(false)
  const animationRef = useRef<number>()
  const particleRef = useRef({ x: 50, tunneled: false })

  useEffect(() => {
    if (isRunning) {
      animate()
      if (!hasCompleted) {
        setTimeout(() => {
          setHasCompleted(true)
          onComplete?.()
        }, 10000)
      }
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, barrierHeight, particleEnergy, hasCompleted, onComplete])

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw energy barrier
    const barrierX = 150
    const barrierWidth = 40
    const barrierHeightPx = (barrierHeight[0] / 100) * 150

    ctx.fillStyle = "#ef4444"
    ctx.fillRect(barrierX, 150 - barrierHeightPx, barrierWidth, barrierHeightPx)

    // Draw energy level line
    const energyY = 150 - (particleEnergy[0] / 100) * 150
    ctx.strokeStyle = "#10b981"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, energyY)
    ctx.lineTo(canvas.width, energyY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw particle
    const particle = particleRef.current
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(particle.x, 140, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Move particle
    if (isRunning) {
      particle.x += 2

      // Check tunneling probability
      if (particle.x >= barrierX && particle.x <= barrierX + barrierWidth && !particle.tunneled) {
        const tunnelingProbability = Math.exp((-2 * (barrierHeight[0] - particleEnergy[0])) / 20)
        if (Math.random() < tunnelingProbability) {
          particle.tunneled = true
        }
      }

      // Reset if particle goes off screen
      if (particle.x > canvas.width) {
        particle.x = 50
        particle.tunneled = false
      }
    }

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setHasCompleted(false)
    particleRef.current = { x: 50, tunneled: false }
  }

  const tunnelingProbability = Math.exp((-2 * Math.max(0, barrierHeight[0] - particleEnergy[0])) / 20) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-500" />
          Quantum Tunneling
          {hasCompleted && (
            <Badge variant="secondary" className="ml-2">
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Watch particles tunnel through energy barriers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Barrier Height: {barrierHeight[0]}%</label>
            <Slider value={barrierHeight} onValueChange={setBarrierHeight} max={100} step={1} className="w-full" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Particle Energy: {particleEnergy[0]}%</label>
            <Slider value={particleEnergy} onValueChange={setParticleEnergy} max={100} step={1} className="w-full" />
          </div>
        </div>

        <div className="text-center">
          <Badge variant="outline">Tunneling Probability: {tunnelingProbability.toFixed(1)}%</Badge>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="border rounded-lg bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto"
        />

        <div className="flex gap-2 justify-center">
          <Button onClick={toggleSimulation} className="flex items-center gap-2">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          <p className="mb-1">🔵 Blue particle • 🔴 Energy barrier • 🟢 Particle energy level</p>
          <p>Even when particle energy is lower than barrier height, quantum tunneling allows passage!</p>
        </div>
      </CardContent>
    </Card>
  )
}
