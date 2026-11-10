import React from 'react';
import {
  FileText,
  DollarSign,
  Scroll,
  MapPin,
  Users,
  Award,
  Radio,
  BarChart3,
  Flame,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  Vote,
  Sparkles
} from 'lucide-react';

interface MoreMenuViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenCongress: () => void;
  onOpenTaxes: () => void;
  onOpenManifesto: () => void;
  onOpenLegacy: () => void;
  onOpenStatesMap: () => void;
  onOpenPressConference: () => void;
  onOpenCareerLadder: () => void;
  onOpenConstitution: () => void;
  onOpenDebtSnapshot: () => void;
  onOpenMediaSnapshot: () => void;
  onResetGame: () => void;
}

export const MoreMenuView: React.FC<MoreMenuViewProps> = ({
  onNavigateTab,
  onOpenCongress,
  onOpenTaxes,
  onOpenManifesto,
  onOpenLegacy,
  onOpenStatesMap,
  onOpenPressConference,
  onOpenCareerLadder,
  onOpenConstitution,
  onOpenDebtSnapshot,
  onOpenMediaSnapshot,
  onResetGame,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="pt-2 px-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-serif-title">
          Vše ostatní
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Kariérní postup od starosty po prezidenta, reálné zákony USA, Ústava & SCOTUS, fiskální a mediální přehledy.
        </p>
      </div>

      {/* Group 1: Kariérní postup & Ústava */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 px-3">
          Kariéra politika & Ústavní instituce USA
        </h2>
        <div className="bg-[#121217] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
          <button
            onClick={onOpenCareerLadder}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Kariérní žebříček: Od starosty po prezidenta
                </span>
                <span className="text-xs text-zinc-400">
                  Starosta (Scranton) ➔ Guvernér (PA) ➔ Senátor USA ➔ Prezident (POTUS)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenConstitution}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Reálné zákony USA & Ústavní soud (SCOTUS)
                </span>
                <span className="text-xs text-zinc-400">
                  Inflation Reduction Act, CHIPS Act, TCJA, ACA & 9 soudců SCOTUS
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 2: Vláda a legislativa */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 px-3">
          Vláda, daně a legislativa
        </h2>
        <div className="bg-[#121217] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
          <button
            onClick={onOpenCongress}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Zákony a hlasování v Kongresu</span>
                <span className="text-xs text-zinc-400">Senát (60 hlasů) & Sněmovna (218 hlasů), AI CBO scoring</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenTaxes}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Daňová kniha (Tax Ledger)</span>
                <span className="text-xs text-zinc-400">Sazby daně z příjmů, FICA, korporací, celních tarifů a paliv</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenDebtSnapshot}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Dluh / HDP & Fiskální snapshot</span>
                <span className="text-xs text-zinc-400">Veřejný dluh, výnosy 10letých dluhopisů a rating trhu (AA+)</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenManifesto}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Scroll className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Volební program a sliby</span>
                <span className="text-xs text-zinc-400">Sledování plnění klíčových reforem a důvěryhodnost prezidenta</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={() => onNavigateTab('cabinet')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Kabinet a ministerstva USA</span>
                <span className="text-xs text-zinc-400">Jmenování ministrů, loajalita, frakce a kompetence</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 3: Média a analýzy */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 px-3">
          Média, průzkumy a historický odkaz
        </h2>
        <div className="bg-[#121217] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
          <button
            onClick={onOpenMediaSnapshot}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Média podle redakcí (Media By Outlet)</span>
                <span className="text-xs text-zinc-400">Nálada v NYT, WSJ, Fox News, CNN, Politico a Reuters</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenLegacy}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Profil a historický odkaz politika</span>
                <span className="text-xs text-zinc-400">Pentagon radarových statistik (Integrita, Charisma, Intelekt...)</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenStatesMap}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">50 států a Sbor volitelů (538 hlasů)</span>
                <span className="text-xs text-zinc-400">Swing states, demografie a předvolební kampaň v terénu</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            onClick={onOpenPressConference}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Tisková konference v Bílém domě</span>
                <span className="text-xs text-zinc-400">Ostré otázky od novinářů z NYT, Fox News, WSJ a AP</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 4: Správa hry */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 px-3">
          Správa kampaně a úřadu
        </h2>
        <div className="bg-[#121217] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
          <button
            onClick={onResetGame}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/10 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-rose-400 block">Založit novou politickou kariéru</span>
                <span className="text-xs text-zinc-400">Výběr nového politika, strany, mandátu a životního příběhu</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
