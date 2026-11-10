import React from 'react';
import { PoliticianProfile } from '../types/game';
import { Landmark, Vote, MapPin, Newspaper, Users, Mic, FastForward, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  player: PoliticianProfile;
  week: number;
  weeksUntilElection: number;
  approval: number;
  politicalCapital: number;
  campaignFunds: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdvanceTurn: () => void;
  isAdvancing: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  player,
  week,
  weeksUntilElection,
  approval,
  politicalCapital,
  campaignFunds,
  activeTab,
  onTabChange,
  onAdvanceTurn,
  isAdvancing,
}) => {
  const partyBadgeColor =
    player.party === 'Democratic'
      ? 'text-sky-400 bg-sky-950/60 border-sky-800/60'
      : player.party === 'Republican'
      ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
      : 'text-amber-400 bg-amber-950/60 border-amber-800/60';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800/80">
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-slate-950 font-serif-title font-bold text-lg shadow-sm">
            ★
          </div>
          <span className="text-xl font-bold tracking-wider text-slate-100 font-serif-title whitespace-nowrap shrink-0">
            STATECRAFT
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Oval Office</span>
          </button>

          <button
            onClick={() => onTabChange('congress')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'congress'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Capitol Hill</span>
          </button>

          <button
            onClick={() => onTabChange('electoral')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'electoral'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>50-State Map</span>
          </button>

          <button
            onClick={() => onTabChange('press')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'press'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Press Room</span>
          </button>

          <button
            onClick={() => onTabChange('advisors')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'advisors'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>War Room</span>
          </button>

          <button
            onClick={() => onTabChange('debate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'debate'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Debate Stage</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onAdvanceTurn}
            disabled={isAdvancing}
            aria-label="Advance to Next Week"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <FastForward className="w-4 h-4" />
            <span>{isAdvancing ? 'Simulating Week...' : 'Next Week'}</span>
          </button>
        </div>
      </div>

      {/* Sub-header Stat Bar */}
      <div className="bg-slate-900/70 border-t border-slate-800/60 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-slate-300">
          {/* Politician Identity */}
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-100">{player.name}</span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${partyBadgeColor}`}>
              {player.party === 'Democratic' ? 'Dem' : player.party === 'Republican' ? 'GOP' : 'Ind'} · {player.role} ({player.homeState})
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline">{player.faction}</span>
          </div>

          {/* Core Telemetry Strip */}
          <div className="flex items-center gap-5 font-mono tabular-nums">
            <div>
              <span className="text-slate-400 mr-1.5 font-sans">Timeline:</span>
              <span className="font-semibold text-slate-200">Wk {week}</span>
              <span className="text-slate-400 text-[11px] ml-1">({weeksUntilElection}w to Election)</span>
            </div>

            <div>
              <span className="text-slate-400 mr-1.5 font-sans">Approval:</span>
              <span className={`font-semibold ${approval >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {approval.toFixed(1)}%
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-1.5 font-sans">Cap:</span>
              <span className="font-semibold text-sky-400">{politicalCapital}/100</span>
            </div>

            <div>
              <span className="text-slate-400 mr-1.5 font-sans">War Chest:</span>
              <span className="font-semibold text-emerald-400">${campaignFunds.toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
