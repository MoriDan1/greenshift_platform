export type VehicleType = "EV" | "Hybrid" | "Diesel" | "Petrol" | "LPG";

export type Vehicle = {
  id: number;
  plate: string;
  model: string;
  brand: string;
  type: VehicleType;
  year: number;
  km_total: number;
  avg_consumption: number;
  co2_per_km: number;
  fuel_cost_ytd: number;
  maintenance_cost_ytd: number;
  efficiency_score: number;
};

export type MonthlyMetric = {
  month: string;
  co2_kg: number;
  cost: number;
  km: number;
  liters: number;
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  EV: "Elettrico",
  Hybrid: "Ibrido",
  Diesel: "Diesel",
  Petrol: "Benzina",
  LPG: "GPL",
};

const baseVehicles: Vehicle[] = [
  { id: 1, plate: "AA-111AA", brand: "Tesla", model: "Model 3", type: "EV", year: 2023, km_total: 32400, avg_consumption: 14.8, co2_per_km: 0, fuel_cost_ytd: 1820, maintenance_cost_ytd: 342, efficiency_score: 96 },
  { id: 2, plate: "BB-222BB", brand: "Toyota", model: "Corolla Hybrid", type: "Hybrid", year: 2022, km_total: 41200, avg_consumption: 4.7, co2_per_km: 68, fuel_cost_ytd: 2510, maintenance_cost_ytd: 199, efficiency_score: 88 },
  { id: 3, plate: "CC-333CC", brand: "Fiat", model: "Ducato", type: "Diesel", year: 2021, km_total: 58700, avg_consumption: 7.9, co2_per_km: 142, fuel_cost_ytd: 5480, maintenance_cost_ytd: 130, efficiency_score: 71 },
  { id: 4, plate: "DD-444DD", brand: "Volkswagen", model: "Golf", type: "Petrol", year: 2020, km_total: 29800, avg_consumption: 6.4, co2_per_km: 132, fuel_cost_ytd: 3220, maintenance_cost_ytd: 400, efficiency_score: 67 },
  { id: 5, plate: "EE-555EE", brand: "Renault", model: "Kangoo", type: "LPG", year: 2024, km_total: 19300, avg_consumption: 8.9, co2_per_km: 101, fuel_cost_ytd: 1960, maintenance_cost_ytd: 389, efficiency_score: 79 },
  { id: 6, plate: "FF-123FF", brand: "Nissan", model: "Leaf", type: "EV", year: 2023, km_total: 22100, avg_consumption: 15.2, co2_per_km: 0, fuel_cost_ytd: 1360, maintenance_cost_ytd: 299, efficiency_score: 94 },
];

const monthlyTemplate: MonthlyMetric[] = [
  { month: "Gen", co2_kg: 1280, cost: 6100, km: 4200, liters: 860 },
  { month: "Feb", co2_kg: 1220, cost: 5780, km: 3980, liters: 820 },
  { month: "Mar", co2_kg: 1180, cost: 5630, km: 4100, liters: 805 },
  { month: "Apr", co2_kg: 1120, cost: 5480, km: 3950, liters: 790 },
  { month: "Mag", co2_kg: 1080, cost: 5390, km: 3880, liters: 770 },
  { month: "Giu", co2_kg: 1040, cost: 5240, km: 3760, liters: 742 },
  { month: "Lug", co2_kg: 1110, cost: 5410, km: 3910, liters: 781 },
  { month: "Ago", co2_kg: 1070, cost: 5340, km: 3850, liters: 768 },
  { month: "Set", co2_kg: 1010, cost: 5180, km: 3720, liters: 735 },
  { month: "Ott", co2_kg: 990, cost: 5120, km: 3680, liters: 720 },
  { month: "Nov", co2_kg: 1060, cost: 5290, km: 3810, liters: 754 },
  { month: "Dic", co2_kg: 980, cost: 5050, km: 3650, liters: 710 },
];

let vehicles: Vehicle[] = [...baseVehicles];

export const VEHICLE_TYPES: VehicleType[] = ["EV", "Hybrid", "Diesel", "Petrol", "LPG"];

export function fmtNumber(value: number | null | undefined, fractionDigits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(value);
}

export function fmtEUR(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "€ 0";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function typeBadgeClasses(type: VehicleType) {
  const map: Record<VehicleType, string> = {
    EV: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Hybrid: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Diesel: "bg-amber-50 text-amber-700 border-amber-200",
    Petrol: "bg-orange-50 text-orange-700 border-orange-200",
    LPG: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return map[type];
}

export function vehicleTypeLabel(type: VehicleType) {
  return VEHICLE_TYPE_LABELS[type];
}

function cloneVehicles() {
  return vehicles.map((vehicle) => ({ ...vehicle }));
}

function computeMonthly() {
  return monthlyTemplate.map((entry) => ({ ...entry }));
}

function computeOverview() {
  const monthly = computeMonthly();
  const totalKm = vehicles.reduce((sum, vehicle) => sum + vehicle.km_total, 0);
  const fuelCost = vehicles.reduce((sum, vehicle) => sum + vehicle.fuel_cost_ytd, 0);
  const maintenanceCost = vehicles.reduce((sum, vehicle) => sum + vehicle.maintenance_cost_ytd, 0);
  const co2Kg = monthly.reduce((sum, entry) => sum + entry.co2_kg, 0);
  const liters = monthly.reduce((sum, entry) => sum + entry.liters, 0);
  const avgEfficiency = vehicles.reduce((sum, vehicle) => sum + vehicle.efficiency_score, 0) / Math.max(vehicles.length, 1);
  const avgCo2PerKm = vehicles.reduce((sum, vehicle) => sum + vehicle.co2_per_km, 0) / Math.max(vehicles.length, 1);

  return {
    total_vehicles: vehicles.length,
    total_km: totalKm,
    liters_total: liters,
    fuel_cost_ytd: fuelCost,
    maintenance_cost_ytd: maintenanceCost,
    total_cost_ytd: fuelCost + maintenanceCost,
    co2_total_kg: co2Kg,
    co2_total_tons: co2Kg / 1000,
    avg_efficiency: avgEfficiency,
    avg_co2_per_km: avgCo2PerKm,
    composition: VEHICLE_TYPES.map((type) => ({ type, count: vehicles.filter((vehicle) => vehicle.type === type).length })),
  };
}

function computeCostBreakdown() {
  return VEHICLE_TYPES.map((type) => {
    const fleet = vehicles.filter((vehicle) => vehicle.type === type);
    return {
      type,
      fuel: fleet.reduce((sum, vehicle) => sum + vehicle.fuel_cost_ytd, 0),
      maintenance: fleet.reduce((sum, vehicle) => sum + vehicle.maintenance_cost_ytd, 0),
    };
  }).filter((entry) => entry.fuel > 0 || entry.maintenance > 0);
}

export async function fetchVehicles() {
  return cloneVehicles();
}

export async function createVehicle(vehicle: Omit<Vehicle, "id">) {
  const nextId = vehicles.reduce((max, current) => Math.max(max, current.id), 0) + 1;
  vehicles = [...vehicles, { ...vehicle, id: nextId }];
  return { ...vehicle, id: nextId };
}

export async function deleteVehicle(id: number) {
  vehicles = vehicles.filter((vehicle) => vehicle.id !== id);
}

export async function fetchOverview() {
  return computeOverview();
}

export async function fetchMonthly() {
  return computeMonthly();
}

export type GamificationROI = {
  saved_fuel_eur: number;
  saved_wear_eur: number;
  rewards_cost_eur: number;
  net_roi_eur: number;
};

// Mock calculation for ROI Gamification (Risparmio Netto)
export async function fetchGamificationROI(): Promise<GamificationROI> {
  const monthly = computeMonthly();
  if (monthly.length < 2) {
    return { saved_fuel_eur: 0, saved_wear_eur: 0, rewards_cost_eur: 0, net_roi_eur: 0 };
  }

  const prev = monthly[monthly.length - 2];
  const curr = monthly[monthly.length - 1];

  // Stimiamo il risparmio carburante usando i litri risparmiati e un prezzo medio €/l
  const AVG_FUEL_EUR_PER_L = 1.7;
  const litersDiff = Math.max(0, prev.liters - curr.liters);
  const savedFuel = litersDiff * AVG_FUEL_EUR_PER_L;

  // Stimiamo l'usura (wear) come la parte rimanente della riduzione di costo
  const totalCostDiff = Math.max(0, prev.cost - curr.cost);
  const savedWear = Math.max(0, totalCostDiff - savedFuel);

  // Mock: costo premi distribuiti nel mese (Eco Coins / buoni)
  const rewardsCost = 1200; // valore di esempio, può essere parametrizzato

  const net = savedFuel + savedWear - rewardsCost;

  return {
    saved_fuel_eur: Math.round(savedFuel),
    saved_wear_eur: Math.round(savedWear),
    rewards_cost_eur: Math.round(rewardsCost),
    net_roi_eur: Math.round(net),
  };
}

export async function fetchCostBreakdown() {
  return computeCostBreakdown();
}

export async function fetchESGReport(year: number) {
  const overview = computeOverview();
  const breakdown = computeCostBreakdown();
  const lowEmission = overview.composition.find((entry) => entry.type === "EV")?.count ?? 0;
  const hybrid = overview.composition.find((entry) => entry.type === "Hybrid")?.count ?? 0;
  const fleetSize = Math.max(overview.total_vehicles, 1);

  return {
    year,
    company: "GreenShift Mobility S.p.A.",
    generated_at: new Date().toISOString(),
    fleet_size: overview.total_vehicles,
    total_co2_tons: overview.co2_total_tons,
    total_cost_eur: overview.total_cost_ytd,
    total_km: overview.total_km,
    ev_count: lowEmission,
    hybrid_count: hybrid,
    low_emission_share_pct: ((lowEmission + hybrid) / fleetSize) * 100,
    co2_per_km: overview.avg_co2_per_km / 1000,
    delta_co2_vs_prev_year_pct: -8.7,
    composition: overview.composition,
    cost_breakdown: breakdown,
  };
}