import React from 'react';
import { AdvancedGameState, CareerStage } from '../types/game';
import {
  Award,
  Building2,
  ChevronRight,
  DollarSign,
  Flag,
  Landmark,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Vote,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CareerLadderViewProps {
  gameState: AdvancedGameState;
  onAdvanceCareerStage: (nextStage: CareerStage) => void;
  onOpenAiCampaignDebate: () => void;
}

export const CareerLadderView: React.FC<CareerLadderViewProps> = ({
  gameState,
  onAdvanceCareerStage,
  onOpenAiCampaignDebate,
}) => {
  const { career, overallApproval } = gameState;

  const stages: {
    id: CareerStage;
    number: number;
    title: string;
    office: string;
    description: string;
    powers: string[];
    minXp: number;
    image: string;
  }[] = [
    {
      id: 'mayor',
      number: 1,
      title: 'Starosta města (Mayor)',
      office: `${career.cityName || 'Scranton'}, ${career.stateName}`,
      description: 'Správa města, rozpočet radnice, policejní sbor, místní školství a komunální krizové řízení.',
      powers: [
        'Řízení městské policie a zásahových složek',
        'Územní plánování a schvalování investic',
        'Stanovování městské daně z nemovitostí a poplatků',
        'Řešení komunálních stávek a oprav mostů'
      ],
      minXp: 0,
      image: '/src/assets/images/mayoral_city_hall_podium_1794324964271.jpg'
    },
    {
      id: 'governor',
      number: 2,
      title: 'Guvernér státu (State Governor)',
      office: `Stát ${career.stateName} (${career.stateCode})`,
      description: 'Vrchní velitel státní Národní gardy, státní rozpočet, dálniční síť, právo veta a boj o 10. dodatek Ústavy.',
      powers: [
        'Velení státní Národní gardě při krizích a nepokojích',
        'Právo veta nad zákony státního parlamentu',
        'Nastavování státní daně z příjmu a obratu',
        'Exekutivní pravomoc pro nouzové stavy'
      ],
      minXp: 1000,
      image: '/src/assets/images/governor_state_capitol_1794324981476.jpg'
    },
    {
      id: 'senator',
      number: 3,
      title: 'Senátor Spojených států (US Senator)',
      office: 'Kapitol, Washington D.C.',
      description: 'Jeden ze 100 nejmocnějších zákonodárců světa. Hlasování o federálních zákonech, překonání filibusteru (60 hlasů) a potvrzování soudců SCOTUS.',
      powers: [
        'Zákonodárná iniciativa v Kongresu USA',
        'Filibuster a obstrukce na plénu Senátu',
        'Potvrzování federálních soudců a ministrů vlády',
        'Slyšení v senátních vyšetřovacích výborech'
      ],
      minXp: 2500,
      image: '/src/assets/images/portrait_politician_rostrum_1794322815992.jpg'
    },
    {
      id: 'president',
      number: 4,
      title: 'Prezident Spojených států (POTUS)',
      office: 'Oválná pracovna, Bílý dům',
      description: 'Hlava státu, vrchní velitel ozbrojených sil (Commander in Chief), vydávání exekutivních příkazů a mezinárodní velmoc.',
      powers: [
        'Vydávání prezidentských exekutivních dekretů (Executive Orders)',
        'Velení ozbrojeným silám a jadernému arzenálu',
        'Nominace soudců Nejvyššího soudu (SCOTUS)',
        'Prezidentské veto zákonů Kongresu a mezinárodní smlouvy'
      ],
      minXp: 5000,
      image: '/src/assets/images/hero_capitol_oval_office_1794322813987.jpg'
    }
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === career.stage);
  const nextStage = stages[currentStageIndex + 1];

  const canPromote = career.experiencePoints >= (nextStage?.minXp || 99999) && overallApproval >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
              <Award className="w-4 h-4" />
              <span>Politická kariéra & Cesta do Bílého domu</span>
            </div>
            <h1 className="text-2xl font-bold font-serif-title text-white mt-1">
              {career.stageTitle}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Začněte jako komunální politik, vyřešte lokální krize a rozpočet, vybudujte si volební fond od malých dárců i Super PACů a kandidujte na guvernéra, do Senátu až do Oválné pracovny.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Kariérní zkušenosti (XP)</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {career.experiencePoints} <span className="text-xs text-zinc-500">/ {nextStage?.minXp || 5000} XP</span>
              </span>
            </div>

            {nextStage && (
              <button
                onClick={onOpenAiCampaignDebate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Spustit kampaň: Kandidovat na {nextStage.title.split('(')[0]}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
            <span>Postup na další úroveň: {nextStage ? nextStage.title : 'Dosažen vrchol (POTUS)'}</span>
            <span>{Math.min(100, Math.round((career.experiencePoints / (nextStage?.minXp || 5000)) * 100))}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, Math.round((career.experiencePoints / (nextStage?.minXp || 5000)) * 100))}%`
              }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Campaign War Chest & Donors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#121217] border border-white/10 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 uppercase font-mono block">Volební pokladna (War Chest)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-emerald-400">${career.campaignChestMillion}M</span>
            <span className="text-[10px] text-zinc-500">na kampaň a TV reklamy</span>
          </div>
        </div>

        <div className="bg-[#121217] border border-white/10 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 uppercase font-mono block">Drobní dárci (Grassroots)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-sky-400">{career.grassrootsDonorsCount.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500">občanů posílá průměrně $25</span>
          </div>
        </div>

        <div className="bg-[#121217] border border-white/10 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-zinc-400 uppercase font-mono block">Podpora Super PACů</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-amber-400">${career.superPacSupportMillion}M</span>
            <span className="text-[10px] text-zinc-500">nezávislé výdaje na vaši podporu</span>
          </div>
        </div>
      </div>

      {/* 4-Step Career Progression Ladder */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Kariérní stupně politické dráhy v USA
        </h2>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isCurrent = stage.id === career.stage;
            const isCompleted = idx < currentStageIndex;
            const isLocked = idx > currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isCurrent
                    ? 'bg-[#15151c] border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : isCompleted
                    ? 'bg-[#101014] border-emerald-500/30 opacity-90'
                    : 'bg-[#0e0e12] border-white/5 opacity-60'
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCurrent
                          ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 font-bold'
                          : isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-800/40 border-white/10 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <span className="font-serif-title text-lg font-bold">{stage.number}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-serif-title">
                          {stage.title}
                        </h3>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                            Aktuální úřad
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                            Úspěšně zvládnuto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">{stage.office}</p>
                      <p className="text-xs text-zinc-300 pt-1">{stage.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    {isCurrent && nextStage && (
                      <button
                        onClick={() => onAdvanceCareerStage(nextStage.id)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>Povýšit na další stupeň</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {isCompleted && (
                      <button
                        onClick={() => onAdvanceCareerStage(stage.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                      >
                        Přepnout zpět do tohoto úřadu
                      </button>
                    )}
                  </div>
                </div>

                {/* Specific Powers Pills */}
                <div className="bg-black/40 px-5 py-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                  <span className="text-zinc-500 uppercase font-mono text-[10px]">Pravomoci úřadu:</span>
                  {stage.powers.map((pwr, pidx) => (
                    <span key={pidx} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-zinc-300">
                      • {pwr}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
