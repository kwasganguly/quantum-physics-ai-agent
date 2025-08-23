"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WaveSimulation } from "@/components/wave-simulation"
import { QuantumTunneling } from "@/components/quantum-tunneling"
import { DoubleSlitExperiment } from "@/components/double-slit-experiment"
import { SchrodingerEquation } from "@/components/schrodinger-equation"
import { QuantumEntanglement } from "@/components/quantum-entanglement"
import { ParticleAccelerator } from "@/components/particle-accelerator"
import { AtomicOrbitals } from "@/components/atomic-orbitals"
import { QuantumComputing } from "@/components/quantum-computing"

const modules = [
  {
    id: "wave-particle",
    title: "Wave-Particle Duality",
    description: "Explore the fundamental nature of quantum particles",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: "🌊",
  },
  {
    id: "tunneling",
    title: "Quantum Tunneling",
    description: "Particles passing through energy barriers",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: "🚇",
  },
  {
    id: "double-slit",
    title: "Double-Slit Experiment",
    description: "The famous quantum interference experiment",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    icon: "🔬",
  },
  {
    id: "schrodinger",
    title: "Schrödinger Equation",
    description: "The fundamental equation of quantum mechanics",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    icon: "📐",
  },
  {
    id: "entanglement",
    title: "Quantum Entanglement",
    description: "Spooky action at a distance",
    color: "bg-gradient-to-r from-indigo-500 to-purple-500",
    icon: "🔗",
  },
  {
    id: "accelerator",
    title: "Particle Accelerator",
    description: "High-energy particle collisions",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: "⚡",
  },
  {
    id: "orbitals",
    title: "Atomic Orbitals",
    description: "Electron probability distributions",
    color: "bg-gradient-to-r from-teal-500 to-blue-500",
    icon: "⚛️",
  },
  {
    id: "computing",
    title: "Quantum Computing",
    description: "Qubits and quantum algorithms",
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
    icon: "💻",
  },
]

export default function QuantumPhysicsApp() {
  const [activeModule, setActiveModule] = useState("wave-particle")

  const renderSimulation = () => {
    switch (activeModule) {
      case "wave-particle":
        return <WaveSimulation />
      case "tunneling":
        return <QuantumTunneling />
      case "double-slit":
        return <DoubleSlitExperiment />
      case "schrodinger":
        return <SchrodingerEquation />
      case "entanglement":
        return <QuantumEntanglement />
      case "accelerator":
        return <ParticleAccelerator />
      case "orbitals":
        return <AtomicOrbitals />
      case "computing":
        return <QuantumComputing />
      default:
        return <WaveSimulation />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Quantum Physics AI
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore the fascinating world of quantum mechanics through interactive simulations and visualizations
          </p>
        </div>

        {/* Module Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {modules.map((module) => (
            <Button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                activeModule === module.id
                  ? `${module.color} text-white shadow-lg shadow-purple-500/25`
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600"
              }`}
              variant={activeModule === module.id ? "default" : "outline"}
            >
              <span className="text-2xl">{module.icon}</span>
              <span className="font-semibold text-sm text-center">{module.title}</span>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  activeModule === module.id ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                Interactive
              </Badge>
            </Button>
          ))}
        </div>

        {/* Active Module Display */}
        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{modules.find((m) => m.id === activeModule)?.icon}</span>
              <div>
                <CardTitle className="text-2xl text-white">
                  {modules.find((m) => m.id === activeModule)?.title}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {modules.find((m) => m.id === activeModule)?.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">{renderSimulation()}</div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-blue-400 mb-2">Interactive Learning</h3>
              <p className="text-sm text-slate-300">Real-time simulations with adjustable parameters</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-purple-400 mb-2">Quantum Mechanics</h3>
              <p className="text-sm text-slate-300">Explore fundamental quantum phenomena</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-green-400 mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-300">Intelligent explanations and insights</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
