import React, { useState } from 'react';
import { AdvancedGameState, CareerStage, InTrayBriefing } from '../types/game';
import {
  ChevronDown,
  FastForward,
  Building2,
  Landmark,
  Briefcase,
  Shield,
  Award,
  Vote,
  Scale,
  Users,
  Flame,
  FileText,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HomeDashboardProps {
  gameState: AdvancedGameState;
  onOpenSnapshot: (type: 'approval' | 'debt' | 'gdp' | 'inflation' | 'unemployment' | 'media') => void;
  onOpenBriefing: (briefing: InTrayBriefing) => void;
  onOpenCareerLadder?: () => void;
  onOpenRealLaws?: () => void;
  onAdvanceWeek: () => void;
  isAdvancing: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  gameState,
  onOpenSnapshot,
  onOpenBriefing,
  onOpenCareerLadder,
  onOpenRealLaws,
  onAdvanceWeek,
  isAdvancing,
}) => {
  const { politician, fiscal, overallApproval, loyalLawmakers, sleazeScore, pollLead, inTray, week, term, dateString, career } =
    gameState;

  const [inTrayFilter, setInTrayFilter] = useState<'All' | 'Unread' | 'Urgent' | 'Archived'>('All');

  const filteredBriefings = inTray.filter((b) => {
    if (inTrayFilter === 'Unread') return b.isUnread;
    if (inTrayFilter === 'Urgent') return b.isUrgent;
    if (inTrayFilter === 'Archived') return Boolean(b.repliedOptionId);
    return true;
  });

  const unreadCount = inTray.filter((b) => b.isUnread && !b.repliedOptionId).length;

  const stage = career.stage || 'mayor';

  // Specific visual configuration per stage
  const stageThemeConfig: Record<
    CareerStage,
    {
      environmentHeader: string;
      officeJurisdiction: string;
      sealBadge: string;
      heroImage: string;
      accentBorder: string;
      accentBg: string;
      accentText: string;
      bannerGradient: string;
      inFlightLabel: string;
      tiles: {
        id: string;
        label: string;
        value: string;
        unit?: string;
        subtitle?: string;
        color: string;
        modalType?: 'approval' | 'debt' | 'gdp' | 'inflation' | 'unemployment' | 'media';
      }[];
      quickActions: { icon: string; label: string; desc: string }[];
    }
  > = {
    mayor: {
      environmentHeader: 'RADNICE MĚSTA SCRANTON · OKRES LACKAWANNA, PENSYLVÁNIE',
      officeJurisdiction: 'Kancelář starosty města Scranton (Scranton City Hall)',
      sealBadge: 'Městská pečeť Scranton · Založeno 1866',
      heroImage: '/src/assets/images/mayoral_city_hall_podium_1794324964271.jpg',
      accentBorder: 'border-amber-500/40',
      accentBg: 'bg-amber-500/10',
      accentText: 'text-amber-400',
      bannerGradient: 'from-[#1c150c] via-[#151210] to-[#0d0d12]',
      inFlightLabel: 'ROZPRACOVÁNO NA RADNICI: 2 městské vyhlášky a rozpočet',
      tiles: [
        {
          id: 'approval',
          label: 'MÍSTNÍ PODPORA',
          value: `${career.localApproval || 68}`,
          unit: '%',
          subtitle: 'Občané Scrantonu',
          color: 'text-emerald-400',
          modalType: 'approval',
        },
        {
          id: 'budget',
          label: 'ROZPOČET MĚSTA',
          value: '+$4.2M',
          unit: '',
          subtitle: 'Rating A+ (Stabilní)',
          color: 'text-emerald-400',
          modalType: 'debt',
        },
        {
          id: 'council',
          label: 'MĚSTSKÁ RADA',
          value: '7 z 9',
          unit: 'hlasů',
          subtitle: 'Pracovní většina',
          color: 'text-amber-400',
        },
        {
          id: 'crime',
          label: 'KRIMINALITA',
          value: `${career.localCrimeRate || 14.2}`,
          unit: 'na 1000',
          subtitle: 'Policejní hlídky South Side',
          color: 'text-rose-400',
        },
        {
          id: 'scandals',
          label: 'KAUZY RADNICE',
          value: `${sleazeScore}`,
          unit: '',
          subtitle: 'Čistý etický štít',
          color: 'text-amber-400',
        },
        {
          id: 'poll',
          label: 'PRŮZKUM MĚSTA',
          value: `+${career.localApproval ? (career.localApproval - 50).toFixed(1) : '8.4'}`,
          unit: '%',
          subtitle: 'Náskok před opozicí',
          color: 'text-sky-400',
          modalType: 'media',
        },
        {
          id: 'schools',
          label: 'ŠKOLY SCRANTON',
          value: `${career.localSchoolRating || 74}`,
          unit: '/ 100',
          subtitle: 'Školský obvod Scranton',
          color: 'text-emerald-400',
          modalType: 'gdp',
        },
        {
          id: 'unemployment',
          label: 'NEZAM. V ÚDOLÍ',
          value: '4.1',
          unit: '%',
          subtitle: 'Průmysl a služby',
          color: 'text-emerald-400',
          modalType: 'unemployment',
        },
      ],
      quickActions: [
        { icon: '📋', label: 'Městská vyhláška', desc: 'Regulace nočního klidu a parkování' },
        { icon: '🚧', label: 'Oprava mostu', desc: 'Havárie ocelových nosníků na Mulberry St.' },
        { icon: '🤝', label: 'Odbory Teamsters', desc: 'Kolektivní smlouva se silničáři' },
        { icon: '📰', label: 'Scranton Times', desc: 'Tiskový rozhovor o rozpočtu' },
      ],
    },
    governor: {
      environmentHeader: 'STÁTNÍ KAPITOL V HARRISBURGU · COMMONWEALTH OF PENNSYLVANIA',
      officeJurisdiction: 'Kancelář guvernéra státu Pensylvánie (Governor\'s Reception Room)',
      sealBadge: 'Pečeť státu Pensylvánie · Virtue, Liberty, Independence',
      heroImage: '/src/assets/images/governor_state_capitol_1794324981476.jpg',
      accentBorder: 'border-emerald-500/40',
      accentBg: 'bg-emerald-500/10',
      accentText: 'text-emerald-400',
      bannerGradient: 'from-[#0e1a14] via-[#0d1512] to-[#0d0d12]',
      inFlightLabel: 'ROZPRACOVÁNO V KAPITOLU PA: 2 státní zákony a státní rozpočet',
      tiles: [
        {
          id: 'approval',
          label: 'PODPORA V PA',
          value: '59',
          unit: '%',
          subtitle: 'Voliči Pensylvánie',
          color: 'text-emerald-400',
          modalType: 'approval',
        },
        {
          id: 'debt',
          label: 'STÁTNÍ DLUH PA',
          value: 'AA',
          unit: 'Rating',
          subtitle: 'Dluhopisy Commonwealthu',
          color: 'text-emerald-400',
          modalType: 'debt',
        },
        {
          id: 'assembly',
          label: 'PARLAMENT PA',
          value: '102 / 203',
          unit: 'křesel',
          subtitle: 'Sněmovna & Senát PA',
          color: 'text-amber-400',
        },
        {
          id: 'guard',
          label: 'NÁRODNÍ GARDA',
          value: '94',
          unit: '%',
          subtitle: '18 000 vojáků v pohotovosti',
          color: 'text-sky-400',
        },
        {
          id: 'scandals',
          label: 'STÁTNÍ KAUZY',
          value: '0',
          unit: '',
          subtitle: 'Etický výbor PA',
          color: 'text-amber-400',
        },
        {
          id: 'poll',
          label: 'PRŮZKUM PA',
          value: '+5.8',
          unit: '%',
          subtitle: 'Philadelphia & Pittsburgh',
          color: 'text-sky-400',
          modalType: 'media',
        },
        {
          id: 'shale',
          label: 'BŘIDLIC. PLYN',
          value: '82',
          unit: 'Index',
          subtitle: 'Pánev Marcellus Shale',
          color: 'text-emerald-400',
          modalType: 'gdp',
        },
        {
          id: 'unemployment',
          label: 'NEZAMĚST. V PA',
          value: '3.9',
          unit: '%',
          subtitle: 'Dělnická centra PA',
          color: 'text-emerald-400',
          modalType: 'unemployment',
        },
      ],
      quickActions: [
        { icon: '📜', label: 'Exekutivní nařízení', desc: 'Směrnice pro státní agentury PA' },
        { icon: '🛡️', label: 'Národní garda PA', desc: 'Záchranná pohotovost při záplavách' },
        { icon: '⚖️', label: 'Položkové veto', desc: 'Právo veta nad rozpočtem Senátu PA' },
        { icon: '🎙️', label: 'Harrisburg Press', desc: 'Briefing pro Philadelphia Inquirer' },
      ],
    },
    senator: {
      environmentHeader: 'KAPITOL SPOJENÝCH STÁTŮ · RUSSELL SENATE OFFICE BUILDING',
      officeJurisdiction: 'Kancelář senátora Spojených států (U.S. Senate Chamber, Washington D.C.)',
      sealBadge: 'Pečeť Senátu USA · E Pluribus Unum',
      heroImage: '/src/assets/images/portrait_politician_rostrum_1794322815992.jpg',
      accentBorder: 'border-sky-500/40',
      accentBg: 'bg-sky-500/10',
      accentText: 'text-sky-400',
      bannerGradient: 'from-[#0b1724] via-[#0d141e] to-[#0d0d12]',
      inFlightLabel: 'ROZPRACOVÁNO V SENÁTU: 2 federální zákony v dohadovacím řízení',
      tiles: [
        {
          id: 'approval',
          label: 'CELOSTÁTNÍ ZNÁMOST',
          value: '54',
          unit: '%',
          subtitle: 'Obliba u voličů USA',
          color: 'text-emerald-400',
          modalType: 'approval',
        },
        {
          id: 'clout',
          label: 'VLIV V SENÁTU',
          value: '76',
          unit: '/ 100',
          subtitle: 'Vliv ve frakci (Whip Clout)',
          color: 'text-emerald-400',
        },
        {
          id: 'filibuster',
          label: 'FILIBUSTER MĚŘIČ',
          value: '51 / 60',
          unit: 'hlasů',
          subtitle: 'Potřeba 60 k prolomení',
          color: 'text-amber-400',
        },
        {
          id: 'pac',
          label: 'FONDOVÝ REKORD',
          value: '$28.5M',
          unit: '',
          subtitle: 'War Chest & Super PAC',
          color: 'text-emerald-400',
        },
        {
          id: 'ethics',
          label: 'ETICKÝ VÝBOR',
          value: '0',
          unit: '',
          subtitle: 'Senátní disciplína',
          color: 'text-amber-400',
        },
        {
          id: 'reelect',
          label: 'PRŮZKUM REELECT',
          value: '+4.2',
          unit: '%',
          subtitle: 'Náskok pro další mandát',
          color: 'text-sky-400',
          modalType: 'media',
        },
        {
          id: 'bills',
          label: 'PROSAZENÉ ZÁKONY',
          value: '12',
          unit: 'zákonů',
          subtitle: 'Podepsáno prezidentem',
          color: 'text-emerald-400',
          modalType: 'gdp',
        },
        {
          id: 'committees',
          label: 'VÝBORY SENÁTU',
          value: '3',
          unit: 'křesla',
          subtitle: 'Finance, Zahraničí, Justice',
          color: 'text-sky-400',
        },
      ],
      quickActions: [
        { icon: '⚖️', label: 'Předložit zákon', desc: 'Bipartitní legislativa na plénu Senátu' },
        { icon: '🤝', label: 'Prolomit filibuster', desc: 'Získat 9 umírněných senátorů' },
        { icon: '🏛️', label: 'Výslech SCOTUS', desc: 'Grilování nominovaného soudce' },
        { icon: '📺', label: 'Sunday Shows', desc: 'Vystoupení na Meet the Press' },
      ],
    },
    president: {
      environmentHeader: 'OVÁLNÁ PRACOVNA BÍLÉHO DOMU · BÍLÝ DŮM, WASHINGTON D.C.',
      officeJurisdiction: 'Prezident Spojených států amerických (Commander in Chief)',
      sealBadge: 'Seal of the President of the United States',
      heroImage: '/src/assets/images/hero_capitol_oval_office_1794322813987.jpg',
      accentBorder: 'border-amber-400/50',
      accentBg: 'bg-amber-400/10',
      accentText: 'text-amber-300',
      bannerGradient: 'from-[#191508] via-[#14120b] to-[#0d0d12]',
      inFlightLabel: 'ROZPRACOVÁNO V KABINETU: 2 federální nařízení a rozpočet USA',
      tiles: [
        {
          id: 'approval',
          label: 'PODPORA USA',
          value: `${overallApproval}`,
          unit: '%',
          subtitle: 'Celonárodní schválení',
          color: 'text-emerald-400',
          modalType: 'approval',
        },
        {
          id: 'debt',
          label: 'FEDERÁLNÍ DLUH',
          value: `${Math.round(fiscal.debtGdpPercent)}`,
          unit: '% HDP',
          subtitle: `${fiscal.bondRating} Stabilní`,
          color: 'text-white',
          modalType: 'debt',
        },
        {
          id: 'congress',
          label: 'KONGRES USA',
          value: `${loyalLawmakers}`,
          unit: 'hlasů',
          subtitle: '51 Senát / 221 Sněmovna',
          color: 'text-emerald-400',
        },
        {
          id: 'inflation',
          label: 'INFLACE CPI',
          value: `${fiscal.inflationRate}`,
          unit: '%',
          subtitle: 'Inflační cíl Fedu 2,0 %',
          color: 'text-white',
          modalType: 'inflation',
        },
        {
          id: 'sleaze',
          label: 'KAUZY BÍLÉHO DOMU',
          value: `${sleazeScore}`,
          unit: '',
          subtitle: 'Bez vyšetřování DOJ',
          color: 'text-amber-400',
        },
        {
          id: 'poll',
          label: 'CELONÁRODNÍ PRŮZKUM',
          value: `${pollLead > 0 ? `+${pollLead}` : pollLead}`,
          unit: '%',
          subtitle: 'Gallup & Emerson College',
          color: 'text-white',
          modalType: 'media',
        },
        {
          id: 'gdp',
          label: 'RŮST HDP USA',
          value: `${fiscal.gdpGrowthRate}`,
          unit: '%',
          subtitle: 'Americké hospodářství',
          color: 'text-white',
          modalType: 'gdp',
        },
        {
          id: 'unemployment',
          label: 'NEZAMĚST. BLS',
          value: `${fiscal.unemploymentRate}`,
          unit: '%',
          subtitle: 'Téměř plná zaměstnanost',
          color: 'text-emerald-400',
          modalType: 'unemployment',
        },
      ],
      quickActions: [
        { icon: '🦅', label: 'Prezidentský dekret', desc: 'Vydat Executive Order s okamžitou platností' },
        { icon: '🛡️', label: 'Situation Room', desc: 'Zasedání Národní bezpečnostní rady (NSC)' },
        { icon: '🏛️', label: 'Kapitol Hill', desc: 'Vyjednávání s lídry Kongresu o rozpočtu' },
        { icon: '🎙️', label: 'Brady Briefing Room', desc: 'Tisková konference před novináři z celého světa' },
      ],
    },
  };

  const currentConfig = stageThemeConfig[stage] || stageThemeConfig.mayor;

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. ATMOSFÉRICKÁ HLAVIČKA ÚŘADU - PŘESNĚ PODLE KARIÉRNÍHO STUPNĚ */}
      <div
        className={`relative rounded-3xl overflow-hidden border ${currentConfig.accentBorder} shadow-2xl bg-gradient-to-br ${currentConfig.bannerGradient}`}
      >
        {/* Pozadí úřadu (fotorealistická grafika) */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden">
          <img
            src={currentConfig.heroImage}
            alt="Office Environment"
            className="w-full h-full object-cover object-top scale-105 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/60 to-transparent" />
        </div>

        {/* Textový obsah hlavičky */}
        <div className="relative z-10 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${currentConfig.accentBg} ${currentConfig.accentText} ${currentConfig.accentBorder}`}>
                {currentConfig.sealBadge}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">· {term}. období · {week}. týden</span>
            </div>

            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
              {dateString}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                {currentConfig.officeJurisdiction}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                <span>{politician.firstName} {politician.lastName}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-normal">
                  {politician.party}
                </span>
              </h1>
            </div>

            <button
              onClick={onAdvanceWeek}
              disabled={isAdvancing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{isAdvancing ? 'Simuluji týden...' : 'Další týden ➔'}</span>
            </button>
          </div>

          {/* Kariérní postup link bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-white/5">
            <div className="flex items-center gap-2 text-zinc-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Postup: <strong className="text-white">{career.stageTitle}</strong> ({career.experiencePoints} XP)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCareerLadder && (
                <button
                  onClick={onOpenCareerLadder}
                  className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 font-bold text-[11px] transition-colors"
                >
                  Kariérní žebříček ➔
                </button>
              )}
              {onOpenRealLaws && (
                <button
                  onClick={onOpenRealLaws}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] transition-colors"
                >
                  Zákony & SCOTUS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DLAŽDICOVÉ UKAZATELE (METRIC TILES) PŘESNĚ SPECIFICKÉ PRO TENTO ÚŘAD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {currentConfig.tiles.map((tile) => {
          const isClickable = Boolean(tile.modalType);

          const content = (
            <>
              <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 flex items-center justify-between">
                <span>{tile.label}</span>
                {isClickable && <span className="text-[9px] text-zinc-600">DETAIL</span>}
              </div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className={`text-2xl font-bold font-mono tracking-tight ${tile.color}`}>
                  {tile.value}
                </span>
                {tile.unit && <span className="text-xs font-mono text-zinc-400">{tile.unit}</span>}
              </div>
              {tile.subtitle && (
                <div className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                  {tile.subtitle}
                </div>
              )}
            </>
          );

          if (isClickable && tile.modalType) {
            return (
              <button
                key={tile.id}
                onClick={() => onOpenSnapshot(tile.modalType!)}
                className="bg-[#12161f] hover:bg-[#181e2a] border border-slate-800/80 rounded-2xl p-3 text-left transition-all group active:scale-[0.98]"
              >
                {content}
              </button>
            );
          }

          return (
            <div key={tile.id} className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-3 text-left">
              {content}
            </div>
          );
        })}
      </div>

      {/* 3. RYCHLÉ EXEKUTIVNÍ AKCE ÚŘADU (QUICK ACTIONS TOOLBAR) */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-4 space-y-2.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
          Pravomoci a agenda úřadu:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currentConfig.quickActions.map((qa, qidx) => (
            <div
              key={qidx}
              className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-left space-y-1 hover:border-white/15 transition-colors cursor-pointer"
            >
              <div className="text-base">{qa.icon}</div>
              <div className="text-xs font-bold text-white truncate">{qa.label}</div>
              <div className="text-[10px] text-zinc-400 line-clamp-1">{qa.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ROZPRACOVÁNO V ÚŘADU */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
        <span className="font-mono tracking-wider uppercase text-[11px] text-slate-400 font-bold">
          {currentConfig.inFlightLabel}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-slate-300">
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* 5. IN-TRAY MEMORANDA A BRIEFINGY PŘÍMO PRO TENTO ÚŘAD */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-400 font-bold">
              DORUČENÁ POŠTA ÚŘADU
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-400 font-medium">
              {unreadCount} {unreadCount === 1 ? 'nepřečtené' : 'nepřečtených'}
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            {unreadCount} čeká na rozhodnutí
          </div>
        </div>

        {/* Filtry doručené pošty */}
        <div className="flex items-center gap-2">
          {(['All', 'Unread', 'Urgent', 'Archived'] as const).map((filter) => {
            const labels = {
              All: 'Vše',
              Unread: 'Nepřečtené',
              Urgent: 'Urgentní',
              Archived: 'Archiv',
            };
            const isActive = inTrayFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setInTrayFilter(filter)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-[#12161f] text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {/* Seznam memorand v doručené poště */}
        <div className="space-y-3 pt-1">
          {filteredBriefings.map((briefing) => {
            const isAnswered = Boolean(briefing.repliedOptionId);
            return (
              <div
                key={briefing.id}
                onClick={() => onOpenBriefing(briefing)}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all ${
                  !isAnswered
                    ? 'bg-[#12161f] border-2 border-amber-500/80 shadow-lg shadow-amber-500/5 hover:border-amber-400'
                    : 'bg-[#12161f]/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/40 rounded px-1.5 py-0.5">
                      {briefing.category}
                    </span>
                  </div>

                  {!isAnswered ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/60 bg-amber-950/40 rounded px-2 py-0.5">
                      VYŽADUJE ROZHODNUTÍ
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded px-2 py-0.5">
                      VYŘÍZENO
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold font-serif text-white mt-1">
                  {briefing.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {briefing.previewSnippet}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <span className="truncate max-w-[280px]">
                    {briefing.senderName} · {briefing.senderTitle}
                  </span>

                  {!isAnswered && (
                    <span className="inline-flex items-center gap-1 text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-full text-xs shadow-sm transition-colors shrink-0">
                      👉 Otevřít spis
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
