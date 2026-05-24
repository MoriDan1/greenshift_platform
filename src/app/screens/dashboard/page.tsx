"use client";

import { useEffect, useState } from "react";
import { Car, Fuel, Gauge, Leaf, TrendingDown, Wallet } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { KpiCard } from "../../../components/kpiCard";
import { fetchOverview, fetchMonthly, fmtEUR, fmtNumber, vehicleTypeLabel } from "../../../lib/api";

const TYPE_COLORS: Record<string, string> = {
  EV: "#22C55E",
  Hybrid: "#0EA5A4",
  Diesel: "#EAB308",
  Petrol: "#F97316",
  LPG: "#64748B",
};

type Overview = Awaited<ReturnType<typeof fetchOverview>>;
type MonthlyMetric = Awaited<ReturnType<typeof fetchMonthly>>;

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyMetric>([]);

  useEffect(() => {
    fetchOverview().then(setOverview).catch(() => {});
    fetchMonthly().then(setMonthly).catch(() => {});
  }, []);

  const target = overview ? Math.max(50, (overview.co2_total_kg / Math.max(monthly.length || 1, 1)) * 0.7) : 100;

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">
            Sala di controllo · T{Math.floor(new Date().getMonth() / 3) + 1} {new Date().getFullYear()}
          </div>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Panoramica flotta</h1>
          <p className="text-slate-600 mt-2 text-sm max-w-2xl">
            Monitoraggio in tempo reale dei consumi, delle emissioni e dei costi operativi della flotta aziendale.
          </p>
        </div>
        {overview ? (
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Quota a basse emissioni</div>
            <div className="font-mono font-bold text-3xl text-[#1A4D2E]">
              {Math.round(
                (((overview.composition.find((item) => item.type === "EV")?.count || 0) +
                  (overview.composition.find((item) => item.type === "Hybrid")?.count || 0)) /
                  Math.max(overview.total_vehicles, 1)) *
                  100,
              )}%
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="kpi-grid">
        <KpiCard
          testid="kpi-vehicles"
          label="Veicoli totali"
          value={overview ? fmtNumber(overview.total_vehicles) : "—"}
          hint="Flotta attiva"
          icon={Car}
          accent="brand"
        />
        <KpiCard
          testid="kpi-co2"
          label="CO₂ totale anno in corso"
          value={overview ? fmtNumber(overview.co2_total_tons, 1) : "—"}
          unit="t"
          hint={`${overview ? fmtNumber(overview.avg_co2_per_km, 1) : "0"} g/km media`}
          icon={Leaf}
          accent="emerald"
        />
        <KpiCard
          testid="kpi-fuel"
          label="Costo carburante"
          value={overview ? fmtEUR(overview.fuel_cost_ytd) : "—"}
          hint={`${overview ? fmtNumber(overview.liters_total, 0) : "0"} L erogati`}
          icon={Fuel}
          accent="amber"
        />
        <KpiCard
          testid="kpi-eff"
          label="Efficienza media"
          value={overview ? fmtNumber(overview.avg_efficiency, 1) : "—"}
          unit="/100"
          hint={`${overview ? fmtNumber(overview.total_km, 0) : "0"} km percorsi`}
          icon={Gauge}
          accent="brand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-emissions">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Indicatore principale</div>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-1">Andamento emissioni CO₂</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingDown className="w-3.5 h-3.5" /> Obiettivo: -30% entro 2030
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A4D2E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1A4D2E" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} unit=" kg" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                  formatter={(value) => [`${fmtNumber(Number(value), 1)} kg`, "CO₂"]}
                />
                <ReferenceLine y={target} stroke="#EAB308" strokeDasharray="4 4" label={{ value: "Obiettivo", fill: "#854D0E", fontSize: 10, position: "insideTopLeft" }} />
                <Area type="monotone" dataKey="co2_kg" stroke="#1A4D2E" strokeWidth={2.5} fill="url(#co2grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-composition">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Composizione</div>
          <h3 className="font-display text-lg font-bold text-slate-900 mt-1">Tipologie flotta</h3>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview?.composition || []} dataKey="count" nameKey="type" innerRadius={48} outerRadius={80} paddingAngle={3}>
                  {(overview?.composition || []).map((item) => (
                    <Cell key={item.type} fill={TYPE_COLORS[item.type] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(overview?.composition || []).map((item) => (
              <div key={item.type} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TYPE_COLORS[item.type] || "#94A3B8" }} />
                  <span className="text-slate-600">{vehicleTypeLabel(item.type as Parameters<typeof vehicleTypeLabel>[0])}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-monthly-cost">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Andamento operativo</div>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-1">Costi mensili e chilometri</h3>
          </div>
          <Wallet className="w-5 h-5 text-slate-400" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                formatter={(value, name) => [name === "cost" ? fmtEUR(Number(value)) : `${fmtNumber(Number(value), 0)} km`, name === "cost" ? "Costo" : "Km"]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="cost" fill="#1A4D2E" radius={[4, 4, 0, 0]} name="Costo (€)" />
              <Bar dataKey="km" fill="#86C8A6" radius={[4, 4, 0, 0]} name="Km percorsi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
