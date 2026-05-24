import type { ComponentType } from "react";

type KpiCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  accent?: "brand" | "emerald" | "amber" | "rose" | "slate";
  testid?: string;
  delta?: number;
};

export function KpiCard({ label, value, unit, hint, icon: Icon, accent = "brand", testid, delta }: KpiCardProps) {
  const accentClasses = {
    brand: "text-brand bg-brand-soft",
    emerald: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    rose: "text-rose-700 bg-rose-50",
    slate: "text-slate-700 bg-slate-100",
  };

  return (
    <div data-testid={testid} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition-shadow animate-fade-up">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        {Icon ? (
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accentClasses[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="font-display text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        {unit ? <div className="text-sm font-medium text-slate-500">{unit}</div> : null}
      </div>
      {(hint || delta !== undefined) ? (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta !== undefined ? (
            <span className={`font-mono font-semibold ${delta < 0 ? "text-emerald-600" : delta > 0 ? "text-rose-600" : "text-slate-500"}`}>
              {delta > 0 ? "+" : ""}{delta}%
            </span>
          ) : null}
          {hint ? <span className="text-slate-500">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}