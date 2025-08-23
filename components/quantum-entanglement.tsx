"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuantumEntanglement() {
  const [particleA, setParticleA] = useState<"up" | "down" | "superposition">("superposition")
  const [particleB, setParticleB] = useState<"up" | "down" | "superposition">("superposition")
  const [isEntangled, setIsEntangled] = useState(true)
  const [measurements, setMeasurements] = useState(0)
  const [correlations, setCorrelations] = useState(0)

  const measureParticle = (particle: "A" | "B") => {
    if (isEntangled) {
      const result = Math.random() > 0.5 ? "up" : "down"
      const opposite = result === "up" ? "down" : "up"

      if (particle === "A") {
        setParticleA(result)
        setParticleB(opposite)
      } else {
        setParticleB(result)
        setParticleA(opposite)
      }

      setMeasurements((prev) => prev + 1)
      setCorrelations((prev) => prev + 1)
    } else {
      const result = Math.random() > 0.5 ? "up" : "down"
      if (particle === "A") {
        setParticleA(result)
      } else {
        setParticleB(result)
      }
      setMeasurements((prev) => prev + 1)
    }
  }

  const reset = () => {
    setParticleA("superposition")
    setParticleB("superposition")
    setMeasurements(0)
    setCorrelations(0)
  }

  const getParticleColor = (state: string) => {
    switch (state) {
      case "up":
        return "text-blue-400"
      case "down":
        return "text-red-400"
      default:
        return "text-purple-400"
    }
  }

  const getParticleSymbol = (state: string) => {
    switch (state) {
      case "up":
        return "↑"
      case "down":
        return "↓"
      default:
        return "⟨↑↓⟩"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Button
          onClick={() => setIsEntangled(!isEntangled)}
          className={`${isEntangled ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-500 hover:bg-gray-600"}`}
        >
          {isEntangled ? "Entangled" : "Independent"}
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
        >
          Reset System
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Particle A */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-center text-blue-400">Particle A</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative">
              <div className={`text-8xl ${getParticleColor(particleA)} transition-all duration-500`}>
                {getParticleSymbol(particleA)}
              </div>
              {particleA === "superposition" && (
                <div className="absolute inset-0 animate-pulse">
                  <div className="text-8xl text-purple-400 opacity-50">⟨↑↓⟩</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                State: <span className={getParticleColor(particleA)}>{particleA}</span>
              </p>
              <Button
                onClick={() => measureParticle("A")}
                disabled={particleA !== "superposition"}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                Measure Spin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Particle B */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-center text-red-400">Particle B</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative">
              <div className={`text-8xl ${getParticleColor(particleB)} transition-all duration-500`}>
                {getParticleSymbol(particleB)}
              </div>
              {particleB === "superposition" && (
                <div className="absolute inset-0 animate-pulse">
                  <div className="text-8xl text-purple-400 opacity-50">⟨↑↓⟩</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                State: <span className={getParticleColor(particleB)}>{particleB}</span>
              </p>
              <Button
                onClick={() => measureParticle("B")}
                disabled={particleB !== "superposition"}
                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
              >
                Measure Spin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entanglement Visualization */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-center text-purple-400">Quantum Entanglement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-32 flex items-center justify-center">
            {isEntangled && (
              <>
                <div className="absolute left-1/4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute right-1/4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-pulse"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-purple-400 text-sm animate-bounce">⚡ Entangled ⚡</div>
                </div>
              </>
            )}
            {!isEntangled && (
              <div className="text-gray-400 text-center">
                <div className="text-2xl mb-2">○ ○</div>
                <div className="text-sm">Independent Particles</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{measurements}</div>
            <div className="text-sm text-slate-400">Total Measurements</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{correlations}</div>
            <div className="text-sm text-slate-400">Perfect Correlations</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {measurements > 0 ? ((correlations / measurements) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-sm text-slate-400">Correlation Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <p className="text-slate-300 text-sm">
            <strong className="text-purple-400">Quantum Entanglement:</strong> When particles are entangled, measuring
            one instantly determines the state of the other, regardless of distance. Einstein called this "spooky action
            at a distance." Try measuring both particles when entangled vs. independent to see the difference!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
