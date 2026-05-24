"use client";

import { useEffect, useState } from "react";
import { Activity, Fuel, Leaf, Route } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, ReferenceLine } from "recharts";
import { KpiCard } from "../../../components/kpiCard";
import { fetchOverview, fetchMonthly, fmtNumber } from "../../../lib/api";

type Overview = Awaited<ReturnType<typeof fetchOverview>>;
type MonthlyMetric = Awaited<ReturnType<typeof fetchMonthly>>;

export default function Statistics() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthly, setMonthly] = useState<MonthlyMetric>([]);

  useEffect(() => {
    fetchOverview().then(setOverview).catch(() => {});
    fetchMonthly().then(setMonthly).catch(() => {});
  }, []);

  return (
    <div className="space-y-8" data-testid="stats-page">
      <div>
        <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Approfondimenti e trend</div>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Statistiche</h1>
        <p className="text-slate-600 mt-2 text-sm">Analisi delle metriche operative e ambientali della flotta.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Totale carburante"
          value={overview ? fmtNumber(overview.liters_total, 0) : "—"}
          unit="L/kWh"
          icon={Fuel}
          accent="amber"
          testid="stat-liters"
        />
        <KpiCard
          label="Km totali"
          value={overview ? fmtNumber(overview.total_km, 0) : "—"}
          unit="km"
          icon={Route}
          accent="brand"
          testid="stat-km"
        />
        <KpiCard
          label="CO₂ emessa"
          value={overview ? fmtNumber(overview.co2_total_tons, 1) : "—"}
          unit="t"
          icon={Leaf}
          accent="emerald"
          testid="stat-co2"
        />
        <KpiCard
          label="Efficienza"
          value={overview ? fmtNumber(overview.avg_efficiency, 1) : "—"}
          unit="/100"
          icon={Activity}
          accent="brand"
          testid="stat-eff"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-emissions-trend">
        <h3 className="font-display text-lg font-bold text-slate-900">Trend emissioni e consumi</h3>
        <p className="text-sm text-slate-500 mt-1">Andamento mensile di CO₂, litri e chilometri.</p>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="co2_kg" stroke="#1A4D2E" strokeWidth={2.5} dot={false} name="CO₂ (kg)" />
              <Line type="monotone" dataKey="liters" stroke="#EAB308" strokeWidth={2.5} dot={false} name="Litri" />
              <Line type="monotone" dataKey="km" stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Km" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-km-month">
          <h3 className="font-display text-lg font-bold text-slate-900">Chilometri mensili</h3>
          <p className="text-sm text-slate-500 mt-1">Volume operativo della flotta.</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="km" fill="#4F6F52" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="chart-co2-month">
          <h3 className="font-display text-lg font-bold text-slate-900">CO₂ mensile vs obiettivo</h3>
          <p className="text-sm text-slate-500 mt-1">Verifica conformità all'obiettivo di riduzione.</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <ReferenceLine y={1200} stroke="#EAB308" strokeDasharray="4 4" label={{ value: "Obiettivo", fontSize: 10, fill: "#854D0E" }} />
                <Bar dataKey="co2_kg" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
