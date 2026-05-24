import { NextResponse } from "next/server";
import { fetchOverview, fetchVehicles, fetchMonthly } from "@/lib/api";

export async function GET() {
  const [overview, vehicles, monthly] = await Promise.all([fetchOverview(), fetchVehicles(), fetchMonthly()]);
  return NextResponse.json({ overview, vehicles, monthly });
}