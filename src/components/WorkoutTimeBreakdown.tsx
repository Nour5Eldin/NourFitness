"use client";
import { motion } from "framer-motion";
import { Clock, Timer, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRAINING_DAYS } from "@/data/training";

const MAX_MIN = 60;

const LEGEND = [
  { labelEn: "Warmup",   labelAr: "تسخين", color: "#9FE1CB" },
  { labelEn: "Main",     labelAr: "تمرين", color: "#1D9E75" },
  { labelEn: "Cardio",   labelAr: "كارديو", color: "#378ADD" },
  { labelEn: "Flex / Cooldown", labelAr: "مرونة / تهدئة", color: "#7F77DD" },
  { labelEn: "Rest",     labelAr: "راحة",   color: "#3f3f46" },
];

export default function WorkoutTimeBreakdown() {
  const allMins = TRAINING_DAYS.map(d =>
    d.timeSegments.reduce((s, seg) => s + seg.min, 0)
  );
  const totalActive = allMins.reduce((s, m) => s + m, 0);
  const activeOnly  = allMins.filter(m => m > 0);
  const avgDay      = activeOnly.length ? Math.round(activeOnly.reduce((a, b) => a + b, 0) / activeOnly.length) : 0;
  const longest     = activeOnly.length ? Math.max(...activeOnly) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {LEGEND.map(l => (
          <div key={l.labelEn} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: l.color }} />
            <span className="text-[11px] text-zinc-500">
              {l.labelEn}
              <span className="text-zinc-700 ml-1">/ {l.labelAr}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Segmented bars */}
      <Card>
        <CardContent className="pt-4 flex flex-col gap-2.5">
          {TRAINING_DAYS.map((d, i) => {
            const total = allMins[i];
            return (
              <div key={d.id} className="grid items-center gap-3" style={{ gridTemplateColumns: "52px 1fr 40px" }}>
                <div>
                  <div className="text-[11px] font-medium text-zinc-300">{d.nameEn}</div>
                  <div className="text-[9px] text-zinc-600">{d.nameAr}</div>
                </div>

                <div className="h-6 rounded-lg overflow-hidden bg-zinc-800 flex">
                  {total === 0 ? (
                    <div
                      className="h-full flex-1 flex items-center justify-center text-[9px] font-medium"
                      style={{ color: d.colors.accent, background: `${d.colors.accent}10` }}
                    >
                      {d.type === "rest" ? "Rest" : "Optional"}
                    </div>
                  ) : (
                    <>
                      {d.timeSegments.map((seg, si) => {
                        const pct = (seg.min / MAX_MIN) * 100;
                        return (
                          <motion.div
                            key={si}
                            className="h-full flex items-center justify-center overflow-hidden"
                            style={{ background: seg.color, minWidth: 0 }}
                            title={`${seg.labelEn}: ${seg.min} min`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.05 + si * 0.03, duration: 0.4, ease: "easeOut" }}
                          >
                            {pct > 10 && (
                              <span className="text-[9px] font-semibold text-black/50 px-1 whitespace-nowrap">
                                {seg.labelEn} {seg.min}m
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                      {/* padding remainder */}
                      {total < MAX_MIN && (
                        <div style={{ width: `${((MAX_MIN - total) / MAX_MIN) * 100}%` }} />
                      )}
                    </>
                  )}
                </div>

                <span
                  className="text-xs font-semibold text-right"
                  style={{ color: total >= 50 ? "#1D9E75" : total > 0 ? "#d4d4d8" : "#52525b" }}
                >
                  {total > 0 ? `${total}m` : "—"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />, label: "Active min / week", val: `${totalActive}m` },
          { icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />, label: "Avg session", val: `${avgDay}m` },
          { icon: <Timer className="w-3.5 h-3.5 text-amber-400" />, label: "Longest session", val: `${longest}m` },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex justify-center mb-1.5">{s.icon}</div>
                <div className="text-lg font-bold text-zinc-50">{s.val}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tip */}
      <div className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
        <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Plan for max <strong className="text-zinc-300">60 min</strong> per session to account for equipment wait time.
          These timings assume minimal rest between machines.
        </p>
      </div>
    </div>
  );
}
