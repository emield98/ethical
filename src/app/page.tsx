"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Code, Shield, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">Build Your Own Chatbot</h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            What does it take to create a chatbot? And what are the ethical decisions behind every choice?
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 mb-12">
          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                This interactive tool lets you step into the shoes of an AI developer. As you design your own chatbot,
                you'll make real-world decisions about data, behavior, bias, safety, and more. Along the way, you'll
                learn how each choice shapes not only what your chatbot can do, but also the ethical risks it might
                pose.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>AI systems are not neutral.</strong> They reflect the values, constraints, and priorities of
                their creators. By exploring these trade-offs yourself, you'll gain a deeper understanding of the
                challenges behind today's most powerful technologies.
              </p>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Budget Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Experience how financial limitations force real trade-offs between features, safety, and performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Data Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Choose your training data and see how it shapes your AI's knowledge, biases, and capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">Safety Trade-offs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Balance content filtering and safety measures against functionality and user freedom.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Ethical Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Navigate complex questions about bias, fairness, and whose values your AI should represent.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* What You'll Learn */}
          <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What You'll Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-World Constraints</h3>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>• Work within a realistic budget that limits your options</li>
                    <li>• Make trade-offs between competing priorities</li>
                    <li>• See how costs accumulate with each decision</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ethical Dilemmas</h3>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li>• Understand how bias emerges in AI systems</li>
                    <li>• Explore the tension between safety and utility</li>
                    <li>• Learn about transparency vs. user confidence</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Ready to get started? Let's build your chatbot.
          </p>
          <Button onClick={() => {
            router.push('/chatbot')
          }}>
            Start Building <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
