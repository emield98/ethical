import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
<Analytics/>


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Build Your Own Chatbot",
  description: "An interactive tool to explore AI development and ethics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full text-center text-xs text-slate-400 py-6 mt-0 border-t border-slate-100 dark:border-slate-800">
          &copy; {new Date().getFullYear()} Build Your Own Chatbot. All rights
          reserved.
          <br />
          Made by Kylian, Stijn, Andrew, Marco and Emiel
          <br />
          University of Groningen
        </footer>
      </body>
    </html>
  );
}
