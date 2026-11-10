import React from 'react';
import { CountryFiscalStats, DemographicBreakdown, MediaOutletRating } from '../types/game';
import { ArrowLeft, TrendingUp, TrendingDown, HelpCircle, Shield, Award } from 'lucide-react';

interface MetricDetailModalProps {
  type: 'approval' | 'debt' | 'gdp' | 'inflation' | 'unemployment' | 'media' | null;
  fiscal: CountryFiscalStats;
  demographics: DemographicBreakdown;
  mediaOutlets: MediaOutletRating[];
  overallApproval: number;
  onClose: () => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  type,
  fiscal,
  demographics,
  mediaOutlets,
  overallApproval,
  onClose,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#0c0f14] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl relative my-auto">
        {/* Tlačítko Zpět */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Zpět na přehled</span>
        </button>

        {/* 1. DETAIL PODPORY (APPROVAL) */}
        {type === 'approval' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                PŘEHLED SPOKOJENOSTI
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Celková podpora v USA</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono tracking-tight text-white">
                  {overallApproval}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-sm font-medium text-emerald-400 mt-1">Nadpoloviční většina občanů</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Podpora u americké veřejnosti — vyjadřuje celonárodní náladu voličů. Podpora uvnitř vaší strany a poslušnost v Kongresu se sledují zvlášť (Kancelář stranického biče).
              </p>
            </div>

            {/* Rozpad podle demografických skupin */}
            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                PODLE VOLIČSKÝCH SKUPIN
              </div>

              {[
                { label: 'Dělnická třída (Working Class)', value: demographics.workingClass },
                { label: 'Střední třída z předměstí (Suburban)', value: demographics.middleClass },
                { label: 'Podnikatelské kruhy a Wall Street', value: demographics.business },
                { label: 'Mladí voliči do 35 let', value: demographics.under35s },
                { label: 'Senioři a důchodci (Medicare)', value: demographics.pensioners },
                { label: 'Široká veřejnost', value: demographics.general },
                { label: 'Veřejný sektor a státní zaměstnanci', value: demographics.publicSector },
                { label: 'Etnické menšiny (Hispánci, Afroameričané)', value: demographics.ethnicMinority },
                { label: 'Venkov a vnitrozemí (Heartland)', value: demographics.rural },
                { label: 'Celková nálada médií', value: demographics.mediaMood },
              ].map((grp) => {
                const barColor =
                  grp.value >= 50
                    ? 'bg-emerald-400'
                    : grp.value >= 35
                    ? 'bg-amber-400'
                    : 'bg-rose-500';

                const textColor =
                  grp.value >= 50
                    ? 'text-emerald-400'
                    : grp.value >= 35
                    ? 'text-amber-400'
                    : 'text-rose-400';

                return (
                  <div key={grp.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{grp.label}</span>
                      <span className={`font-mono font-bold ${textColor}`}>{grp.value} %</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${barColor}`}
                        style={{ width: `${Math.min(100, grp.value)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DLUH / HDP */}
        {type === 'debt' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                FISKÁLNÍ PŘEHLED
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Federální dluh / HDP</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono tracking-tight text-white">
                  {fiscal.debtGdpPercent}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-sm font-medium text-amber-400 mt-1">Poměr federálního dluhu k HDP USA</div>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-3.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                STÁTNÍ POKLADNA USA (TREASURY)
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Veřejný federální dluh</span>
                <span className="font-mono text-white font-semibold">${fiscal.totalPublicDebtBillion.toLocaleString()} mld. USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Rating amerických vládních dluhopisů</span>
                <span className="font-mono text-emerald-400 font-semibold">{fiscal.bondRating} (Stabilní)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Primární deficit (před úroky)</span>
                <span className="font-mono text-rose-400 font-semibold">${fiscal.deficitBeforeInterestBillion} mld. USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Roční úroky z dluhu</span>
                <span className="font-mono text-rose-400 font-semibold">${fiscal.debtInterestBillion} mld. USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Celkové nové federální výpůjčky</span>
                <span className="font-mono text-rose-400 font-semibold">${fiscal.totalBorrowingBillion} mld. USD</span>
              </div>

              <p className="text-[11px] text-slate-400 italic py-1 leading-relaxed">
                Deficit se promítá do státního dluhu týden po týdnu. Každý 1 dolar nového schodku zvyšuje potřebu emise státních poukázek; přebytkový rozpočet dluh naopak umořuje.
              </p>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Celkové federální příjmy (IRS & cla)</span>
                <span className="font-mono text-emerald-400 font-semibold">${fiscal.totalRevenueBillion} mld. USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Celkové federální výdaje</span>
                <span className="font-mono text-slate-200 font-semibold">${fiscal.totalSpendingBillion} mld. USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Výnos 10letého dluhopisu USA (Treasury yield)</span>
                <span className="font-mono text-slate-200 font-semibold">{fiscal.tenYearGiltYield} %</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-300">Průměrná úroková sazba dluhu</span>
                <span className="font-mono text-slate-200 font-semibold">{fiscal.averageInterestOnDebt} %</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. RŮST HDP */}
        {type === 'gdp' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                EKONOMICKÝ PŘEHLED
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Růst HDP (GDP Growth)</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono tracking-tight text-white">
                  +{fiscal.gdpGrowthRate}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-sm font-medium text-amber-400 mt-1">Mírný růst americké ekonomiky</div>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-3.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                KLÍČOVÉ UKAZATELE USA
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">HDP na obyvatele (Per capita)</span>
                <span className="font-mono text-white font-semibold">${fiscal.gdpPerCapita.toLocaleString()} USD</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Mezikvartální tempo růstu HDP</span>
                <span className="font-mono text-amber-400 font-semibold">+{fiscal.gdpGrowthRate} %</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Index akciových trhů (S&P 500 / Dow Jones)</span>
                <span className="font-mono text-slate-200 font-semibold">{fiscal.stockMarketIndex.toLocaleString()} b.</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Důvěra amerických podniků</span>
                <span className="font-mono text-emerald-400 font-semibold">{fiscal.businessConfidence} / 100</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-300">Spotřebitelská důvěra domácností</span>
                <span className="font-mono text-emerald-400 font-semibold">{fiscal.consumerConfidence} / 100</span>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-2 leading-relaxed">
                Důvěra trhů a spotřebitelů přímo odráží zákony, daňovou politiku a vládní stabilitu. Růst nevzniká náhodou — vaše legislativa v Kongresu je hlavním motorem.
              </p>
            </div>
          </div>
        )}

        {/* 4. INFLACE (CPI) */}
        {type === 'inflation' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                MĚNOVÉ PODMÍNKY
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Míra inflace (CPI)</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono tracking-tight text-white">
                  {fiscal.inflationRate}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-sm font-medium text-emerald-400 mt-1">Blízko inflačního cíle Fedu (2,0 %)</div>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-3.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                MĚNOVÁ POLITIKA A FED
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Základní úroková sazba (Fed Funds Rate)</span>
                <span className="font-mono text-white font-semibold">3,50 %</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Meziroční index spotřebitelských cen</span>
                <span className="font-mono text-emerald-400 font-semibold">{fiscal.inflationRate} %</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Reálná úroková míra (Sazba mínus inflace)</span>
                <span className="font-mono text-slate-200 font-semibold">+1,3 %</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-300">Cena ropy na světových trzích (WTI barel)</span>
                <span className="font-mono text-slate-200 font-semibold">$72 USD</span>
              </div>
            </div>

            {/* FAKTORY OVLIVŇUJÍCÍ INFLACI */}
            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-3 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                CO AKTUÁLNĚ OVLIVŇUJE CENY
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Inflace reaguje na rozpočtové stimuly, energetické ceny a sazby centrální banky. Pokud nedochází k novým šokům, postupně konverguje k 2 %.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800/50 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-300">Celková stabilizace poptávky</span>
                  <span className="text-slate-400">-0,4 p.b./kvartál</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Cena ropy ($72) · vnější vliv</span>
                  <span className="text-emerald-400">-0,26 p.b./kvartál ↓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Ochlazování trhu nemovitostí</span>
                  <span className="text-emerald-400">-0,13 p.b./kvartál ↓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. NEZAMĚSTNANOST */}
        {type === 'unemployment' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                TRH PRÁCE USA
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Míra nezaměstnanosti</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold font-mono tracking-tight text-white">
                  {fiscal.unemploymentRate}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <div className="text-sm font-medium text-emerald-400 mt-1">Téměř plná zaměstnanost v USA</div>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-3.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                STATISTIKA PRACOVNÍHO TRHU (BLS)
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Celková míra nezaměstnanosti</span>
                <span className="font-mono text-emerald-400 font-semibold">{fiscal.unemploymentRate} %</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Nezaměstnanost mladých do 25 let</span>
                <span className="font-mono text-slate-200 font-semibold">{fiscal.youthUnemploymentRate} %</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-300">Lidé mimo pracovní trh (zdravotní důvody)</span>
                <span className="font-mono text-slate-200 font-semibold">{fiscal.longTermSickMillions} mil. občanů</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. MEDIÁLNÍ HODNOCENÍ */}
        {type === 'media' && (
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-mono">
                AMERICKÁ MÉDIA
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-1">Nálada v redakcích</h1>
            </div>

            <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-6 space-y-2.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                HODNOCENÍ PODLE MÉDIÍ
              </div>

              {mediaOutlets.map((outlet) => {
                const isPos = outlet.rating > 0;
                const isNeg = outlet.rating < 0;
                const sign = isPos ? '+' : '';
                const textColor = isPos
                  ? 'text-emerald-400'
                  : isNeg
                  ? 'text-rose-400'
                  : 'text-slate-400';

                return (
                  <div key={outlet.name} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-300">{outlet.name}</span>
                    <span className={`font-mono font-bold ${textColor}`}>
                      {sign}{outlet.rating}
                    </span>
                  </div>
                );
              })}

              <div className="pt-4 text-slate-400 text-[11px] leading-relaxed space-y-2">
                <p>
                  Mediální nálada vyjadřuje tón, jakým o vás referují američtí novináři. Odvíjí se od vašich tiskových konferencí v Bílém domě a pohotovosti při doplňujících otázkách.
                </p>
                <p>
                  Každé rozhodnutí a legislativní krok v Kongresu posouvá hodnocení jednotlivých redakcí.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
