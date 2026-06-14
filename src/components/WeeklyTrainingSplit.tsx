"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, Info, Dumbbell,
  Wind, Activity, Clock, Target, BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TRAINING_DAYS } from "@/data/training";
import type { Phase } from "@/types/fitness";
import { cn } from "@/lib/utils";

const phaseIcon = (type: Phase["type"]) => {
  switch (type) {
    case "warmup":  return <Wind className="w-3.5 h-3.5" />;
    case "main":    return <Dumbbell className="w-3.5 h-3.5" />;
    case "cooldown":return <Activity className="w-3.5 h-3.5" />;
    case "cardio":  return <Activity className="w-3.5 h-3.5" />;
    case "stretch": return <Target className="w-3.5 h-3.5" />;
  }
};

const TYPE_LABELS: Record<string, string> = {
  push: "Push", pull: "Pull", legs: "Legs", upper: "Upper",
  cardio: "Cardio", rest: "Rest", optional: "Optional",
};

export default function WeeklyTrainingSplit() {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const day = TRAINING_DAYS[activeDay];

  return (
    <div className="flex flex-col gap-4">
      {/* Day selector row */}
      <div className="grid grid-cols-7 gap-1.5">
        {TRAINING_DAYS.map((d, i) => (
          <button
            key={d.id}
            onClick={() => { setActiveDay(i); setExpandedPhase(0); }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all duration-200 cursor-pointer",
              activeDay === i
                ? "shadow-sm"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            )}
            style={
              activeDay === i
                ? { background: `${d.colors.accent}14`, borderColor: d.colors.accent }
                : {}
            }
          >
            <span className="text-[10px] font-medium text-zinc-500">{d.nameEn}</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-tight"
              style={{ background: d.colors.badgeBg, color: d.colors.badgeText }}
            >
              {TYPE_LABELS[d.type]}
            </span>
            {activeDay === i && (
              <motion.div
                layoutId="day-dot"
                className="w-1 h-1 rounded-full"
                style={{ background: d.colors.accent }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={day.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0 mt-0.5" style={{ background: day.colors.accent }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-snug">
                      <span className="text-zinc-50">{day.nameAr}</span>
                      <span className="text-zinc-500 font-normal mx-1.5">—</span>
                      <span className="text-zinc-200">{day.labelEn}</span>
                    </CardTitle>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {day.durationMin > 0 ? `${day.durationMin} min` : "Rest"}
                    </Badge>
                    {day.totalSets > 0 && (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <BookOpen className="w-2.5 h-2.5" />
                        {day.totalSets} sets
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      RPE {day.rpe}
                    </Badge>
                    <span className="text-[10px] text-zinc-600">{day.subAr} · {day.subEn}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4 flex flex-col gap-2">
              {day.phases.map((phase, pi) => (
                <div key={pi} className="rounded-lg border border-zinc-800 overflow-hidden">
                  {/* Phase header — clickable */}
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedPhase(expandedPhase === pi ? null : pi)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{phaseIcon(phase.type)}</span>
                      <span className="text-xs font-medium text-zinc-300">{phase.labelEn}</span>
                      <span className="text-[10px] text-zinc-600">{phase.labelAr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600">{phase.durationMin} min</span>
                      {expandedPhase === pi
                        ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" />
                        : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                      }
                    </div>
                  </button>

                  {/* Exercises */}
                  <AnimatePresence>
                    {expandedPhase === pi && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-zinc-800">
                          {phase.exercises.map((ex, ei) => (
                            <div
                              key={ex.id}
                              className={cn(
                                "flex items-start justify-between gap-3 px-3 py-2.5",
                                ei < phase.exercises.length - 1 && "border-b border-zinc-800/60"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                {/* Bilingual name */}
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="text-xs font-medium text-zinc-200">
                                    {ex.name.en}
                                  </span>
                                  <span className="text-[11px] text-zinc-600">
                                    {ex.name.ar}
                                  </span>
                                </div>
                                <div className="text-[11px] text-zinc-500 mt-0.5">{ex.focus}</div>
                              </div>
                              <div className="text-[11px] font-mono text-zinc-400 whitespace-nowrap shrink-0">
                                {ex.sets}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Tip */}
              <div className="flex gap-2 rounded-lg bg-zinc-800/40 border border-zinc-800 p-3 mt-1">
                <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{day.tipEn}</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">{day.tipAr}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
