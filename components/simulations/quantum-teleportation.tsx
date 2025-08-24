"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuantumTeleportation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [teleportationState, setTeleportationState] = useState<{
    originalState: string
    measurement: string
    finalState: string
  }>({
    originalState: "|ψ⟩",
    measurement: "",
    finalState: "",
  })
  const animationRef = useRef<number>()

  const steps = [
    "Initial Setup",
    "Create Entanglement",
    "Bell Measurement",
    "Classical Communication",
    "State Reconstruction",
    "Teleportation Complete",
  ]

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

      // Draw Alice, Bob, and Charlie positions
      const aliceX = width * 0.2
      const charlieX = width * 0.5
      const bobX = width * 0.8

      // Draw participants
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(aliceX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Alice", aliceX, centerY + 4)

      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(charlieX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Charlie", charlieX, centerY + 4)

      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(bobX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Bob", bobX, centerY + 4)

      // Draw quantum states
      if (step >= 0) {
        // Original state at Alice
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(aliceX, centerY - 50, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#000000"
        ctx.font = "10px sans-serif"
        ctx.fillText("|ψ⟩", aliceX, centerY - 46)
      }

      if (step >= 1) {
        // Entangled pair between Charlie and Bob
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(charlieX + 25, centerY)
        ctx.lineTo(bobX - 25, centerY)
        ctx.stroke()
        ctx.setLineDash([])

        // Entangled particles
        ctx.fillStyle = "#8b5cf6"
        ctx.beginPath()
        ctx.arc(charlieX + 30, centerY, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(bobX - 30, centerY, 10, 0, Math.PI * 2)
        ctx.fill()
      }

      if (step >= 2) {
        // Bell measurement at Alice and Charlie
        ctx.strokeStyle = "#ff6b6b"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(aliceX + 50, centerY - 25, 30, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = "#ff6b6b"
        ctx.font = "10px sans-serif"
        ctx.fillText("Bell", aliceX + 50, centerY - 30)
        ctx.fillText("Measure", aliceX + 50, centerY - 20)
      }

      if (step >= 3) {
        // Classical communication
        ctx.strokeStyle = "#fbbf24"
        ctx.lineWidth = 2
        ctx.setLineDash([2, 2])
        ctx.beginPath()
        ctx.moveTo(aliceX + 80, centerY - 25)
        ctx.lineTo(bobX - 50, centerY - 25)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = "#fbbf24"
        ctx.font = "10px sans-serif"
        ctx.fillText("Classical", (aliceX + bobX) / 2, centerY - 35)
        ctx.fillText("Info", (aliceX + bobX) / 2, centerY - 25)
      }

      if (step >= 4) {
        // State reconstruction at Bob
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(bobX, centerY + 50, 20, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = "#22c55e"
        ctx.font = "10px sans-serif"
        ctx.fillText("Unitary", bobX, centerY + 45)
        ctx.fillText("Operation", bobX, centerY + 55)
      }

      if (step >= 5) {
        // Final teleported state
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(bobX, centerY - 50, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#000000"
        ctx.font = "10px sans-serif"
        ctx.fillText("|ψ⟩", bobX, centerY - 46)

        // Original state destroyed (crossed out)
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(aliceX - 10, centerY - 60)
        ctx.lineTo(aliceX + 10, centerY - 40)
        ctx.moveTo(aliceX + 10, centerY - 60)
        ctx.lineTo(aliceX - 10, centerY - 40)
        ctx.stroke()
      }

      // Draw step indicator
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Step ${step + 1}: ${steps[step]}`, width / 2, 30)

      // Animation effects
      if (isAnimating && step === 2) {
        const t = time * 0.01
        ctx.fillStyle = `rgba(255, 107, 107, ${0.5 + 0.3 * Math.sin(t)})`
        ctx.beginPath()
        ctx.arc(aliceX + 50, centerY - 25, 35, 0, Math.PI * 2)
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
  }, [step, isAnimating])

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)

      // Update teleportation state
      if (step === 2) {
        setTeleportationState((prev) => ({
          ...prev,
          measurement: "00, 01, 10, or 11",
        }))
      } else if (step === 4) {
        setTeleportationState((prev) => ({
          ...prev,
          finalState: "|ψ⟩",
        }))
      }
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const resetTeleportation = () => {
    setStep(0)
    setTeleportationState({
      originalState: "|ψ⟩",
      measurement: "",
      finalState: "",
    })
    setIsAnimating(false)
  }

  const runFullProtocol = () => {
    setIsAnimating(true)
    setStep(0)

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval)
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Quantum Teleportation Protocol
              <Badge variant="secondary">Step {step + 1}/6</Badge>
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
            <CardTitle className="text-white">Protocol Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={prevStep} disabled={step === 0 || isAnimating} className="bg-blue-600 hover:bg-blue-700">
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={step === steps.length - 1 || isAnimating}
                className="bg-green-600 hover:bg-green-700"
              >
                Next
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                onClick={runFullProtocol}
                disabled={isAnimating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Run Full Protocol
              </Button>
              <Button onClick={resetTeleportation} className="w-full bg-slate-600 hover:bg-slate-700">
                Reset
              </Button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-slate-300 text-sm">Current Step:</div>
                <div className="text-yellow-400 text-lg">{steps[step]}</div>
              </div>

              {teleportationState.measurement && (
                <div className="bg-slate-800 p-3 rounded">
                  <div className="text-slate-300 text-sm">Bell Measurement:</div>
                  <div className="text-orange-400 text-lg font-mono">{teleportationState.measurement}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quantum Teleportation Explained</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Quantum teleportation transfers the quantum state of a particle from one location to another using
            entanglement and classical communication. The original particle is destroyed in the process - no information
            travels faster than light.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-blue-400 font-semibold">Alice:</h4>
              <p className="text-sm">Has the unknown quantum state |ψ⟩ to teleport</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">Charlie:</h4>
              <p className="text-sm">Creates entangled pairs and sends one to Bob</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">Bob:</h4>
              <p className="text-sm">Receives the teleported state after reconstruction</p>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">Key Points:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>No physical particle travels from Alice to Bob</li>
              <li>Classical communication is required (no faster-than-light signaling)</li>
              <li>The original quantum state is destroyed (no-cloning theorem)</li>
              <li>Perfect fidelity is possible in principle</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
