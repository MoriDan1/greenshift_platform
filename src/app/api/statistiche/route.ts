import { NextResponse } from "next/server";
import { fetchOverview, fetchMonthly, fetchCostBreakdown } from "@/lib/api";

export async function GET() {
  const [overview, monthly, costBreakdown] = await Promise.all([fetchOverview(), fetchMonthly(), fetchCostBreakdown()]);
  return NextResponse.json({ overview, monthly, costBreakdown });
}