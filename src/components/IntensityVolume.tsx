"use client";
import { motion } from "framer-motion";
import { BarChart2, Layers, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRAINING_DAYS, WEEK_STATS } from "@/data/training";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TT = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-zinc-200 mb-1">{label}</p>
      {payload.map((p: { name: string; value: number }, i: number) => (
        <p key={i} className="text-zinc-400">{p.name}: <span className="text-zinc-100">{p.value}</span></p>
      ))}
    </div>
  ) : null;

export default function IntensityVolume() {
  const rpeData    = TRAINING_DAYS.map(d => ({ name: d.nameEn, RPE: d.rpe, fill: d.colors.accent }));
  const volumeData = TRAINING_DAYS.map(d => ({ name: d.nameEn, Sets: d.totalSets, fill: d.colors.accent }));
  const fatigueData = TRAINING_DAYS.map((d, i) => ({
    name: d.nameEn, Fatigue: WEEK_STATS.fatigueByDay[i],
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Per-day set grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {TRAINING_DAYS.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-2.5 text-center">
              <div className="text-[10px] text-zinc-500 mb-1">{d.nameEn}</div>
              <div className="text-base font-bold" style={{ color: d.colors.accent }}>
                {d.totalSets > 0 ? d.totalSets : "—"}
              </div>
              <div className="text-[9px] text-zinc-600 mt-0.5">
                {d.type === "rest" ? "rest" : d.type === "optional" ? "opt" : "sets"}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* RPE + Volume charts side by side */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-zinc-400 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              Intensity (RPE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rpeData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="RPE" radius={[4, 4, 0, 0]}>
                    {rpeData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Volume (Sets)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 25]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="Sets" radius={[4, 4, 0, 0]}>
                    {volumeData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative fatigue */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            Cumulative Fatigue — builds then recovers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fatigueData}>
                <defs>
                  <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E24B4A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E24B4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 14]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="Fatigue" stroke="#E24B4A" strokeWidth={2}
                  fill="url(#fatGrad)" dot={{ r: 3.5, fill: "#E24B4A", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Sets / Week", val: WEEK_STATS.totalSets, sub: "Beginner–Intermediate range" },
          { label: "High-Intensity Days", val: WEEK_STATS.highIntensityDays, sub: "out of 7" },
          { label: "Rest Ratio", val: `${WEEK_STATS.restRatioPct}%`, sub: "active + full rest" },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardContent className="p-3">
                <div className="text-[10px] text-zinc-500 mb-1">{c.label}</div>
                <div className="text-xl font-bold text-zinc-50">{c.val}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{c.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
