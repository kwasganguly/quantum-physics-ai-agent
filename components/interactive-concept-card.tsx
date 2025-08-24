"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, BookOpen, Lightbulb } from "lucide-react"

interface ConceptCardProps {
  title: string
  description: string
  icon: React.ReactNode
  badge: string
  detailedContent: string
  examples: string[]
  difficulty: number
  onComplete?: () => void
}

export function InteractiveConceptCard({
  title,
  description,
  icon,
  badge,
  detailedContent,
  examples,
  difficulty,
  onComplete,
}: ConceptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentExample, setCurrentExample] = useState(0)

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete?.()
  }

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length)
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${isCompleted ? "ring-2 ring-green-500" : ""}`}>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">{badge}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Difficulty:</span>
            <Progress value={difficulty * 20} className="w-16 h-2" />
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{detailedContent}</p>
            </div>

            {examples.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Examples ({currentExample + 1}/{examples.length})
                  </h4>
                  <Button variant="outline" size="sm" onClick={nextExample}>
                    Next Example
                  </Button>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">{examples[currentExample]}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleComplete} disabled={isCompleted} className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {isCompleted ? "Completed!" : "Mark as Learned"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
