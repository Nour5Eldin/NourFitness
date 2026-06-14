"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Flame, BarChart2, Clock, ClipboardList } from "lucide-react";
import dynamic from "next/dynamic";
import WeightControl from "@/components/WeightControl";
import { cn } from "@/lib/utils";

const WeeklyTrainingSplit  = dynamic(() => import("@/components/WeeklyTrainingSplit"),  { ssr: false });
const CaloriesBurnedWeekly = dynamic(() => import("@/components/CaloriesBurnedWeekly"), { ssr: false });
const IntensityVolume      = dynamic(() => import("@/components/IntensityVolume"),      { ssr: false });
const WorkoutTimeBreakdown = dynamic(() => import("@/components/WorkoutTimeBreakdown"), { ssr: false });
const LogWorkout           = dynamic(() => import("@/components/LogWorkout"),           { ssr: false });

const TABS = [
  { id: "split",    label: "Program",   labelAr: "البرنامج",  icon: Calendar },
  { id: "calories", label: "Calories",  labelAr: "السعرات",   icon: Flame },
  { id: "intensity",label: "Volume",    labelAr: "الشدة",     icon: BarChart2 },
  { id: "time",     label: "Time",      labelAr: "الوقت",     icon: Clock },
  { id: "log",      label: "Log",       labelAr: "تسجيل",     icon: ClipboardList },
] as const;

type TabId = typeof TABS[number]["id"];

export default function Home() {
  const [tab, setTab]       = useState<TabId>("split");
  const [weight, setWeight] = useState(0);

  // Load saved weight from backend on mount
  useEffect(() => {
    fetch("/api/user-weight")
      .then(r => r.json())
      .then(j => {
        if (j.data?.bodyWeightKg > 0) setWeight(j.data.bodyWeightKg);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-2xl px-4 pt-10 pb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              PPL + Cardio + Flexibility
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Nour Fitness</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            5-day weekly plan · Scientific calorie tracking · Bilingual
          </p>

          {/* Weight control — always visible */}
          <div className="mt-4">
            <WeightControl weight={weight} onChange={setWeight} />
          </div>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center transition-colors cursor-pointer",
                    active ? "text-zinc-50" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-medium">{t.label}</span>
                  <span className="text-[8px] text-zinc-600">{t.labelAr}</span>
                  {active && (
                    <motion.div
                      layoutId="tab-line"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {tab === "split"     && <WeeklyTrainingSplit />}
            {tab === "calories"  && <CaloriesBurnedWeekly weight={weight} />}
            {tab === "intensity" && <IntensityVolume />}
            {tab === "time"      && <WorkoutTimeBreakdown />}
            {tab === "log"       && <LogWorkout weight={weight} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
