"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");

  const handleStart = () => {
    if (eventName.trim()) {
      localStorage.setItem("eventName", eventName.trim());
      router.push("/slideshow");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
            Foto Slides
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Compartilhe momentos em tempo real
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Nome do evento..."
            className="w-full px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />

          <button
            onClick={handleStart}
            disabled={!eventName.trim()}
            className={cn(
              "w-full px-8 py-4 rounded-2xl font-medium text-lg transition-all flex items-center justify-center gap-2",
              eventName.trim()
                ? "bg-primary text-white hover:opacity-90 shadow-lg shadow-orange-500/25"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            )}
          >
            <Play size={20} fill="currentColor" />
            Iniciar Slideshow
          </button>
        </div>
      </div>
    </div>
  );
}
