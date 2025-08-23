"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaveParticleSimulation } from "@/components/simulations/wave-particle-simulation"
import { QuantumTunnelingSimulation } from "@/components/simulations/quantum-tunneling-simulation"
import { EntanglementSimulation } from "@/components/simulations/entanglement-simulation"
import { SuperpositionSimulation } from "@/components/simulations/superposition-simulation"
import { UncertaintyPrincipleSimulation } from "@/components/simulations/uncertainty-principle-simulation"
import { Atom, Zap, Waves, GitBranch, Target } from "lucide-react"

const quantumConcepts = [
  {
    id: "wave-particle",
    title: "Wave-Particle Duality",
    description: "Explore how quantum objects exhibit both wave and particle properties",
    icon: Waves,
    color: "bg-blue-500",
    component: WaveParticleSimulation,
  },
  {
    id: "superposition",
    title: "Quantum Superposition",
    description: "Visualize how particles exist in multiple states simultaneously",
    icon: GitBranch,
    color: "bg-purple-500",
    component: SuperpositionSimulation,
  },
  {
    id: "tunneling",
    title: "Quantum Tunneling",
    description: "See how particles can pass through energy barriers",
    icon: Zap,
    color: "bg-orange-500",
    component: QuantumTunnelingSimulation,
  },
  {
    id: "entanglement",
    title: "Quantum Entanglement",
    description: "Understand spooky action at a distance between paired particles",
    icon: Atom,
    color: "bg-green-500",
    component: EntanglementSimulation,
  },
  {
    id: "uncertainty",
    title: "Heisenberg Uncertainty",
    description: "Explore the fundamental limits of simultaneous measurement",
    icon: Target,
    color: "bg-red-500",
    component: UncertaintyPrincipleSimulation,
  },
]

export default function QuantumPhysicsApp() {
  const [selectedConcept, setSelectedConcept] = useState(quantumConcepts[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quantum Physics AI
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Interactive quantum mechanics simulations powered by AI. Explore the fundamental principles that govern the
            quantum world through authentic visualizations.
          </p>
        </div>

        <Tabs defaultValue="simulations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="simulations">Interactive Simulations</TabsTrigger>
            <TabsTrigger value="concepts">Concept Explorer</TabsTrigger>
          </TabsList>

          <TabsContent value="simulations" className="space-y-8">
            {/* Concept Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
              {quantumConcepts.map((concept) => {
                const IconComponent = concept.icon
                return (
                  <Button
                    key={concept.id}
                    variant={selectedConcept.id === concept.id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      selectedConcept.id === concept.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-600"
                    }`}
                    onClick={() => setSelectedConcept(concept)}
                  >
                    <div className={`p-2 rounded-full ${concept.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center leading-tight">{concept.title}</span>
                  </Button>
                )
              })}
            </div>

            {/* Active Simulation */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedConcept.color}`}>
                    <selectedConcept.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedConcept.title}</CardTitle>
                    <CardDescription className="text-blue-200">{selectedConcept.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <selectedConcept.component />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quantumConcepts.map((concept) => {
                const IconComponent = concept.icon
                return (
                  <Card key={concept.id} className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${concept.color}`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white">{concept.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-200 mb-4">{concept.description}</p>
                      <Button
                        onClick={() => {
                          setSelectedConcept(concept)
                          // Switch to simulations tab
                          const simulationsTab = document.querySelector('[value="simulations"]') as HTMLButtonElement
                          simulationsTab?.click()
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Explore Simulation
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
