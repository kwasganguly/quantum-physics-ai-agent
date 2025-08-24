import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are a quantum physics expert and educator. Your role is to:
      
      1. Explain quantum physics concepts in clear, accessible language
      2. Use analogies and examples to make complex topics understandable
      3. Be accurate and scientifically correct
      4. Encourage curiosity and further learning
      5. Keep responses concise but informative (2-3 paragraphs max)
      
      Focus on topics like:
      - Wave-particle duality
      - Quantum superposition
      - Quantum entanglement
      - Uncertainty principle
      - Quantum tunneling
      - Schrödinger's cat
      - Double-slit experiment
      - Quantum computing basics
      
      Always maintain an educational and encouraging tone.`,
      prompt: message,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
