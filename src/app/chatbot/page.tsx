import { ChatbotBuilder } from "@/components/chatbot-builder"

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Build Your Own Chatbot</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            You've been hired to build a chatbot. Every decision you make will shape its capabilities, limitations, and
            ethical implications. Manage your budget wisely!
          </p>
        </div>

        <ChatbotBuilder />
      </div>
    </main>
  )
}
