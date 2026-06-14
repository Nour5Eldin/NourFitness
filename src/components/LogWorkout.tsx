"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PlusCircle, ListChecks, RotateCcw, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TRAINING_DAYS } from "@/data/training";
import { calcTotalCalories } from "@/lib/calories";
import type { WorkoutLog } from "@/types/fitness";
import { cn } from "@/lib/utils";

interface Props { weight: number }

const TYPE_LABELS: Record<string, string> = {
  push: "Push", pull: "Pull", legs: "Legs", upper: "Upper",
  cardio: "Cardio", rest: "Rest", optional: "Optional",
};

export default function LogWorkout({ weight }: Props) {
  const [selectedDay, setSelectedDay] = useState<string>(TRAINING_DAYS[0].id);
  const [notes, setNotes]             = useState("");
  const [logs, setLogs]               = useState<WorkoutLog[]>([]);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState("");
  const [showLogs, setShowLogs]       = useState(false);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  const day = TRAINING_DAYS.find(d => d.id === selectedDay)!;
  const cals = calcTotalCalories(
    day.metabolics.met, weight, day.durationMin, day.metabolics.epocFactor
  );

  async function handleLog() {
    if (weight === 0) { setError("Set your body weight first"); return; }
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayId: day.id,
          dayType: day.type,
          bodyWeightKg: weight,
          durationMin: day.durationMin,
          sets: day.totalSets,
          rpe: day.rpe,
          caloriesBurned: cals.total,
          notes,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setNotes("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogs() {
    setFetchingLogs(true);
    try {
      const res  = await fetch("/api/workout-logs");
      const json = await res.json();
      setLogs(json.data);
      setShowLogs(true);
    } finally {
      setFetchingLogs(false);
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-4">
      {/* Day selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs text-zinc-400 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            Log Today's Workout
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {TRAINING_DAYS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all cursor-pointer",
                  selectedDay === d.id ? "shadow-sm" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                )}
                style={selectedDay === d.id
                  ? { background: `${d.colors.accent}14`, borderColor: d.colors.accent }
                  : {}
                }
              >
                <span className="text-[9px] text-zinc-500">{d.nameEn}</span>
                <span className="text-[8px] font-bold px-1 py-0.5 rounded-md"
                  style={{ background: d.colors.badgeBg, color: d.colors.badgeText }}>
                  {TYPE_LABELS[d.type]}
                </span>
              </button>
            ))}
          </div>

          <Separator />

          {/* Selected day preview */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
            <div className="w-1 h-10 rounded-full shrink-0" style={{ background: day.colors.accent }} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-zinc-100">{day.labelEn}</div>
              <div className="text-[11px] text-zinc-500 mb-1.5">{day.labelAr}</div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{day.durationMin} min</Badge>
                <Badge variant="outline" className="text-[10px]">{day.totalSets} sets</Badge>
                <Badge variant="outline" className="text-[10px]">RPE {day.rpe}</Badge>
                {weight > 0 && (
                  <Badge className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    ~{cals.total} kcal
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] text-zinc-500 mb-1.5 block">
              Notes (optional) — ملاحظات
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did the session feel? PRs? Injuries?..."
              rows={2}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLog}
            disabled={loading || weight === 0}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer",
              success
                ? "bg-emerald-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
            )}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.span key="ok" className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <CheckCircle2 className="w-4 h-4" /> Logged! ✓
                </motion.span>
              ) : (
                <motion.span key="log" className="flex items-center gap-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PlusCircle className="w-4 h-4" />
                  {loading ? "Saving..." : weight === 0 ? "Set weight first" : "Log Workout"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <button
          onClick={showLogs ? () => setShowLogs(false) : fetchLogs}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/30 transition-colors rounded-xl cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Workout History</span>
            {logs.length > 0 && (
              <Badge variant="outline" className="text-[10px]">{logs.length}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {fetchingLogs && <RotateCcw className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
            <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", showLogs && "rotate-180")} />
          </div>
        </button>

        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Separator />
              <CardContent className="pt-4">
                {logs.length === 0 ? (
                  <p className="text-sm text-zinc-600 text-center py-4">
                    No logs yet — complete your first session!
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {logs.map(log => {
                      const logDay = TRAINING_DAYS.find(d => d.id === log.dayId);
                      return (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-800/30">
                          {logDay && (
                            <div className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                              style={{ background: logDay.colors.accent }} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-semibold text-zinc-200">
                                  {logDay?.labelEn ?? log.dayId}
                                </span>
                                <div className="text-[10px] text-zinc-600 mt-0.5">{formatDate(log.date)}</div>
                              </div>
                              <Badge className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                                {log.caloriesBurned} kcal
                              </Badge>
                            </div>
                            <div className="flex gap-2 mt-1.5 flex-wrap">
                              <Badge variant="outline" className="text-[9px]">{log.bodyWeightKg} kg</Badge>
                              <Badge variant="outline" className="text-[9px]">{log.sets} sets</Badge>
                              <Badge variant="outline" className="text-[9px]">RPE {log.rpe}</Badge>
                            </div>
                            {log.notes && (
                              <p className="text-[10px] text-zinc-500 mt-1.5 italic">"{log.notes}"</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
