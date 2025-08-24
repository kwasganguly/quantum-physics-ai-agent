"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, BookOpen, Zap } from "lucide-react"

interface LearningStats {
  conceptsLearned: number
  totalConcepts: number
  simulationsCompleted: number
  totalSimulations: number
  quizzesCompleted: number
  aiQuestionsAsked: number
}

export function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>({
    conceptsLearned: 0,
    totalConcepts: 6,
    simulationsCompleted: 0,
    totalSimulations: 3,
    quizzesCompleted: 0,
    aiQuestionsAsked: 0,
  })

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("quantum-learning-stats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem("quantum-learning-stats", JSON.stringify(stats))
  }, [stats])

  const overallProgress = Math.round(
    (stats.conceptsLearned / stats.totalConcepts) * 40 +
      (stats.simulationsCompleted / stats.totalSimulations) * 30 +
      (Math.min(stats.quizzesCompleted, 3) / 3) * 20 +
      (Math.min(stats.aiQuestionsAsked, 10) / 10) * 10,
  )

  const getAchievements = () => {
    const achievements = []
    if (stats.conceptsLearned >= 3) achievements.push("Concept Explorer")
    if (stats.simulationsCompleted >= 2) achievements.push("Simulation Master")
    if (stats.quizzesCompleted >= 1) achievements.push("Quiz Taker")
    if (stats.aiQuestionsAsked >= 5) achievements.push("Curious Learner")
    if (overallProgress >= 50) achievements.push("Quantum Student")
    if (overallProgress >= 80) achievements.push("Quantum Scholar")
    return achievements
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Learning Progress
        </CardTitle>
        <CardDescription>Track your quantum physics journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Concepts</span>
            </div>
            <Progress value={(stats.conceptsLearned / stats.totalConcepts) * 100} className="w-full" />
            <div className="text-xs text-muted-foreground">
              {stats.conceptsLearned}/{stats.totalConcepts} learned
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Simulations</span>
            </div>
            <Progress value={(stats.simulationsCompleted / stats.totalSimulations) * 100} className="w-full" />
            <div className="text-xs text-muted-foreground">
              {stats.simulationsCompleted}/{stats.totalSimulations} completed
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {getAchievements().map((achievement, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {achievement}
              </Badge>
            ))}
            {getAchievements().length === 0 && (
              <span className="text-xs text-muted-foreground">Complete activities to earn achievements!</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.quizzesCompleted}</div>
            <div className="text-xs text-muted-foreground">Quizzes Completed</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.aiQuestionsAsked}</div>
            <div className="text-xs text-muted-foreground">AI Questions Asked</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
