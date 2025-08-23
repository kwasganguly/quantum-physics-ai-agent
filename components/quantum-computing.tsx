"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuantumComputing() {
  const [qubits, setQubits] = useState([
    { id: 0, state: "|0⟩", probability: [1, 0], phase: 0 },
    { id: 1, state: "|0⟩", probability: [1, 0], phase: 0 },
    { id: 2, state: "|0⟩", probability: [1, 0], phase: 0 },
  ])
  const [circuit, setCircuit] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const applyGate = (qubitIndex: number, gate: string) => {
    setQubits((prev) => {
      const newQubits = [...prev]
      const qubit = newQubits[qubitIndex]

      switch (gate) {
        case "X": // Pauli-X (NOT gate)
          qubit.state = qubit.state === "|0⟩" ? "|1⟩" : "|0⟩"
          qubit.probability = qubit.state === "|0⟩" ? [1, 0] : [0, 1]
          break

        case "H": // Hadamard gate
          qubit.state = "|+⟩"
          qubit.probability = [0.5, 0.5]
          break

        case "Y": // Pauli-Y
          qubit.state = qubit.state === "|0⟩" ? "i|1⟩" : "-i|0⟩"
          qubit.probability = qubit.state === "|0⟩" ? [1, 0] : [0, 1]
          qubit.phase = (qubit.phase + Math.PI / 2) % (2 * Math.PI)
          break

        case "Z": // Pauli-Z
          if (qubit.state !== "|0⟩") {
            qubit.phase = (qubit.phase + Math.PI) % (2 * Math.PI)
          }
          break
      }

      return newQubits
    })

    setCircuit((prev) => [...prev, `${gate} on Q${qubitIndex}`])
  }

  const measureQubit = (qubitIndex: number) => {
    setQubits((prev) => {
      const newQubits = [...prev]
      const qubit = newQubits[qubitIndex]

      // Simulate measurement collapse
      const random = Math.random()
      const measureResult = random < qubit.probability[0] ? "|0⟩" : "|1⟩"

      qubit.state = measureResult
      qubit.probability = measureResult === "|0⟩" ? [1, 0] : [0, 1]
      qubit.phase = 0

      return newQubits
    })

    setCircuit((prev) => [...prev, `Measure Q${qubitIndex}`])
  }

  const resetCircuit = () => {
    setQubits([
      { id: 0, state: "|0⟩", probability: [1, 0], phase: 0 },
      { id: 1, state: "|0⟩", probability: [1, 0], phase: 0 },
      { id: 2, state: "|0⟩", probability: [1, 0], phase: 0 },
    ])
    setCircuit([])
  }

  const getQubitColor = (state: string) => {
    if (state === "|0⟩") return "text-blue-400"
    if (state === "|1⟩") return "text-red-400"
    return "text-purple-400"
  }

  const getStateSymbol = (state: string) => {
    switch (state) {
      case "|0⟩":
        return "|0⟩"
      case "|1⟩":
        return "|1⟩"
      case "|+⟩":
        return "|+⟩"
      case "i|1⟩":
        return "i|1⟩"
      case "-i|0⟩":
        return "-i|0⟩"
      default:
        return state
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={resetCircuit}
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
        >
          Reset Circuit
        </Button>
      </div>

      {/* Qubits Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {qubits.map((qubit, index) => (
          <Card key={qubit.id} className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-center text-cyan-400">Qubit {index}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Qubit State Visualization */}
              <div className="text-center">
                <div className={`text-4xl ${getQubitColor(qubit.state)} mb-2`}>{getStateSymbol(qubit.state)}</div>
                <div className="text-sm text-slate-400">State: {qubit.state}</div>
              </div>

              {/* Probability Bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-sm">|0⟩:</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${qubit.probability[0] * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-12">{(qubit.probability[0] * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-sm">|1⟩:</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${qubit.probability[1] * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-12">{(qubit.probability[1] * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Quantum Gates */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => applyGate(index, "X")} size="sm" className="bg-red-500 hover:bg-red-600">
                  X Gate
                </Button>
                <Button onClick={() => applyGate(index, "H")} size="sm" className="bg-purple-500 hover:bg-purple-600">
                  H Gate
                </Button>
                <Button onClick={() => applyGate(index, "Y")} size="sm" className="bg-green-500 hover:bg-green-600">
                  Y Gate
                </Button>
                <Button onClick={() => applyGate(index, "Z")} size="sm" className="bg-blue-500 hover:bg-blue-600">
                  Z Gate
                </Button>
              </div>

              {/* Measurement */}
              <Button
                onClick={() => measureQubit(index)}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={qubit.probability[0] === 1 || qubit.probability[1] === 1}
              >
                Measure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Circuit History */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-purple-400">Quantum Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {circuit.length === 0 ? (
              <p className="text-slate-400 text-sm">No operations performed yet</p>
            ) : (
              circuit.map((operation, index) => (
                <div key={index} className="text-sm text-slate-300 font-mono">
                  {index + 1}. {operation}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gate Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-red-400">Pauli Gates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-2">
            <div>
              <strong className="text-red-400">X Gate:</strong> Bit flip (NOT gate) - |0⟩ ↔ |1⟩
            </div>
            <div>
              <strong className="text-green-400">Y Gate:</strong> Bit + phase flip
            </div>
            <div>
              <strong className="text-blue-400">Z Gate:</strong> Phase flip - adds π phase to |1⟩
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-purple-400">Hadamard Gate</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            <div>
              <strong className="text-purple-400">H Gate:</strong> Creates superposition
            </div>
            <div>|0⟩ → |+⟩ = (|0⟩ + |1⟩)/√2</div>
            <div>|1⟩ → |-⟩ = (|0⟩ - |1⟩)/√2</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-cyan-400">Quantum Computing:</strong> Unlike classical bits that are either 0 or 1,
            qubits can exist in superposition of both states simultaneously. Quantum gates manipulate these
            superpositions, and measurement collapses the qubit to a definite state. Try applying different gates and
            see how they affect the probabilities!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
