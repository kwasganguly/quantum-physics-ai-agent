"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Atom, Brain, Zap, MessageCircle, Play, Lightbulb, Target, BookOpen } from "lucide-react"
import { DoubleSlit, SchrodingersCat, QuantumTunneling } from "@/components/quantum-simulations"
import { InteractiveConceptCard } from "@/components/interactive-concept-card"
import { QuantumQuiz } from "@/components/quantum-quiz"
import { LearningProgress } from "@/components/learning-progress"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function QuantumPhysicsAI() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("concepts")
  const [conceptsCompleted, setConceptsCompleted] = useState(0)
  const [refreshProgress, setRefreshProgress] = useState(0)

  useEffect(() => {
    const savedMessages = localStorage.getItem("quantum-chat-history")
    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem("quantum-chat-history", JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  const handleAskAI = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = { role: "user", content: currentMessage }
    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    const stats = JSON.parse(localStorage.getItem("quantum-learning-stats") || '{"aiQuestionsAsked": 0}')
    stats.aiQuestionsAsked = (stats.aiQuestionsAsked || 0) + 1
    localStorage.setItem("quantum-learning-stats", JSON.stringify(stats))
    setRefreshProgress((prev) => prev + 1) // Trigger progress refresh

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      })

      const data = await response.json()
      const aiMessage: ChatMessage = { role: "assistant", content: data.response }
      setChatMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI chat error:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleConceptComplete = () => {
    const stats = JSON.parse(localStorage.getItem("quantum-learning-stats") || '{"conceptsLearned": 0}')
    stats.conceptsLearned = (stats.conceptsLearned || 0) + 1
    localStorage.setItem("quantum-learning-stats", JSON.stringify(stats))
    setConceptsCompleted((prev) => prev + 1)
    setRefreshProgress((prev) => prev + 1) // Trigger progress refresh
  }

  const handleSimulationComplete = (simulationType: string) => {
    const stats = JSON.parse(
      localStorage.getItem("quantum-learning-stats") || '{"simulationsCompleted": 0, "completedSimulations": []}',
    )
    if (!stats.completedSimulations) stats.completedSimulations = []

    if (!stats.completedSimulations.includes(simulationType)) {
      stats.completedSimulations.push(simulationType)
      stats.simulationsCompleted = stats.completedSimulations.length
      localStorage.setItem("quantum-learning-stats", JSON.stringify(stats))
      setRefreshProgress((prev) => prev + 1) // Trigger progress refresh
    }
  }

  const handleQuizComplete = (score: number, total: number) => {
    const stats = JSON.parse(localStorage.getItem("quantum-learning-stats") || '{"quizzesCompleted": 0}')
    stats.quizzesCompleted = (stats.quizzesCompleted || 0) + 1
    stats.lastQuizScore = score
    stats.lastQuizTotal = total
    localStorage.setItem("quantum-learning-stats", JSON.stringify(stats))
    setRefreshProgress((prev) => prev + 1) // Trigger progress refresh
  }

  const getSmartSuggestions = () => {
    switch (activeTab) {
      case "concepts":
        return [
          "Explain wave-particle duality in simple terms",
          "What is quantum superposition?",
          "How does quantum entanglement work?",
        ]
      case "simulations":
        return [
          "Why does observation change the double-slit results?",
          "What makes Schrödinger's cat both alive and dead?",
          "How can particles tunnel through barriers?",
        ]
      case "quiz":
        return [
          "Give me a hint for quantum physics questions",
          "What are the most important quantum concepts to remember?",
          "Explain the uncertainty principle",
        ]
      default:
        return [
          "What is quantum physics?",
          "How is quantum physics used in technology?",
          "What are the strangest quantum phenomena?",
        ]
    }
  }

  const clearChatHistory = () => {
    setChatMessages([])
    localStorage.removeItem("quantum-chat-history")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Atom className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quantum Physics AI
            </h1>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the fascinating world of quantum mechanics with AI-powered explanations and interactive simulations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="simulations">Simulations</TabsTrigger>
            <TabsTrigger value="ai-chat">Ask AI</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Quantum Concepts Tab */}
          <TabsContent value="concepts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <InteractiveConceptCard
                title="Wave-Particle Duality"
                description="The fundamental principle that quantum objects exhibit both wave and particle properties"
                icon={<Zap className="h-5 w-5 text-yellow-500" />}
                badge="Fundamental Concept"
                detailedContent="Wave-particle duality is one of the most counterintuitive aspects of quantum mechanics. It means that every quantum object exhibits both wave-like and particle-like properties, but never both simultaneously. The behavior you observe depends entirely on how you choose to measure it."
                examples={[
                  "Light behaves as waves when creating interference patterns, but as particles (photons) when hitting a detector",
                  "Electrons create wave interference in the double-slit experiment, but leave particle-like dots on the screen",
                  "Matter waves: Even large objects like baseballs have a wavelength, but it's so small we never notice wave behavior",
                ]}
                difficulty={4}
                onComplete={handleConceptComplete}
              />

              <InteractiveConceptCard
                title="Superposition"
                description="Quantum systems can exist in multiple states simultaneously"
                icon={<Atom className="h-5 w-5 text-blue-500" />}
                badge="Core Principle"
                detailedContent="Superposition allows quantum particles to exist in multiple states at once until measured. This isn't just uncertainty about which state it's in - the particle genuinely exists in all possible states simultaneously, with each state having a certain probability amplitude."
                examples={[
                  "A quantum coin can be both heads AND tails at the same time until you look at it",
                  "An electron can spin both clockwise and counterclockwise simultaneously",
                  "Quantum computers use superposition to process multiple calculations at once",
                ]}
                difficulty={3}
                onComplete={handleConceptComplete}
              />

              <InteractiveConceptCard
                title="Quantum Entanglement"
                description="Particles become correlated and instantly affect each other"
                icon={<Brain className="h-5 w-5 text-purple-500" />}
                badge="Spooky Action"
                detailedContent="When particles become entangled, they form a single quantum system where measuring one particle instantly determines the state of its partner, regardless of the distance between them. Einstein called this 'spooky action at a distance' because it seemed to violate the speed of light limit."
                examples={[
                  "Two entangled photons: measuring one as vertically polarized instantly makes the other horizontally polarized",
                  "Quantum teleportation uses entanglement to transfer quantum states across vast distances",
                  "Quantum cryptography relies on entanglement to detect eavesdropping attempts",
                ]}
                difficulty={5}
                onComplete={handleConceptComplete}
              />

              <InteractiveConceptCard
                title="Uncertainty Principle"
                description="You cannot precisely know both position and momentum simultaneously"
                icon={<Target className="h-5 w-5 text-red-500" />}
                badge="Fundamental Limit"
                detailedContent="Heisenberg's uncertainty principle states that the more precisely you know a particle's position, the less precisely you can know its momentum, and vice versa. This isn't due to measurement limitations - it's a fundamental property of quantum reality."
                examples={[
                  "Trying to pinpoint an electron's exact location makes its velocity completely unpredictable",
                  "Quantum tunneling happens because particles can 'borrow' energy due to energy-time uncertainty",
                  "The principle applies to other pairs like energy-time and angular momentum-angle",
                ]}
                difficulty={4}
                onComplete={handleConceptComplete}
              />
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to see these concepts in action?</h3>
                    <p className="text-muted-foreground">Try our interactive quantum simulations</p>
                  </div>
                  <Button onClick={() => setActiveTab("simulations")} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    View Simulations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulations Tab */}
          <TabsContent value="simulations" className="space-y-6">
            <DoubleSlit onComplete={() => handleSimulationComplete("double-slit")} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SchrodingersCat onComplete={() => handleSimulationComplete("schrodingers-cat")} />
              <QuantumTunneling onComplete={() => handleSimulationComplete("quantum-tunneling")} />
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Have questions about what you observed?</h3>
                    <p className="text-muted-foreground">Ask our AI assistant for detailed explanations</p>
                  </div>
                  <Button onClick={() => setActiveTab("ai-chat")} className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Ask AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="ai-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Ask the Quantum AI
                  </div>
                  {chatMessages.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearChatHistory}>
                      Clear History
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Get AI-powered explanations about quantum physics concepts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full border rounded-lg p-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">Ask me anything about quantum physics!</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {getSmartSuggestions().map((suggestion, index) => (
                          <Button key={index} variant="outline" size="sm" onClick={() => setCurrentMessage(suggestion)}>
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about quantum mechanics, superposition, entanglement..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="flex-1"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAskAI()
                      }
                    }}
                  />
                  <Button onClick={handleAskAI} disabled={isLoading || !currentMessage.trim()} className="self-end">
                    {isLoading ? "Thinking..." : "Ask AI"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <QuantumQuiz onComplete={handleQuizComplete} />

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Track your learning journey</h3>
                    <p className="text-muted-foreground">See your progress and achievements</p>
                  </div>
                  <Button onClick={() => setActiveTab("progress")} className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <LearningProgress key={refreshProgress} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Recommended Next Steps
                </CardTitle>
                <CardDescription>Continue your quantum physics journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                    onClick={() => setActiveTab("concepts")}
                  >
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Learn More Concepts</div>
                      <div className="text-sm text-muted-foreground">Explore quantum principles in detail</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                    onClick={() => setActiveTab("simulations")}
                  >
                    <Play className="h-5 w-5 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Try Simulations</div>
                      <div className="text-sm text-muted-foreground">See quantum effects in action</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                    onClick={() => setActiveTab("ai-chat")}
                  >
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">Ask Questions</div>
                      <div className="text-sm text-muted-foreground">Get AI-powered explanations</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                    onClick={() => setActiveTab("quiz")}
                  >
                    <Target className="h-5 w-5 text-red-500" />
                    <div className="text-left">
                      <div className="font-medium">Test Knowledge</div>
                      <div className="text-sm text-muted-foreground">Challenge yourself with quizzes</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
