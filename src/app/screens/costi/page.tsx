"use client";

import { useEffect, useState } from "react";
import { Fuel, TrendingUp, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../../../components/kpiCard";
import { fetchOverview, fetchCostBreakdown, fetchGamificationROI, fmtEUR, vehicleTypeLabel } from "../../../lib/api";

type Overview = Awaited<ReturnType<typeof fetchOverview>>;
type CostBreakdown = Awaited<ReturnType<typeof fetchCostBreakdown>>;

const TYPE_COLORS: Record<string, string> = {
  EV: "#22C55E",
  Hybrid: "#0EA5A4",
  Diesel: "#EAB308",
  Petrol: "#F97316",
  LPG: "#64748B",
};

export default function Costs() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [breakdown, setBreakdown] = useState<CostBreakdown>([]);
  const [roi, setRoi] = useState<Awaited<ReturnType<typeof fetchGamificationROI>> | null>(null);

  useEffect(() => {
    fetchOverview().then(setOverview).catch(() => {});
    fetchCostBreakdown().then(setBreakdown).catch(() => {});
    fetchGamificationROI().then(setRoi).catch(() => {});
  }, []);

  const fuelTotal = breakdown.reduce((sum, item) => sum + (item.fuel || 0), 0);
  const maintTotal = breakdown.reduce((sum, item) => sum + (item.maintenance || 0), 0);
  const pieData = breakdown.map((item) => ({ name: item.type, value: (item.fuel || 0) + (item.maintenance || 0) }));

  return (
    <div className="space-y-8" data-testid="costs-page">
      <div>
        <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Economico</div>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Costi flotta</h1>
        <p className="text-slate-600 mt-2 text-sm">Analisi dei costi operativi: carburante, manutenzione, ripartizione per tipologia.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Costo totale anno in corso" value={overview ? fmtEUR(overview.total_cost_ytd) : "—"} icon={Wallet} accent="brand" testid="cost-total" />
        <KpiCard label="Carburante" value={overview ? fmtEUR(overview.fuel_cost_ytd) : "—"} icon={Fuel} accent="amber" testid="cost-fuel" />
        <KpiCard
          label="Risparmio Eco Point"
          value={roi ? (roi.net_roi_eur >= 0 ? `+${fmtEUR(roi.net_roi_eur)}` : fmtEUR(roi.net_roi_eur)) : "—"}
          icon={TrendingUp}
          accent="emerald"
          testid="cost-roi"
          hint={roi ? `Risparmio: ${fmtEUR(roi.saved_fuel_eur + roi.saved_wear_eur)} • Premi: ${fmtEUR(roi.rewards_cost_eur)}` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-cost-by-type">
          <h3 className="font-display text-lg font-bold text-slate-900">Costi per tipologia veicolo</h3>
          <p className="text-sm text-slate-500 mt-1">Carburante e manutenzione, ripartiti per tipo.</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="type" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `€${(Number(value) / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(value) => fmtEUR(Number(value))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="fuel" stackId="a" fill="#EAB308" name="Carburante" />
                <Bar dataKey="maintenance" stackId="a" fill="#1A4D2E" radius={[6, 6, 0, 0]} name="Manutenzione" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-cost-donut">
          <h3 className="font-display text-lg font-bold text-slate-900">Ripartizione costi</h3>
          <p className="text-sm text-slate-500 mt-1">Quota dei costi per tipologia.</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((item) => (
                    <Cell key={item.name} fill={TYPE_COLORS[item.name] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(value) => fmtEUR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TYPE_COLORS[item.name] || "#94A3B8" }} />
                  <span className="text-slate-600">{vehicleTypeLabel(item.name as Parameters<typeof vehicleTypeLabel>[0])}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900">{fmtEUR(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-display text-lg font-bold text-slate-900">Dettaglio per tipologia</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tipo</th>
              <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Carburante</th>
              <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Rispario Eco Point</th>
              <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Totale</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item) => (
              <tr key={item.type} className="border-t border-slate-100">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[item.type] || "#94A3B8" }} />
                    <span className="font-medium">{vehicleTypeLabel(item.type as Parameters<typeof vehicleTypeLabel>[0])}</span>
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-mono">{fmtEUR(item.fuel)}</td>
                <td className="px-6 py-3 text-right font-mono">{fmtEUR(item.maintenance)}</td>
                <td className="px-6 py-3 text-right font-mono font-bold text-slate-900">{fmtEUR((item.fuel || 0) - (item.maintenance || 0))}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="px-6 py-3 font-bold">Totale</td>
              <td className="px-6 py-3 text-right font-mono font-bold">{fmtEUR(fuelTotal)}</td>
              <td className="px-6 py-3 text-right font-mono font-bold">{fmtEUR(maintTotal)}</td>
              <td className="px-6 py-3 text-right font-mono font-bold text-[#1A4D2E]">{fmtEUR(fuelTotal - maintTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
