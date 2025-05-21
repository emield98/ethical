import { ChatbotBuilder } from "@/components/chatbot-builder"

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 uneven-spacing">
          <h1 className="text-4xl font-bold mb-4">Build Your Own Chatbot</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            You've been hired to build a chatbot. Every decision you make will shape its capabilities, limitations, and
            ethical implications.
          </p>
        </div>

        <ChatbotBuilder />
      </div>
    </main>
  )
}
