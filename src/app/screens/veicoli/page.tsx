"use client";

import { useEffect, useState } from "react";
import { Car as CarIcon, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { createVehicle, deleteVehicle, fetchVehicles, fmtEUR, fmtNumber, typeBadgeClasses, VEHICLE_TYPES, vehicleTypeLabel } from "../../../lib/api";

type VehicleForm = {
  plate: string;
  model: string;
  brand: string;
  type: (typeof VEHICLE_TYPES)[number];
  year: number;
  km_total: number;
  avg_consumption: number;
  co2_per_km: number;
  fuel_cost_ytd: number;
  maintenance_cost_ytd: number;
  efficiency_score: number;
};

const emptyVehicle: VehicleForm = {
  plate: "",
  model: "",
  brand: "",
  type: "EV",
  year: new Date().getFullYear(),
  km_total: 0,
  avg_consumption: 0,
  co2_per_km: 0,
  fuel_cost_ytd: 0,
  maintenance_cost_ytd: 0,
  efficiency_score: 75,
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<VehicleForm>({ ...emptyVehicle });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = () => fetchVehicles().then(setVehicles).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const onChange = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createVehicle({
        ...form,
        year: Number(form.year),
        km_total: Number(form.km_total),
        avg_consumption: Number(form.avg_consumption),
        co2_per_km: Number(form.co2_per_km),
        fuel_cost_ytd: Number(form.fuel_cost_ytd),
        maintenance_cost_ytd: Number(form.maintenance_cost_ytd),
        efficiency_score: Number(form.efficiency_score),
      });
      toast.success("Veicolo aggiunto alla flotta");
      setForm({ ...emptyVehicle });
      setOpen(false);
      load();
    } catch {
      toast.error("Errore durante la creazione del veicolo");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteVehicle(id);
      toast.success("Veicolo rimosso");
      load();
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

  const filtered = vehicles.filter((vehicle) => {
    if (filter !== "all" && vehicle.type !== filter) return false;
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      vehicle.plate.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6" data-testid="vehicles-page">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Gestione asset</div>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Veicoli</h1>
          <p className="text-slate-600 mt-2 text-sm">Gestione completa della flotta: caratteristiche, consumi e costi per veicolo.</p>
        </div>
        <Button data-testid="open-add-vehicle" className="bg-[#1A4D2E] text-white hover:bg-[#133922]" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi veicolo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cerca per targa, modello o marca…"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            data-testid="search-input"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-10 sm:w-56 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
          data-testid="filter-type"
        >
          <option value="all">Tutti i tipi</option>
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {vehicleTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-display text-2xl font-bold text-slate-900">Nuovo veicolo</h2>
              <button type="button" className="text-sm text-slate-500 hover:text-slate-900" onClick={() => setOpen(false)}>
                Chiudi
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">Targa</Label>
                <Input id="plate" data-testid="form-plate" value={form.plate} onChange={(event) => onChange("plate", event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="type">Tipologia</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(event) => onChange("type", event.target.value as VehicleForm["type"])}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  data-testid="form-type"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {vehicleTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" data-testid="form-brand" value={form.brand} onChange={(event) => onChange("brand", event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="model">Modello</Label>
                <Input id="model" data-testid="form-model" value={form.model} onChange={(event) => onChange("model", event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="year">Anno</Label>
                <Input id="year" data-testid="form-year" type="number" value={form.year} onChange={(event) => onChange("year", Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="km_total">Km totali</Label>
                <Input id="km_total" data-testid="form-km" type="number" value={form.km_total} onChange={(event) => onChange("km_total", Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="avg_consumption">Consumo medio (L o kWh ogni 100 km)</Label>
                <Input id="avg_consumption" data-testid="form-cons" type="number" step="0.1" value={form.avg_consumption} onChange={(event) => onChange("avg_consumption", Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="co2_per_km">CO₂ (g/km)</Label>
                <Input id="co2_per_km" data-testid="form-co2" type="number" step="0.1" value={form.co2_per_km} onChange={(event) => onChange("co2_per_km", Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="fuel_cost_ytd">Costo carburante anno in corso (€)</Label>
                <Input id="fuel_cost_ytd" data-testid="form-fuelcost" type="number" step="0.01" value={form.fuel_cost_ytd} onChange={(event) => onChange("fuel_cost_ytd", Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="efficiency_score">Punteggio efficienza (0-100)</Label>
                <Input id="efficiency_score" data-testid="form-eff" type="number" min="0" max="100" value={form.efficiency_score} onChange={(event) => onChange("efficiency_score", Number(event.target.value))} />
              </div>
              <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="form-cancel">
                  Annulla
                </Button>
                <Button type="submit" className="bg-[#1A4D2E] text-white hover:bg-[#133922]" data-testid="form-submit">
                  Salva veicolo
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Targa</TableHead>
              <TableHead>Veicolo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Km</TableHead>
              <TableHead className="text-right">Consumo</TableHead>
              <TableHead className="text-right">CO₂ g/km</TableHead>
              <TableHead className="text-right">Carburante anno in corso</TableHead>
              <TableHead className="text-right">Efficienza</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12">
                  <CarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Nessun veicolo trovato</p>
                </TableCell>
              </TableRow>
            ) : null}

            {filtered.map((vehicle) => (
              <TableRow key={vehicle.id} data-testid={`vehicle-row-${vehicle.plate}`}>
                <TableCell className="font-mono text-xs font-semibold">{vehicle.plate}</TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">
                    {vehicle.brand} {vehicle.model}
                  </div>
                  <div className="text-xs text-slate-500">{vehicle.year}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${typeBadgeClasses(vehicle.type)}`}>
                    {vehicleTypeLabel(vehicle.type)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{fmtNumber(vehicle.km_total)}</TableCell>
                <TableCell className="text-right font-mono text-sm">{fmtNumber(vehicle.avg_consumption, 1)}</TableCell>
                <TableCell className="text-right font-mono text-sm">{fmtNumber(vehicle.co2_per_km, 0)}</TableCell>
                <TableCell className="text-right font-mono text-sm">{fmtEUR(vehicle.fuel_cost_ytd)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A4D2E]" style={{ width: `${Math.min(100, vehicle.efficiency_score)}%` }} />
                    </div>
                    <span className="font-mono text-xs font-semibold">{Math.round(vehicle.efficiency_score)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(vehicle.id)}
                    data-testid={`delete-${vehicle.plate}`}
                    className="text-slate-400 hover:text-rose-600 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
