"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRAINING_DAYS } from "@/data/training";
import { calcTotalCalories, calcFatLossGrams, calcMaintenanceCalories } from "@/lib/calories";

interface Props { weight: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: { value: number }) => s + p.value, 0);
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-zinc-200 mb-1">{label}</p>
      {payload.map((p: { name: string; value: number }, i: number) => (
        <p key={i} className="text-zinc-400">{p.name}: <span className="text-zinc-200">{p.value}</span></p>
      ))}
      <p className="mt-1 pt-1 border-t border-zinc-700 font-semibold text-zinc-100">
        Total: {total} kcal
      </p>
    </div>
  );
};

export default function CaloriesBurnedWeekly({ weight }: Props) {
  const dayCalories = useMemo(() =>
    TRAINING_DAYS.map(d => ({
      day: d,
      ...calcTotalCalories(d.metabolics.met, weight, d.durationMin, d.metabolics.epocFactor),
    })),
    [weight]
  );

  const totalCal  = dayCalories.reduce((s, c) => s + c.total, 0);
  const fatLoss   = calcFatLossGrams(totalCal);
  const activeDays = dayCalories.filter(c => c.total > 0);
  const avgDay    = activeDays.length
    ? Math.round(activeDays.reduce((s, c) => s + c.total, 0) / activeDays.length)
    : 0;
  const maxCal    = Math.max(...dayCalories.map(c => c.total), 1);

  const chartData = dayCalories.map(c => ({
    name: c.day.nameEn,
    Direct: c.direct,
    EPOC: c.epoc,
    color: c.day.colors.accent,
  }));

  const isZero = weight === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, label: "kcal / week", val: isZero ? "—" : totalCal.toLocaleString() },
          { icon: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />, label: "g fat / week", val: isZero ? "—" : `${fatLoss}g` },
          { icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />, label: "avg / session", val: isZero ? "—" : `${avgDay}` },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
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

      {isZero && (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">
          اضبط وزنك من أعلى عشان تشوف الحسابات 👆
          <br />
          <span className="text-xs text-zinc-600">Set your weight above to see calorie calculations</span>
        </div>
      )}

      {/* Horizontal bars */}
      {!isZero && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Calories per day
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {dayCalories.map((c, i) => {
              const pct = c.total > 0 ? Math.max((c.total / maxCal) * 100, 5) : 0;
              return (
                <div key={c.day.id} className="grid items-center gap-3" style={{ gridTemplateColumns: "44px 1fr 52px" }}>
                  <span className="text-[11px] text-zinc-500">{c.day.nameEn}</span>
                  <div className="h-5 rounded-md overflow-hidden bg-zinc-800">
                    <motion.div
                      className="h-full rounded-md"
                      style={{ background: c.day.colors.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-300 text-right">
                    {c.total > 0 ? c.total : "—"}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Bar chart */}
      {!isZero && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-zinc-400">Direct Burn + EPOC</CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px] gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Direct
                </Badge>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500/30 inline-block" />EPOC
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="Direct" stackId="a" radius={[0,0,3,3]} fill="#1D9E75" />
                  <Bar dataKey="EPOC"   stackId="a" radius={[3,3,0,0]} fill="rgba(29,158,117,0.35)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tip */}
      {!isZero && (
        <div className="flex gap-2 rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-3">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-zinc-400 leading-relaxed">
            At <strong className="text-zinc-200">{weight} kg</strong>, you burn approx{" "}
            <strong className="text-zinc-200">{totalCal.toLocaleString()} kcal/week</strong> from training —
            ≈ {fatLoss}g of fat weekly from exercise alone.
            Maintenance ≈ <strong className="text-zinc-200">{calcMaintenanceCalories(weight)} kcal/day</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
