"use client";
import { useEffect, useState, useCallback } from "react";
import { Weight, Save, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calcMaintenanceCalories } from "@/lib/calories";

interface WeightControlProps {
  weight: number;
  onChange: (w: number) => void;
}

export default function WeightControl({ weight, onChange }: WeightControlProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localWeight, setLocalWeight] = useState(weight);

  useEffect(() => { setLocalWeight(weight); }, [weight]);

  const handleSlider = (vals: number[]) => {
    setLocalWeight(vals[0]);
    onChange(vals[0]);
    setSaved(false);
  };

  const saveWeight = useCallback(async () => {
    if (localWeight === 0) return;
    setSaving(true);
    try {
      await fetch("/api/user-weight", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bodyWeightKg: localWeight }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }, [localWeight]);

  const maintenance = localWeight > 0 ? calcMaintenanceCalories(localWeight) : null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-zinc-300">وزنك</span>
        </div>
        <div className="flex items-center gap-2">
          {localWeight === 0 ? (
            <Badge variant="outline" className="text-zinc-500 border-zinc-700">
              غير محدد
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border">
              {localWeight} كجم
            </Badge>
          )}
        </div>
      </div>

      <Slider
        min={0}
        max={150}
        step={0.5}
        value={[localWeight]}
        onValueChange={handleSlider}
        className="mb-3"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>0</span>
          <span className="text-zinc-700">·</span>
          <span>150 كجم</span>
          {maintenance && (
            <>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400">
                Maintenance ≈ <strong className="text-zinc-300">{maintenance}</strong> kcal
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {localWeight > 0 && (
            <button
              onClick={() => { onChange(0); setLocalWeight(0); setSaved(false); }}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              reset
            </button>
          )}
          <button
            onClick={saveWeight}
            disabled={saving || localWeight === 0}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              saved
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
            )}
          >
            <Save className="w-3 h-3" />
            {saved ? "محفوظ ✓" : saving ? "جاري..." : "احفظ"}
          </button>
        </div>
      </div>
    </div>
  );
}
