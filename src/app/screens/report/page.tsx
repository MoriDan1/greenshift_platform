"use client";

import { useEffect, useRef, useState } from "react";
import { CarFront, ChevronRight, Download, FileSpreadsheet, FileText, Leaf, Upload, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { fetchESGReport, fmtEUR, fmtNumber, vehicleTypeLabel } from "../../../lib/api";

const COVER_BG =
  "https://images.unsplash.com/photo-1618898613684-2cf0ae9a7c19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyZWVuJTIwZWNvJTIwbmF0dXJlJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3Nzk2MTE4MDJ8MA&ixlib=rb-4.1.0&q=85";

type ReportData = Awaited<ReturnType<typeof fetchESGReport>>;

type CarModelOption = {
  brand: string;
  model: string;
  logoSrc: string;
  color: string;
};

function VehicleLogo({ model, compact = false }: { model: CarModelOption; compact?: boolean }) {
  const sizeClass = compact ? "w-9 h-9" : "w-12 h-12";
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${sizeClass} rounded-xl overflow-hidden`} aria-label={`${model.brand} logo`} role="img">
        <svg viewBox="0 0 96 96" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="84" height="84" rx="22" fill={model.color} />
          <text x="48" y="54" textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="Arial, sans-serif">
            {model.brand.slice(0, 1)}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-xl overflow-hidden`} aria-label={`${model.brand} logo`} role="img">
      <img
        src={model.logoSrc}
        alt={`${model.brand} logo`}
        className="w-full h-full object-contain bg-white p-2"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

const CAR_MODELS: CarModelOption[] = [
  { brand: "Tesla", model: "Model 3", logoSrc: "/assets/telsa.png", color: "#E82127" },
  { brand: "Toyota", model: "Corolla Hybrid", logoSrc: "/assets/toyota.png", color: "#EB0A1E" },
  { brand: "Fiat", model: "Ducato", logoSrc: "/assets/fiat.png", color: "#1B1B1B" },
  { brand: "Volkswagen", model: "Golf", logoSrc: "/assets/volk.png", color: "#0C3A75" },
  { brand: "Renault", model: "Kangoo", logoSrc: "/assets/renault.png", color: "#FFCC00" },
  { brand: "Nissan", model: "Leaf", logoSrc: "/assets/nissan.png", color: "#C3002F" },
];

export default function ESGReport() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [data, setData] = useState<ReportData | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedCarModel, setSelectedCarModel] = useState<CarModelOption | null>(null);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchESGReport(Number(year)).then(setData).catch(() => {});
  }, [year]);

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const handleImportModel = () => {
    setIsModelPickerOpen(true);
  };

  const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    event.target.value = "";
  };

  const handleModelSelect = (model: CarModelOption) => {
    setSelectedCarModel(model);
    setIsModelPickerOpen(false);
  };

  const handleDownloadPDF = () => {
    // Apri la route API che serve il PDF dal filesystem `data/report.pdf`
    window.open("/api/report-pdf", "_blank");
  };

  return (
    <div className="space-y-6" data-testid="ESG-report-page">
      <div className="print:hidden flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">
            Rendicontazione sostenibilità e governo societario
          </div>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Bilancio di sostenibilità annuale</h1>
          <p className="text-slate-600 mt-2 text-sm max-w-2xl">
            Documento ufficiale per la rendicontazione della sostenibilità della flotta aziendale. Stampabile o esportabile come PDF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">
            <span className="sr-only">Anno del bilancio</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
              data-testid="ESG-year-select"
            >
              {[currentYear, currentYear - 1, currentYear - 2].map((item) => (
                <option key={item} value={String(item)}>{item}</option>
              ))}
            </select>
          </label>
          <Button onClick={handleDownloadPDF} variant="outline" data-testid="ESG-download-btn">
            <Download className="w-4 h-4 mr-2" /> Scarica PDF
          </Button>
          <Button onClick={handleImportExcel} className="bg-[#1A4D2E] text-white hover:bg-[#133922]" data-testid="ESG-import-excel-btn">
            <Upload className="w-4 h-4 mr-2" /> Importa file Excel
          </Button>
          <Button onClick={handleImportModel} variant="outline" data-testid="ESG-import-model-btn">
            <CarFront className="w-4 h-4 mr-2" /> Importa modello
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={handleExcelChange}
      />

      {selectedFileName ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          File selezionato: <strong>{selectedFileName}</strong>
        </div>
      ) : null}

      {selectedCarModel ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-sky-200 bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <VehicleLogo model={selectedCarModel} compact />
          </div>
          <div>
            <div className="font-medium">Modello importato</div>
            <div className="flex items-center gap-2">
              <strong>{selectedCarModel.brand} {selectedCarModel.model}</strong>
            </div>
          </div>
        </div>
      ) : null}

      {isModelPickerOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm px-4 py-6 flex items-center justify-center">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#1A4D2E]">Importa modello</div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Scegli un modello di auto</h2>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
                onClick={() => setIsModelPickerOpen(false)}
              >
                Chiudi
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-slate-50">
              {CAR_MODELS.map((model) => (
                <button
                  key={`${model.brand}-${model.model}`}
                  type="button"
                  onClick={() => handleModelSelect(model)}
                  className="group text-left rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <VehicleLogo model={model} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{model.brand}</div>
                      <div className="font-semibold text-slate-900 truncate">{model.model}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: model.color }} />
                        Clicca per importare  
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500 group-hover:text-slate-700">
                    <span>Importa questo modello</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div id="ESG-print-area" className="bg-white border border-slate-200 rounded-lg p-8 sm:p-12 print-page max-w-[210mm] mx-auto shadow-sm">
        <div
          className="relative overflow-hidden rounded-xl text-white p-10 sm:p-12 mb-12"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26,77,46,0.92), rgba(79,111,82,0.85)), url(${COVER_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-white/20 backdrop-blur flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium uppercase tracking-widest opacity-90">GreenShift</div>
          </div>
          <div className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">Bilancio di sostenibilità</div>
          <div className="font-display text-3xl font-bold mt-2 opacity-95">Anno {data?.year || year}</div>
          <p className="text-sm opacity-90 mt-6 max-w-md leading-relaxed">
            Rendicontazione annuale dei dati ambientali, sociali ed economici della flotta aziendale.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold tracking-wider uppercase">
            <FileText className="w-3.5 h-3.5" /> Documento ufficiale
          </div>
        </div>

        <section className="mb-10">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Sezione 1</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Sintesi esecutiva</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            Il presente report rendiconta le performance ambientali ed economiche della flotta di <strong>{data?.company || "GreenShift Mobility S.p.A."}</strong> per l'anno {data?.year}. Sono inclusi i dati relativi a emissioni di CO₂, consumi energetici, costi operativi e composizione del parco veicoli, con focus sulla quota di mezzi a basso impatto ambientale.
          </p>
        </section>

        <section className="mb-10">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Sezione 2</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Indicatori chiave</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiBox label="Veicoli in flotta" value={fmtNumber(data?.fleet_size)} />
            <KpiBox label="CO₂ totale" value={fmtNumber(data?.total_co2_tons, 1)} unit="t" />
            <KpiBox label="Km percorsi" value={fmtNumber(data?.total_km)} />
            <KpiBox label="Costo operativo" value={fmtEUR(data?.total_cost_eur)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <KpiBox label="Veicoli elettrici" value={fmtNumber(data?.ev_count)} accent />
            <KpiBox label="Veicoli ibridi" value={fmtNumber(data?.hybrid_count)} accent />
            <KpiBox label="Quota a basse emissioni" value={`${fmtNumber(data?.low_emission_share_pct, 1)}%`} accent />
            <KpiBox label="CO₂ / km" value={fmtNumber(data?.co2_per_km, 3)} unit="kg" />
          </div>
        </section>

        <section className="mb-10">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Sezione 3</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Confronto anno precedente</h2>
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <div className="flex items-center gap-4">
              {data?.delta_co2_vs_prev_year_pct !== undefined && data.delta_co2_vs_prev_year_pct < 0 ? (
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-emerald-700" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-700" />
                </div>
              )}
              <div>
                <div className="font-display text-3xl font-bold text-slate-900">
                  {(data?.delta_co2_vs_prev_year_pct ?? 0) > 0 ? "+" : ""}
                  {fmtNumber(data?.delta_co2_vs_prev_year_pct, 1)}%
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Variazione CO₂ rispetto all'anno {(data?.year || currentYear) - 1}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Sezione 4</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Composizione della flotta</h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Tipologia</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Veicoli</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Quota</th>
              </tr>
            </thead>
            <tbody>
              {data?.composition?.map((item: { type: string; count: number }) => (
                <tr key={item.type} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{vehicleTypeLabel(item.type as Parameters<typeof vehicleTypeLabel>[0])}</td>
                  <td className="px-4 py-3 text-right font-mono">{item.count}</td>
                  <td className="px-4 py-3 text-right font-mono">{((item.count / Math.max(data?.fleet_size, 1)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-6">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-widest mb-2">Sezione 5</div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Metodologia</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            I dati di consumo sono raccolti dai sistemi di telematica installati sui veicoli. Le emissioni CO₂ sono calcolate sulla base del fattore di emissione dichiarato dal costruttore (g CO₂/km) moltiplicato per i chilometri percorsi. I costi includono carburante/energia elettrica e manutenzione ordinaria. La metodologia segue le linee guida GHG Protocol Scope 1 per le flotte aziendali.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
          <div>
            <strong className="text-slate-700">{data?.company}</strong> — Documento riservato
          </div>
          <div className="font-mono">Generato: {data?.generated_at ? new Date(data.generated_at).toLocaleDateString("it-IT") : "—"}</div>
        </div>
      </div>
    </div>
  );
}

function KpiBox({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 ${accent ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="font-display text-2xl font-bold text-slate-900">{value || "—"}</div>
        {unit ? <div className="text-sm font-medium text-slate-500">{unit}</div> : null}
      </div>
    </div>
  );
}
