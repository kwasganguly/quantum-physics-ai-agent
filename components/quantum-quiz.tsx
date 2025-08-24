"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizProps {
  onComplete?: (score: number, total: number) => void
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What happens when you observe a quantum particle in the double-slit experiment?",
    options: [
      "It creates an interference pattern",
      "It behaves like a particle and goes through one slit",
      "It disappears completely",
      "It splits into multiple particles",
    ],
    correctAnswer: 1,
    explanation:
      "When observed, the particle's wave function collapses and it behaves like a classical particle, going through one slit and creating two bands instead of an interference pattern.",
  },
  {
    question: "What is quantum superposition?",
    options: [
      "When particles move very fast",
      "When particles exist in multiple states simultaneously",
      "When particles are very small",
      "When particles have no mass",
    ],
    correctAnswer: 1,
    explanation:
      "Quantum superposition is the principle that quantum systems can exist in multiple states at the same time until they are measured or observed.",
  },
  {
    question: "In Schrödinger's cat thought experiment, what causes the cat to be in a definite state?",
    options: ["Time passing", "The cat's movement", "Opening the box (observation)", "The radioactive decay"],
    correctAnswer: 2,
    explanation:
      "The act of observation (opening the box) causes the quantum superposition to collapse into a definite state - either alive or dead.",
  },
]

export function QuantumQuiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setShowExplanation(true)
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
      onComplete?.(
        score + (selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 1 : 0),
        quizQuestions.length,
      )
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100

  if (quizCompleted) {
    const finalScore = score + (selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 1 : 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
          <CardDescription>How well do you understand quantum physics?</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-blue-600">
            {finalScore}/{quizQuestions.length}
          </div>
          <p className="text-lg">
            {finalScore === quizQuestions.length
              ? "Perfect! You're a quantum master!"
              : finalScore >= quizQuestions.length * 0.7
                ? "Great job! You understand the basics well."
                : "Keep learning! Quantum physics takes time to master."}
          </p>
          <Button onClick={resetQuiz} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantum Physics Quiz</CardTitle>
        <CardDescription>Test your understanding of quantum concepts</CardDescription>
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-medium">{currentQ.question}</h3>

        <div className="space-y-2">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={
                showExplanation
                  ? index === currentQ.correctAnswer
                    ? "default"
                    : index === selectedAnswer && index !== currentQ.correctAnswer
                      ? "destructive"
                      : "outline"
                  : selectedAnswer === index
                    ? "default"
                    : "outline"
              }
              className="w-full justify-start text-left h-auto p-4"
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <div className="flex items-center gap-2">
                {showExplanation && index === currentQ.correctAnswer && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {showExplanation && index === selectedAnswer && index !== currentQ.correctAnswer && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                {option}
              </div>
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-sm">{currentQ.explanation}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!showExplanation ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="w-full">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
