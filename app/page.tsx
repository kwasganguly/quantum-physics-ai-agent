"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { WaveFunction } from "@/components/simulations/wave-function"
import { DoubleSlitExperiment } from "@/components/simulations/double-slit"
import { QuantumTunneling } from "@/components/simulations/quantum-tunneling"
import { SpinSimulation } from "@/components/simulations/spin-simulation"
import { EntanglementDemo } from "@/components/simulations/entanglement"
import { UncertaintyPrinciple } from "@/components/simulations/uncertainty-principle"
import { QuantumHarmonic } from "@/components/simulations/quantum-harmonic"
import { SchrodingerCat } from "@/components/simulations/schrodinger-cat"
import { QuantumComputing } from "@/components/simulations/quantum-computing"
import { PhotoelectricEffect } from "@/components/simulations/photoelectric-effect"
import { ComptonScattering } from "@/components/simulations/compton-scattering"
import { HydrogenAtom } from "@/components/simulations/hydrogen-atom"
import { QuantumZenoEffect } from "@/components/simulations/quantum-zeno"
import { BellInequality } from "@/components/simulations/bell-inequality"
import { QuantumTeleportation } from "@/components/simulations/quantum-teleportation"

const concepts = [
  {
    id: "wave-function",
    title: "Wave Function",
    description: "Explore the fundamental quantum wave function and probability distributions",
    difficulty: "Beginner",
    color: "from-purple-500 to-pink-500",
    component: WaveFunction,
  },
  {
    id: "double-slit",
    title: "Double-Slit Experiment",
    description: "Witness wave-particle duality in action",
    difficulty: "Beginner",
    color: "from-blue-500 to-cyan-500",
    component: DoubleSlitExperiment,
  },
  {
    id: "quantum-tunneling",
    title: "Quantum Tunneling",
    description: "See how particles can pass through energy barriers",
    difficulty: "Intermediate",
    color: "from-green-500 to-emerald-500",
    component: QuantumTunneling,
  },
  {
    id: "spin",
    title: "Quantum Spin",
    description: "Understand intrinsic angular momentum of particles",
    difficulty: "Intermediate",
    color: "from-orange-500 to-red-500",
    component: SpinSimulation,
  },
  {
    id: "entanglement",
    title: "Quantum Entanglement",
    description: "Explore spooky action at a distance",
    difficulty: "Advanced",
    color: "from-violet-500 to-purple-500",
    component: EntanglementDemo,
  },
  {
    id: "uncertainty",
    title: "Uncertainty Principle",
    description: "Heisenberg's fundamental limit on measurement precision",
    difficulty: "Intermediate",
    color: "from-teal-500 to-blue-500",
    component: UncertaintyPrinciple,
  },
  {
    id: "harmonic",
    title: "Quantum Harmonic Oscillator",
    description: "Energy quantization in oscillating systems",
    difficulty: "Advanced",
    color: "from-indigo-500 to-blue-500",
    component: QuantumHarmonic,
  },
  {
    id: "schrodinger-cat",
    title: "Schrödinger's Cat",
    description: "Superposition and measurement in macroscopic systems",
    difficulty: "Intermediate",
    color: "from-pink-500 to-rose-500",
    component: SchrodingerCat,
  },
  {
    id: "quantum-computing",
    title: "Quantum Computing",
    description: "Qubits, gates, and quantum algorithms",
    difficulty: "Advanced",
    color: "from-cyan-500 to-teal-500",
    component: QuantumComputing,
  },
  {
    id: "photoelectric",
    title: "Photoelectric Effect",
    description: "Einstein's explanation of light-matter interaction",
    difficulty: "Beginner",
    color: "from-yellow-500 to-orange-500",
    component: PhotoelectricEffect,
  },
  {
    id: "compton",
    title: "Compton Scattering",
    description: "Photon-electron collisions and energy transfer",
    difficulty: "Intermediate",
    color: "from-lime-500 to-green-500",
    component: ComptonScattering,
  },
  {
    id: "hydrogen",
    title: "Hydrogen Atom",
    description: "Quantum mechanical model of the simplest atom",
    difficulty: "Advanced",
    color: "from-red-500 to-pink-500",
    component: HydrogenAtom,
  },
  {
    id: "zeno",
    title: "Quantum Zeno Effect",
    description: "How frequent measurements can freeze quantum evolution",
    difficulty: "Advanced",
    color: "from-emerald-500 to-teal-500",
    component: QuantumZenoEffect,
  },
  {
    id: "bell",
    title: "Bell's Inequality",
    description: "Testing the foundations of quantum mechanics",
    difficulty: "Advanced",
    color: "from-fuchsia-500 to-purple-500",
    component: BellInequality,
  },
  {
    id: "teleportation",
    title: "Quantum Teleportation",
    description: "Transfer quantum states using entanglement",
    difficulty: "Advanced",
    color: "from-sky-500 to-indigo-500",
    component: QuantumTeleportation,
  },
]

export default function QuantumPhysicsApp() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const filteredConcepts = concepts.filter((concept) => filter === "all" || concept.difficulty.toLowerCase() === filter)

  const selectedConceptData = concepts.find((c) => c.id === selectedConcept)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Quantum Physics AI
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the fascinating world of quantum mechanics through interactive simulations and visualizations
          </p>
        </div>

        {selectedConcept ? (
          /* Simulation View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setSelectedConcept(null)}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                ← Back to Concepts
              </Button>
              <Badge variant="secondary" className={`bg-gradient-to-r ${selectedConceptData?.color} text-white`}>
                {selectedConceptData?.difficulty}
              </Badge>
            </div>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{selectedConceptData?.title}</CardTitle>
                <CardDescription className="text-slate-300">{selectedConceptData?.description}</CardDescription>
              </CardHeader>
              <CardContent>{selectedConceptData && <selectedConceptData.component />}</CardContent>
            </Card>
          </div>
        ) : (
          /* Concept Grid View */
          <div className="space-y-8">
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-purple-600">
                  All Concepts
                </TabsTrigger>
                <TabsTrigger value="beginner" className="text-white data-[state=active]:bg-green-600">
                  Beginner
                </TabsTrigger>
                <TabsTrigger value="intermediate" className="text-white data-[state=active]:bg-yellow-600">
                  Intermediate
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-red-600">
                  Advanced
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Concept Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcepts.map((concept) => (
                <Card
                  key={concept.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-700/50"
                  onClick={() => setSelectedConcept(concept.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className={`bg-gradient-to-r ${concept.color} text-white`}>
                        {concept.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                      {concept.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300">{concept.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${concept.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
