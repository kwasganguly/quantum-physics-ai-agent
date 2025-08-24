"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type QubitState = {
  alpha: number // amplitude for |0⟩
  beta: number // amplitude for |1⟩
}

type QuantumGate = "X" | "Y" | "Z" | "H" | "CNOT" | "Measure"

export function QuantumComputing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qubits, setQubits] = useState<QubitState[]>([
    { alpha: 1, beta: 0 }, // |0⟩
    { alpha: 1, beta: 0 }, // |0⟩
  ])
  const [circuit, setCircuit] = useState<QuantumGate[][]>([[], []])
  const [measurementResults, setMeasurementResults] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
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

      // Draw quantum circuit
      const qubitSpacing = height / 3
      const gateSpacing = width / 8

      // Draw qubit lines
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      for (let i = 0; i < 2; i++) {
        const y = qubitSpacing * (i + 1)
        ctx.beginPath()
        ctx.moveTo(50, y)
        ctx.lineTo(width - 50, y)
        ctx.stroke()

        // Qubit labels
        ctx.fillStyle = "#e2e8f0"
        ctx.font = "14px sans-serif"
        ctx.fillText(`|q${i}⟩`, 10, y + 5)
      }

      // Draw gates in circuit
      circuit.forEach((qubitGates, qubitIndex) => {
        const y = qubitSpacing * (qubitIndex + 1)

        qubitGates.forEach((gate, gateIndex) => {
          const x = 80 + gateIndex * gateSpacing

          if (gate === "CNOT") {
            // Draw CNOT gate (control and target)
            if (qubitIndex === 0) {
              // Control qubit
              ctx.fillStyle = "#22c55e"
              ctx.beginPath()
              ctx.arc(x, y, 8, 0, Math.PI * 2)
              ctx.fill()

              // Connection line to target
              ctx.strokeStyle = "#22c55e"
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x, qubitSpacing * 2)
              ctx.stroke()
            } else {
              // Target qubit
              ctx.strokeStyle = "#22c55e"
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.arc(x, y, 15, 0, Math.PI * 2)
              ctx.stroke()

              // Plus sign
              ctx.beginPath()
              ctx.moveTo(x - 8, y)
              ctx.lineTo(x + 8, y)
              ctx.moveTo(x, y - 8)
              ctx.lineTo(x, y + 8)
              ctx.stroke()
            }
          } else {
            // Single qubit gates
            const gateColor =
              gate === "H"
                ? "#8b5cf6"
                : gate === "X"
                  ? "#ef4444"
                  : gate === "Y"
                    ? "#22c55e"
                    : gate === "Z"
                      ? "#3b82f6"
                      : "#fbbf24"

            ctx.fillStyle = gateColor
            ctx.fillRect(x - 15, y - 15, 30, 30)
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 2
            ctx.strokeRect(x - 15, y - 15, 30, 30)

            // Gate label
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 14px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(gate, x, y + 5)
          }
        })
      })

      // Draw Bloch spheres for each qubit
      const sphereRadius = 60
      const sphereY = height - 80

      qubits.forEach((qubit, index) => {
        const sphereX = 100 + index * 200

        // Sphere outline
        ctx.strokeStyle = "#64748b"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(sphereX, sphereY, sphereRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Axes
        ctx.beginPath()
        ctx.moveTo(sphereX - sphereRadius - 10, sphereY)
        ctx.lineTo(sphereX + sphereRadius + 10, sphereY)
        ctx.moveTo(sphereX, sphereY - sphereRadius - 10)
        ctx.lineTo(sphereX, sphereY + sphereRadius + 10)
        ctx.stroke()

        // State vector
        const prob0 = qubit.alpha * qubit.alpha
        const prob1 = qubit.beta * qubit.beta
        const theta = 2 * Math.acos(Math.abs(qubit.alpha))
        const phi = Math.arg ? Math.arg(qubit.beta / qubit.alpha) : 0

        const vectorX = sphereX + Math.sin(theta) * Math.cos(phi) * sphereRadius
        const vectorY = sphereY - Math.cos(theta) * sphereRadius

        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(sphereX, sphereY)
        ctx.lineTo(vectorX, vectorY)
        ctx.stroke()

        // Vector tip
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.arc(vectorX, vectorY, 5, 0, Math.PI * 2)
        ctx.fill()

        // Probability display
        ctx.fillStyle = "#e2e8f0"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`|0⟩: ${(prob0 * 100).toFixed(1)}%`, sphereX, sphereY + sphereRadius + 20)
        ctx.fillText(`|1⟩: ${(prob1 * 100).toFixed(1)}%`, sphereX, sphereY + sphereRadius + 35)
      })

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
  }, [qubits, circuit, isAnimating])

  const applyGate = (gate: QuantumGate, qubitIndex: number) => {
    if (gate === "CNOT") {
      // Apply CNOT gate (qubit 0 controls qubit 1)
      setQubits((prev) => {
        const newQubits = [...prev]
        const control = newQubits[0]
        const target = newQubits[1]

        // CNOT matrix application (simplified)
        if (Math.abs(control.beta) > 0.1) {
          // Control is in |1⟩ state, flip target
          const temp = target.alpha
          target.alpha = target.beta
          target.beta = temp
        }

        return newQubits
      })

      setCircuit((prev) => {
        const newCircuit = [...prev]
        newCircuit[0] = [...newCircuit[0], "CNOT"]
        newCircuit[1] = [...newCircuit[1], "CNOT"]
        return newCircuit
      })
    } else {
      setQubits((prev) => {
        const newQubits = [...prev]
        const qubit = newQubits[qubitIndex]

        switch (gate) {
          case "X": // Pauli-X (NOT gate)
            ;[qubit.alpha, qubit.beta] = [qubit.beta, qubit.alpha]
            break
          case "Y": // Pauli-Y
            ;[qubit.alpha, qubit.beta] = [-qubit.beta, qubit.alpha]
            break
          case "Z": // Pauli-Z
            qubit.beta = -qubit.beta
            break
          case "H": // Hadamard
            const newAlpha = (qubit.alpha + qubit.beta) / Math.sqrt(2)
            const newBeta = (qubit.alpha - qubit.beta) / Math.sqrt(2)
            qubit.alpha = newAlpha
            qubit.beta = newBeta
            break
        }

        // Normalize
        const norm = Math.sqrt(qubit.alpha * qubit.alpha + qubit.beta * qubit.beta)
        qubit.alpha /= norm
        qubit.beta /= norm

        return newQubits
      })

      setCircuit((prev) => {
        const newCircuit = [...prev]
        newCircuit[qubitIndex] = [...newCircuit[qubitIndex], gate]
        return newCircuit
      })
    }
  }

  const measureQubit = (qubitIndex: number) => {
    const qubit = qubits[qubitIndex]
    const prob0 = qubit.alpha * qubit.alpha
    const result = Math.random() < prob0 ? "0" : "1"

    // Collapse to measured state
    setQubits((prev) => {
      const newQubits = [...prev]
      if (result === "0") {
        newQubits[qubitIndex] = { alpha: 1, beta: 0 }
      } else {
        newQubits[qubitIndex] = { alpha: 0, beta: 1 }
      }
      return newQubits
    })

    setMeasurementResults((prev) => [...prev.slice(-9), `Q${qubitIndex}: ${result}`])
  }

  const resetCircuit = () => {
    setQubits([
      { alpha: 1, beta: 0 },
      { alpha: 1, beta: 0 },
    ])
    setCircuit([[], []])
    setMeasurementResults([])
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quantum Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full border border-slate-600 rounded bg-slate-800"
          />
          <div className="mt-4">
            <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-purple-600 hover:bg-purple-700">
              {isAnimating ? "Pause" : "Animate"} Visualization
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quantum Gates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-slate-300 mb-2">Single Qubit Gates:</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => applyGate("H", 0)} className="bg-purple-600 hover:bg-purple-700">
                  H (Q0)
                </Button>
                <Button onClick={() => applyGate("H", 1)} className="bg-purple-600 hover:bg-purple-700">
                  H (Q1)
                </Button>
                <Button onClick={() => applyGate("X", 0)} className="bg-red-600 hover:bg-red-700">
                  X (Q0)
                </Button>
                <Button onClick={() => applyGate("X", 1)} className="bg-red-600 hover:bg-red-700">
                  X (Q1)
                </Button>
                <Button onClick={() => applyGate("Y", 0)} className="bg-green-600 hover:bg-green-700">
                  Y (Q0)
                </Button>
                <Button onClick={() => applyGate("Y", 1)} className="bg-green-600 hover:bg-green-700">
                  Y (Q1)
                </Button>
                <Button onClick={() => applyGate("Z", 0)} className="bg-blue-600 hover:bg-blue-700">
                  Z (Q0)
                </Button>
                <Button onClick={() => applyGate("Z", 1)} className="bg-blue-600 hover:bg-blue-700">
                  Z (Q1)
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-slate-300 mb-2">Two Qubit Gates:</h4>
              <Button onClick={() => applyGate("CNOT", 0)} className="w-full bg-green-600 hover:bg-green-700">
                CNOT (Q0 → Q1)
              </Button>
            </div>

            <div>
              <h4 className="text-slate-300 mb-2">Measurement:</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => measureQubit(0)} className="bg-yellow-600 hover:bg-yellow-700">
                  Measure Q0
                </Button>
                <Button onClick={() => measureQubit(1)} className="bg-yellow-600 hover:bg-yellow-700">
                  Measure Q1
                </Button>
              </div>
            </div>

            <Button onClick={resetCircuit} className="w-full bg-slate-600 hover:bg-slate-700">
              Reset Circuit
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Measurement Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-slate-300 mb-2">Recent Measurements:</h4>
              <div className="grid grid-cols-5 gap-1">
                {measurementResults.map((result, i) => (
                  <div key={i} className="text-center p-2 bg-slate-800 rounded text-sm">
                    <div className="text-yellow-400">{result}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-slate-300 mb-2">Current State:</h4>
              <div className="space-y-2">
                {qubits.map((qubit, index) => (
                  <div key={index} className="bg-slate-800 p-3 rounded">
                    <div className="text-sm text-slate-400">Qubit {index}:</div>
                    <div className="font-mono text-sm">
                      <span className="text-blue-400">{qubit.alpha.toFixed(3)}</span>|0⟩ +
                      <span className="text-red-400"> {qubit.beta.toFixed(3)}</span>|1⟩
                    </div>
                    <div className="text-xs text-slate-500">
                      P(0) = {(qubit.alpha * qubit.alpha * 100).toFixed(1)}%, P(1) ={" "}
                      {(qubit.beta * qubit.beta * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quantum Computing Basics</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-3">
          <p>
            Quantum computers use qubits that can exist in superposition states, allowing them to process exponentially
            more information than classical bits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold">Hadamard (H):</h4>
              <p className="text-sm">Creates superposition: |0⟩ → (|0⟩ + |1⟩)/√2</p>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold">Pauli-X:</h4>
              <p className="text-sm">Quantum NOT gate: |0⟩ ↔ |1⟩</p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold">CNOT:</h4>
              <p className="text-sm">Controlled NOT: flips target if control is |1⟩</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold">Measurement:</h4>
              <p className="text-sm">Collapses superposition to definite state</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
