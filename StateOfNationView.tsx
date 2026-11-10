import React, { useState } from 'react';
import { StateData, AdvancedGameState, PollsterResult, CareerStage } from '../types/game';
import { INITIAL_STATES, STATE_GRID_LAYOUT } from '../game/statesData';
import { calculateElectoralCollege, calculateStateCampaignEffect } from '../game/simulation';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Megaphone,
  Users,
  Radio,
  Vote,
  Compass,
  Building,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface StateOfNationViewProps {
  gameState: AdvancedGameState;
  stage?: CareerStage;
  onUpdateStateMargin: (stateCode: string, newMargin: number) => void;
  onOpenPressConference: () => void;
}

export const StateOfNationView: React.FC<StateOfNationViewProps> = ({
  gameState,
  stage = 'mayor',
  onUpdateStateMargin,
  onOpenPressConference,
}) => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('PA');
  const [activeSubTab, setActiveSubTab] = useState<'states' | 'polls' | 'media'>('states');
  const [campaignActionMsg, setCampaignActionMsg] = useState<string | null>(null);

  const stageTitles: Record<CareerStage, { title: string; subtitle: string; badge: string }> = {
    mayor: {
      title: 'Scranton & Pozice v Pensylvánii a USA',
      subtitle: 'Město Scranton (okres Lackawanna), podpora v Pensylvánii a vliv na národní scénu.',
      badge: 'Lokální úroveň · Lackawanna County, PA',
    },
    governor: {
      title: 'Pensylvánie (Harrisburg) & 50 států USA',
      subtitle: 'Guvernérská politická síla, sbor volitelů a podpora ve swing states v boji o znovuzvolení.',
      badge: 'Státní úroveň · Commonwealth of PA',
    },
    senator: {
      title: 'Senátní volební mapa & Národní průzkumy',
      subtitle: 'Senátní většina (51:49), podpora ve vašem domovském státě PA a federální mediální scéna.',
      badge: 'Federální legislativa · US Senate',
    },
    president: {
      title: '50 států USA & Národní mediální aréna',
      subtitle: 'Sbor volitelů (Electoral College 538), klíčové swing states a národní průzkumy veřejného mínění.',
      badge: 'Federální exekutiva · POTUS',
    },
  };

  const currentStageInfo = stageTitles[stage] || stageTitles.mayor;

  // Use persistent state if available or initial
  const statesMap = INITIAL_STATES;
  const electoralSummary = calculateElectoralCollege(statesMap);
  const selectedState = statesMap[selectedStateCode] || statesMap['PA'];

  const handleCampaignAction = (type: 'ad_buy' | 'rally') => {
    const res = calculateStateCampaignEffect(
      selectedState,
      gameState.politician.party as any,
      type,
      type === 'ad_buy' ? 6 : 0,
      gameState.radarStats.charisma
    );

    onUpdateStateMargin(selectedState.code, res.newMargin);
    setCampaignActionMsg(
      type === 'ad_buy'
        ? `Kampaň v ${selectedState.name}: Televizní a digitální reklama posunula preference o ${res.delta > 0 ? '+' : ''}${res.delta.toFixed(1)} %!`
        : `Mítink v ${selectedState.name}: Zaplněná sportovní hala a projev posunuly preference o ${res.delta > 0 ? '+' : ''}${res.delta.toFixed(1)} %!`
    );

    setTimeout(() => {
      setCampaignActionMsg(null);
    }, 4500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Selector Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-white tracking-tight">
              {currentStageInfo.title}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
              {currentStageInfo.badge}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentStageInfo.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#121217] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveSubTab('states')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeSubTab === 'states'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Volební mapa (538)
          </button>
          <button
            onClick={() => setActiveSubTab('polls')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeSubTab === 'polls'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Průzkumy agentur
          </button>
          <button
            onClick={() => setActiveSubTab('media')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeSubTab === 'media'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nálada v médiích
          </button>
        </div>
      </div>

      {/* Subtab 1: States & Electoral College */}
      {activeSubTab === 'states' && (
        <div className="space-y-6">
          {/* Electoral College Gauge */}
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-bold text-sm">
                Demokraté: {electoralSummary.demVotes} volitelů
              </span>
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                270 k vítězství
              </span>
              <span className="text-rose-400 font-bold text-sm">
                Republikáni: {electoralSummary.repVotes} volitelů
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden flex relative">
              <div
                style={{ width: `${(electoralSummary.demVotes / 538) * 100}%` }}
                className="bg-sky-500 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${(electoralSummary.tossupVotes / 538) * 100}%` }}
                className="bg-amber-500/80 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${(electoralSummary.repVotes / 538) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
              />
              {/* 270 Marker */}
              <div
                style={{ left: `${(270 / 538) * 100}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Nerozhodné státy (Swing): {electoralSummary.tossupVotes} volitelů</span>
              <span>
                Aktuální stav:{' '}
                <strong className={electoralSummary.leader === 'Democratic' ? 'text-sky-400' : 'text-rose-400'}>
                  {electoralSummary.leader === 'Democratic' ? 'Vedení Demokratů' : 'Vedení Republikánů'}
                </strong>
              </span>
            </div>
          </div>

          {/* Feedback Toast */}
          {campaignActionMsg && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{campaignActionMsg}</span>
            </div>
          )}

          {/* 50 States Grid / Cartogram */}
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Interaktivní kartogram 50 států USA (Klikněte na stát)
              </h2>
              <span className="text-[11px] text-zinc-500">PA, WI, MI, AZ, GA jsou klíčové bojiště</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 pt-2">
              {Object.values(statesMap).map((st) => {
                const isDem = st.demMargin > 1.0;
                const isRep = st.demMargin < -1.0;
                const isTossup = !isDem && !isRep;
                const isSelected = selectedStateCode === st.code;

                return (
                  <button
                    key={st.code}
                    onClick={() => setSelectedStateCode(st.code)}
                    className={`h-11 rounded-lg flex flex-col items-center justify-center transition-all text-xs border ${
                      isSelected
                        ? 'ring-2 ring-amber-400 scale-105 z-10 font-bold'
                        : 'opacity-90 hover:opacity-100'
                    } ${
                      isDem
                        ? 'bg-sky-950/80 border-sky-600/50 text-sky-200'
                        : isRep
                        ? 'bg-rose-950/80 border-rose-600/50 text-rose-200'
                        : 'bg-amber-950/80 border-amber-600/50 text-amber-200 animate-pulse'
                    }`}
                  >
                    <span className="font-mono font-bold leading-none">{st.code}</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{st.electoralVotes}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected State Drilldown Card */}
          {selectedState && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">{selectedState.name}</h3>
                    <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      {selectedState.electoralVotes} hlasů volitelů
                    </span>
                    {selectedState.isBattleground && (
                      <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                        Klíčový bojiště (Swing State)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Populace: {selectedState.population} mil. obyvatel · PVI index:{' '}
                    {selectedState.pvi > 0 ? `R+${selectedState.pvi}` : `D+${Math.abs(selectedState.pvi)}`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase">Náskok v průzkumech</span>
                  <span
                    className={`text-lg font-mono font-bold ${
                      selectedState.demMargin >= 0 ? 'text-sky-400' : 'text-rose-400'
                    }`}
                  >
                    {selectedState.demMargin >= 0
                      ? `Demokraté +${selectedState.demMargin.toFixed(1)}%`
                      : `Republikáni +${Math.abs(selectedState.demMargin).toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* State Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[11px]">Dělnická třída:</span>
                  <span className="font-mono font-bold text-zinc-200">
                    {selectedState.demographics.workingClass}%
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[11px]">Vysokoškoláci:</span>
                  <span className="font-mono font-bold text-zinc-200">
                    {selectedState.demographics.collegeEducated}%
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[11px]">Městské obyvatelstvo:</span>
                  <span className="font-mono font-bold text-zinc-200">
                    {selectedState.demographics.urban}%
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[11px]">Venkov:</span>
                  <span className="font-mono font-bold text-zinc-200">
                    {selectedState.demographics.rural}%
                  </span>
                </div>
              </div>

              {/* Campaign Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCampaignAction('ad_buy')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Koupit televizní kampaň (6 mil. $)</span>
                </button>

                <button
                  onClick={() => handleCampaignAction('rally')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Uspořádat prezidentský mítink</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Pollsters */}
      {activeSubTab === 'polls' && (
        <div className="space-y-4">
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Národní průzkumy veřejného mínění (Gallup, YouGov, Marist)
            </h2>
            <div className="divide-y divide-white/5">
              {gameState.pollsters.map((poll, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">{poll.pollster}</span>
                    <span className="text-xs text-zinc-400">
                      {poll.methodology} · Vzorek: {poll.sampleSize.toLocaleString()} voličů ({poll.date})
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-base font-mono font-bold ${
                        poll.leadMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {poll.leadMargin >= 0 ? `+${poll.leadMargin}% náskok` : `${poll.leadMargin}% ztráta`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Media Mood (Replicating Screenshot 15:38) */}
      {activeSubTab === 'media' && (
        <div className="space-y-4">
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">
                  Mediální pokrytí podle tiskových domů (Media by Outlet)
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Jak vás vidí američtí novináři. Rating se mění po tiskových konferencích v Bílém domě.
                </p>
              </div>
              <button
                onClick={onOpenPressConference}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Vstoupit do tiskového sálu</span>
              </button>
            </div>

            <div className="divide-y divide-white/5 font-mono text-xs">
              {gameState.mediaOutlets.map((outlet, idx) => {
                const isPos = outlet.rating > 0;
                const isNeg = outlet.rating < 0;

                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-sans font-medium text-white">{outlet.name}</span>
                      <span className="text-[10px] text-zinc-500 font-sans">({outlet.alignment})</span>
                    </div>

                    <span
                      className={`font-bold tabular-nums text-sm ${
                        isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-zinc-400'
                      }`}
                    >
                      {isPos ? `+${outlet.rating}` : outlet.rating}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-zinc-400 space-y-1">
              <p>
                <strong>Vysvětlivka:</strong> Nálada v médiích určuje, jak vstřícně novináři interpretují vaše vládní rozhodnutí.
              </p>
              <p>
                Vystoupení na tiskových konferencích a odpovědi na těžké otázky novinářů z NYT, CNN nebo Fox News přímo ovlivňují tyto ratingy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
