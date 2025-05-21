import { ChatbotBuilder } from "@/components/chatbot-builder";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 uneven-spacing">
          <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Build Your Own Chatbot
          </h1>
          <div className="flex justify-center mb-8">
            <img src="/globe.svg" alt="AI Globe" className="w-32 h-32 animate-spin-slow" />
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-xl p-8 mb-8 border border-blue-100 dark:border-slate-700">
            <p className="text-xl text-slate-800 dark:text-slate-200 mb-10 text-center">
              What does it take to create a chatbot? And what are the ethical decisions behind every choice?
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
              This interactive tool lets you step into the shoes of an AI developer. As you design your own chatbot, you’ll make real-world decisions about data, behavior, bias, safety, and more. Along the way, you’ll learn how each choice shapes not only what your chatbot can do, but also the ethical risks it might pose.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-10">
              AI systems are not neutral. They reflect the values, constraints, and priorities of their creators. By exploring these trade-offs yourself, you'll gain a deeper understanding of the challenges behind today’s most powerful technologies.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 text-center"><b>
              Ready to get started? Click the button below to begin your journey into the world of AI development.
            </b></p>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/chatbot">
              <button className="text-2xl font-bold px-12 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:scale-110 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Start Building
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
