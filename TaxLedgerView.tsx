import React from 'react';
import { TaxItem } from '../types/game';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface TaxLedgerViewProps {
  taxes: TaxItem[];
  onAdjustTaxRate: (taxId: string, delta: number) => void;
  onAbolishTax: (taxId: string) => void;
}

export const TaxLedgerView: React.FC<TaxLedgerViewProps> = ({
  taxes,
  onAdjustTaxRate,
  onAbolishTax,
}) => {
  const majorTaxes = taxes.filter((t) => t.category === 'Major');
  const otherTaxes = taxes.filter((t) => t.category === 'Other');

  const totalRevenue = taxes.reduce((acc, t) => acc + t.annualRevenueBillion, 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-amber-500">
            DAŇOVÁ KNIHA USA
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mt-0.5">
            Federální daňový systém & Příjmy
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nastavujte federální daňové sazby. Úpravy okamžitě ovlivňují příjmy rozpočtu, elasticitu i náladu voličů.
          </p>
        </div>

        <div className="bg-[#12161f] border border-slate-800 rounded-2xl p-3 text-right">
          <div className="text-[10px] font-mono uppercase text-slate-400">Celkový roční výběr</div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            ${totalRevenue.toLocaleString()} mld. USD
          </div>
        </div>
      </div>

      {/* Hlavní daňové příjmy */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-slate-400">
          <span>HLAVNÍ DAŇOVÉ PŘÍJMY</span>
          <span>{majorTaxes.length} daně</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {majorTaxes.map((tax) => (
            <div
              key={tax.id}
              className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">{tax.name}</h3>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  ${tax.annualRevenueBillion} <span className="text-xs text-slate-400 font-normal">mld.</span>
                </div>
              </div>

              <div className="space-y-1 text-xs border-t border-slate-800/60 pt-2 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Aktuální sazba:</span>
                  <span className="font-bold text-amber-400">{tax.currentRate}%</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Poplatníci:</span>
                  <span>{tax.taxpayersMillions} mil.</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Elasticita výběru:</span>
                  <span>{tax.elasticity}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
                <div className="flex gap-1">
                  <button
                    onClick={() => onAdjustTaxRate(tax.id, -tax.adjustStep)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-emerald-400"
                    title="Snížit daňovou sazbu"
                  >
                    -{tax.adjustStep}%
                  </button>
                  <button
                    onClick={() => onAdjustTaxRate(tax.id, tax.adjustStep)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-rose-400"
                    title="Zvýšit daňovou sazbu"
                  >
                    +{tax.adjustStep}%
                  </button>
                </div>

                <button
                  onClick={() => onAbolishTax(tax.id)}
                  className="text-[11px] text-rose-400/80 hover:text-rose-300 underline font-mono"
                >
                  Zrušit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ostatní daně a cla */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-slate-400">
          <span>OSTATNÍ POPLATKY A CLA</span>
          <span>{otherTaxes.length} položek</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {otherTaxes.map((tax) => (
            <div
              key={tax.id}
              className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-2"
            >
              <div>
                <h3 className="text-xs font-semibold text-white leading-tight">{tax.name}</h3>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  ${tax.annualRevenueBillion} <span className="text-xs text-slate-400 font-normal">mld.</span>
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono text-slate-300 border-t border-slate-800/60 pt-1.5">
                <span>Sazba:</span>
                <span className="text-amber-400 font-bold">{tax.currentRate}%</span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
                <div className="flex gap-1">
                  <button
                    onClick={() => onAdjustTaxRate(tax.id, -tax.adjustStep)}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono font-bold text-emerald-400"
                  >
                    -{tax.adjustStep}%
                  </button>
                  <button
                    onClick={() => onAdjustTaxRate(tax.id, tax.adjustStep)}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono font-bold text-rose-400"
                  >
                    +{tax.adjustStep}%
                  </button>
                </div>
                <button
                  onClick={() => onAbolishTax(tax.id)}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-mono"
                >
                  Zrušit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
