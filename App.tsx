import React, { useState } from 'react';
import {
  AdvancedGameState,
  Bill,
  CareerStage,
  GameState,
  PoliticianProfile,
  ScotusJudicialReview
} from './types/game';
import {
  INITIAL_GAME_STATE,
  INITIAL_CABINET,
  INITIAL_TAXES,
  MANIFESTO_PLEDGES,
  INITIAL_MEDIA_OUTLETS,
  INITIAL_POLLSTERS,
  REAL_US_LAWS,
  STAGE_CABINETS,
  STAGE_IN_TRAYS
} from './data/initialData';
import { INITIAL_STATES } from './game/statesData';
import { HomeDashboard } from './components/HomeDashboard';
import { CabinetView } from './components/CabinetView';
import { ExecutiveAiChatView } from './components/ExecutiveAiChatView';
import { StateOfNationView } from './components/StateOfNationView';
import { MoreMenuView } from './components/MoreMenuView';
import { MetricDetailModal } from './components/MetricDetailModal';
import { BriefingDetailModal } from './components/BriefingDetailModal';
import { CongressView } from './components/CongressView';
import { TaxLedgerView } from './components/TaxLedgerView';
import { ManifestoBuilderView } from './components/ManifestoBuilderView';
import { ProfileLegacyView } from './components/ProfileLegacyView';
import { PressConferenceModal } from './components/PressConferenceModal';
import { CareerLadderView } from './components/CareerLadderView';
import { RealLawsConstitutionView } from './components/RealLawsConstitutionView';
import { CampaignElectionModal } from './components/CampaignElectionModal';
import {
  Inbox,
  Users,
  Sparkles,
  Globe2,
  Menu,
  FastForward,
  Landmark,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<AdvancedGameState>(INITIAL_GAME_STATE);
  const [activeTab, setActiveTab] = useState<'home' | 'cabinet' | 'aivelin' | 'world' | 'more'>('home');
  const [subView, setSubView] = useState<'congress' | 'taxes' | 'manifesto' | 'legacy' | 'career' | 'constitution' | null>(null);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  const [isCampaignDebateOpen, setIsCampaignDebateOpen] = useState(false);
  const [targetCareerStage, setTargetCareerStage] = useState<CareerStage>('governor');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Congressional bills state
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 'bill-1',
      title: 'Zákon o zdanění nadměrných zisků energetických gigantů',
      sponsor: 'Sarah Montgomery (D-PA)',
      category: 'Economy',
      summary: '35% odvod ze spekulativních zisků ropných kartelů k financování slev na benzín pro rodiny.',
      economicCostBillion: -120,
      economicImpactRating: 'Snížení schodku & Podpora rodin',
      ideologyAlignment: { economic: -15, social: -10 },
      senateVotes: { yeas: 0, nays: 0, required: 60 },
      houseVotes: { yeas: 0, nays: 0, required: 218 },
      status: 'Senate Floor',
      demSupport: 92,
      repSupport: 22,
      publicSupport: 68,
      isPlayerSponsored: true,
      aiAnalysis: 'CBO odhaduje zvýšení federálních příjmů o 120 mld. USD a posílení kupní síly střední třídy.',
    },
    {
      id: 'bill-2',
      title: 'Zákon o federálním výdajovém stropu a rozpočtové odpovědnosti',
      sponsor: 'James C. Sterling (R-OH)',
      category: 'Economy',
      summary: 'Zákonný limit růstu federálních diskrečních výdajů vázaný na nominální růst HDP.',
      economicCostBillion: -95,
      economicImpactRating: 'Fiskální konsolidace',
      ideologyAlignment: { economic: 30, social: 10 },
      senateVotes: { yeas: 0, nays: 0, required: 60 },
      houseVotes: { yeas: 0, nays: 0, required: 218 },
      status: 'In Committee',
      demSupport: 35,
      repSupport: 90,
      publicSupport: 54,
      isPlayerSponsored: false,
      aiAnalysis: 'Stabilizuje výnosy státních dluhopisů, ale omezuje rozpočty federálních agentur.',
    },
  ]);

  const [politicalCapital, setPoliticalCapital] = useState(65);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Turn Advancement
  const handleAdvanceTurn = () => {
    setIsAdvancing(true);

    setTimeout(() => {
      setGameState((prev) => {
        const nextWeek = prev.week + 1;
        const year = 2026 + Math.floor(nextWeek / 52);
        const monthNum = ((nextWeek - 1) % 12) + 1;
        const day = ((nextWeek * 7) % 28) + 1;

        // Minor macro fluctuation
        const gdpDrift = (Math.random() - 0.48) * 0.1;
        const newGdp = Number(Math.max(0.5, Math.min(5.0, prev.fiscal.gdpGrowthRate + gdpDrift)).toFixed(2));

        const inflationDrift = (Math.random() - 0.5) * 0.08;
        const newInflation = Number(Math.max(1.5, Math.min(6.5, prev.fiscal.inflationRate + inflationDrift)).toFixed(2));

        // Public debt weekly interest addition
        const weeklyBorrowing = Number((prev.fiscal.totalBorrowingBillion / 52).toFixed(2));
        const newDebtTotal = Number((prev.fiscal.totalPublicDebtBillion + weeklyBorrowing).toFixed(1));

        return {
          ...prev,
          week: nextWeek,
          dateString: `${day}. ${monthNum}. ${year}`,
          fiscal: {
            ...prev.fiscal,
            gdpGrowthRate: newGdp,
            inflationRate: newInflation,
            totalPublicDebtBillion: newDebtTotal,
          },
        };
      });

      setPoliticalCapital((prev) => Math.min(100, prev + 5));
      setIsAdvancing(false);
      showToast(`1 týden uplynul. Vládní aparát aktualizoval rozpočtová a makroekonomická data.`);
    }, 400);
  };

  // Executive Action from AI Velín
  const handleApplyExecutiveAction = (
    approvalDelta: number,
    debtDeltaBillion: number,
    authorityDelta: number,
    logMessage: string
  ) => {
    setGameState((prev) => {
      const newApproval = Math.max(15, Math.min(95, Number((prev.overallApproval + approvalDelta).toFixed(1))));
      const newDebt = Number((prev.fiscal.totalPublicDebtBillion + debtDeltaBillion).toFixed(1));
      const newAuthority = Math.max(10, Math.min(100, prev.radarStats.authority + authorityDelta));

      return {
        ...prev,
        overallApproval: newApproval,
        fiscal: {
          ...prev.fiscal,
          totalPublicDebtBillion: newDebt,
        },
        radarStats: {
          ...prev.radarStats,
          authority: newAuthority,
        },
      };
    });

    showToast(logMessage);
  };

  // Briefing Decision Option
  const handleSelectBriefingOption = (briefingId: string, optionId: string) => {
    setGameState((prev) => {
      const briefing = prev.inTray.find((b) => b.id === briefingId);
      if (!briefing) return prev;

      const option = briefing.options.find((o) => o.id === optionId);
      if (!option) return prev;

      const newApproval = Math.max(
        15,
        Math.min(95, Number((prev.overallApproval + (option.approvalDelta || 0)).toFixed(1)))
      );
      const newDebt = Number((prev.fiscal.totalPublicDebtBillion + (option.debtDeltaBillion || 0)).toFixed(1));

      return {
        ...prev,
        overallApproval: newApproval,
        fiscal: {
          ...prev.fiscal,
          totalPublicDebtBillion: newDebt,
        },
        inTray: prev.inTray.map((b) =>
          b.id === briefingId
            ? { ...b, isUnread: false, needsReply: false, repliedOptionId: optionId }
            : b
        ),
      };
    });

    const roleName = gameState.career.stage === 'mayor' 
      ? 'Rozhodnutí starosty města Scranton'
      : gameState.career.stage === 'governor'
      ? 'Výnos guvernéra Pensylvánie'
      : gameState.career.stage === 'senator'
      ? 'Senátní stanovisko'
      : 'Prezidentské rozhodnutí';

    showToast(`${roleName} bylo odesláno k realizaci.`);
  };

  // Custom AI Directive from Briefing Modal
  const handleCustomAiDirective = (briefingId: string, directiveText: string) => {
    setGameState((prev) => ({
      ...prev,
      overallApproval: Math.min(95, Number((prev.overallApproval + 1.2).toFixed(1))),
      inTray: prev.inTray.map((b) =>
        b.id === briefingId
          ? { ...b, isUnread: false, needsReply: false, repliedOptionId: 'custom-directive' }
          : b
      ),
    }));

    const directiveType = gameState.career.stage === 'mayor'
      ? 'Městská vyhláška'
      : gameState.career.stage === 'governor'
      ? 'Guvernérský výnos'
      : gameState.career.stage === 'senator'
      ? 'Senátní usnesení'
      : 'Prezidentský dekret';

    showToast(`${directiveType} byl(a) zaevidován(a): "${directiveText.slice(0, 45)}..."`);
  };

  // Tax Rate Adjust
  const handleTaxAdjustRate = (taxId: string, delta: number) => {
    setGameState((prev) => {
      const updatedTaxes = prev.taxes.map((t) => {
        if (t.id === taxId) {
          const newRate = Math.max(0, Number((t.currentRate + delta).toFixed(2)));
          const ratio = t.currentRate > 0 ? newRate / t.currentRate : 1;
          const newRevenue = Math.round(t.annualRevenueBillion * (1 + (ratio - 1) * (1 - t.elasticity)));
          return {
            ...t,
            currentRate: newRate,
            annualRevenueBillion: newRevenue,
          };
        }
        return t;
      });

      const totalRev = updatedTaxes.reduce((sum, item) => sum + item.annualRevenueBillion, 0);

      return {
        ...prev,
        taxes: updatedTaxes,
        fiscal: {
          ...prev.fiscal,
          totalRevenueBillion: totalRev,
          deficitBeforeInterestBillion: Math.max(0, prev.fiscal.totalSpendingBillion - totalRev),
        },
      };
    });
  };

  const handleAbolishTax = (taxId: string) => {
    setGameState((prev) => {
      const updatedTaxes = prev.taxes.map((t) =>
        t.id === taxId ? { ...t, currentRate: 0, annualRevenueBillion: 0 } : t
      );
      const totalRev = updatedTaxes.reduce((sum, item) => sum + item.annualRevenueBillion, 0);
      return {
        ...prev,
        taxes: updatedTaxes,
        fiscal: {
          ...prev.fiscal,
          totalRevenueBillion: totalRev,
        },
      };
    });
    showToast('Daň byla zrušena.');
  };

  // Manifesto Pledge Toggle
  const handleTogglePledge = (pledgeId: string) => {
    setGameState((prev) => ({
      ...prev,
      manifestoPledges: prev.manifestoPledges.map((p) =>
        p.id === pledgeId ? { ...p, isCommitted: !p.isCommitted } : p
      ),
    }));
  };

  // Cabinet Assignment
  const handleAssignMinister = (ministerId: string, name: string, faction: string) => {
    setGameState((prev) => ({
      ...prev,
      cabinet: prev.cabinet.map((m) =>
        m.id === ministerId
          ? { ...m, isVacant: false, name, faction, loyalty: 88, competence: 85 }
          : m
      ),
    }));
    showToast(`Ministr ${name} byl jmenován do funkce.`);
  };

  // State margin update
  const handleUpdateStateMargin = (stateCode: string, newMargin: number) => {
    INITIAL_STATES[stateCode] = {
      ...INITIAL_STATES[stateCode],
      demMargin: newMargin,
    };
  };

  // Press conference result
  const handleApplyPressResult = (approvalDelta: number, logHeadline: string) => {
    setGameState((prev) => ({
      ...prev,
      overallApproval: Math.max(15, Math.min(95, Number((prev.overallApproval + approvalDelta).toFixed(1)))),
      fiscal: {
        ...prev.fiscal,
        consumerConfidence: Math.min(100, prev.fiscal.consumerConfidence + 2),
      },
    }));
    showToast(logHeadline);
  };

  // Career Advancement Handler
  const handleAdvanceCareerStage = (nextStage: CareerStage) => {
    const titles: Record<CareerStage, { title: string; office: string; xpAward: number }> = {
      mayor: { title: 'Starosta města Scranton', office: 'Scranton, Pensylvánie', xpAward: 0 },
      governor: { title: 'Guvernér státu Pensylvánie', office: 'Harrisburg, Pensylvánie', xpAward: 1000 },
      senator: { title: 'Senátor Spojených států', office: 'Kapitol, Washington D.C.', xpAward: 1500 },
      president: { title: 'Prezident Spojených států', office: 'Bílý dům, Washington D.C.', xpAward: 2500 },
    };

    const target = titles[nextStage];
    const newInTray = STAGE_IN_TRAYS[nextStage] || gameState.inTray;
    const newCabinet = STAGE_CABINETS[nextStage]?.members || gameState.cabinet;

    setGameState((prev) => ({
      ...prev,
      inTray: newInTray,
      cabinet: newCabinet,
      politician: {
        ...prev.politician,
        title: target.title,
        constituencyOrState: target.office,
      },
      career: {
        ...prev.career,
        stage: nextStage,
        stageTitle: target.title,
        experiencePoints: prev.career.experiencePoints + target.xpAward,
        campaignChestMillion: Number((prev.career.campaignChestMillion * 1.8).toFixed(1)),
      },
    }));

    showToast(`Povýšení schváleno! Převzal jste úřad: ${target.title}.`);
  };

  // Campaign Debate Launcher
  const handleOpenAiCampaignDebate = (stage?: CareerStage) => {
    const current = gameState.career.stage;
    const next: CareerStage = stage || (current === 'mayor' ? 'governor' : current === 'governor' ? 'senator' : 'president');
    setTargetCareerStage(next);
    setIsCampaignDebateOpen(true);
  };

  // Win Election Handler
  const handleWinElection = (newStage: CareerStage) => {
    setIsCampaignDebateOpen(false);
    handleAdvanceCareerStage(newStage);
    showToast(`Gratulujeme! Vítězství ve volbách bylo stvrzeno přísahou.`);
  };

  // Judicial Review Archive
  const handleAddScotusReview = (newReview: ScotusJudicialReview) => {
    setGameState((prev) => ({
      ...prev,
      scotusReviews: [newReview, ...prev.scotusReviews],
      overallApproval: newReview.isStruckDown
        ? Math.max(15, prev.overallApproval - 1.5)
        : Math.min(95, prev.overallApproval + 1.8),
    }));
    showToast(`Nejvyšší soud rozhodl: ${newReview.caseTitle} (${newReview.voteSplit}).`);
  };

  const unreadBriefingsCount = gameState.inTray.filter((b) => b.isUnread && b.needsReply).length;

  // Adapter for CongressView
  const legacyGameStateAdapter: GameState = {
    week: gameState.week,
    weeksUntilElection: 52 - (gameState.week % 52),
    player: {
      name: `${gameState.politician.firstName} ${gameState.politician.lastName}`,
      role: 'Senator',
      party: gameState.politician.party,
      faction: 'Establishment / Moderate',
      homeState: 'PA',
      ideology: { economic: -15, social: -15, foreign: 0 },
      traits: gameState.politician.backstory,
      stats: {
        charisma: gameState.radarStats.charisma,
        policyMastery: gameState.radarStats.intellect,
        whipClout: gameState.radarStats.authority,
        donorAppeal: 80,
        mediaSavvy: 75,
      },
    },
    politicalCapital,
    campaignFundsMillion: 28.5,
    approval: {
      overall: gameState.overallApproval,
      democrats: Math.min(95, gameState.overallApproval + 18),
      republicans: Math.max(5, gameState.overallApproval - 24),
      independents: gameState.overallApproval,
    },
    metrics: {
      gdpGrowth: gameState.fiscal.gdpGrowthRate,
      inflationRate: gameState.fiscal.inflationRate,
      unemploymentRate: gameState.fiscal.unemploymentRate,
      nationalDebtTrillion: Number((gameState.fiscal.totalPublicDebtBillion / 1000).toFixed(2)),
      approvalTrend: [52, 53, 54, gameState.overallApproval],
    },
    congress: {
      senateDem: 51,
      senateRep: 49,
      senateInd: 0,
      houseDem: 221,
      houseRep: 214,
    },
    bills,
    states: INITIAL_STATES,
    gameLog: [],
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Identity & Subtitle */}
          <div className="flex items-center gap-3">
            {subView ? (
              <button
                onClick={() => setSubView(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 transition-colors"
                title="Zpět do přehledu"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-title font-bold text-xs">
                ★
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  {gameState.politician.firstName} {gameState.politician.lastName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
                  {gameState.politician.title}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                <span>{gameState.politician.constituencyOrState}</span>
                <span>·</span>
                <span className="font-mono text-zinc-300">{gameState.dateString}</span>
              </div>
            </div>
          </div>

          {/* Turn Advancement Button */}
          <button
            onClick={handleAdvanceTurn}
            disabled={isAdvancing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{isAdvancing ? 'Počítám týden...' : 'Další týden ➔'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4">
        {/* Render Subview if selected from More menu */}
        {subView === 'congress' ? (
          <CongressView
            gameState={legacyGameStateAdapter}
            onUpdateBills={(newBills) => setBills(newBills)}
            onSpendPoliticalCapital={(amt) => setPoliticalCapital((c) => Math.max(0, c - amt))}
            onAddNews={(h) => showToast(h)}
            onBack={() => setSubView(null)}
          />
        ) : subView === 'taxes' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSubView(null)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2"
            >
              ← Zpět do menu Vše ostatní
            </button>
            <TaxLedgerView
              taxes={gameState.taxes}
              onAdjustTaxRate={handleTaxAdjustRate}
              onAbolishTax={handleAbolishTax}
            />
          </div>
        ) : subView === 'manifesto' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSubView(null)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2"
            >
              ← Zpět do menu Vše ostatní
            </button>
            <ManifestoBuilderView
              pledges={gameState.manifestoPledges}
              onTogglePledge={handleTogglePledge}
              onCommitManifesto={() => showToast('Volební program byl schválen a předán Kongresu.')}
            />
          </div>
        ) : subView === 'legacy' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSubView(null)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2"
            >
              ← Zpět do menu Vše ostatní
            </button>
            <ProfileLegacyView gameState={gameState} />
          </div>
        ) : subView === 'career' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSubView(null)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2"
            >
              ← Zpět do přehledu
            </button>
            <CareerLadderView
              gameState={gameState}
              onAdvanceCareerStage={handleAdvanceCareerStage}
              onOpenAiCampaignDebate={handleOpenAiCampaignDebate}
            />
          </div>
        ) : subView === 'constitution' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSubView(null)}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2"
            >
              ← Zpět do přehledu
            </button>
            <RealLawsConstitutionView
              realLaws={REAL_US_LAWS}
              scotusReviews={gameState.scotusReviews}
              onAddScotusReview={handleAddScotusReview}
            />
          </div>
        ) : (
          /* Render Active Bottom Tab */
          <>
            {activeTab === 'home' && (
              <HomeDashboard
                gameState={gameState}
                onOpenSnapshot={(type) =>
                  setGameState((prev) => ({ ...prev, activeSnapshotModal: type }))
                }
                onOpenBriefing={(briefing) =>
                  setGameState((prev) => ({ ...prev, selectedBriefingId: briefing.id }))
                }
                onOpenCareerLadder={() => setSubView('career')}
                onOpenRealLaws={() => setSubView('constitution')}
                onAdvanceWeek={handleAdvanceTurn}
                isAdvancing={isAdvancing}
              />
            )}

            {activeTab === 'cabinet' && (
              <CabinetView
                cabinet={gameState.cabinet}
                stage={gameState.career.stage}
                onAssignMinister={handleAssignMinister}
              />
            )}

            {activeTab === 'aivelin' && (
              <ExecutiveAiChatView
                gameState={gameState}
                onApplyExecutiveAction={handleApplyExecutiveAction}
              />
            )}

            {activeTab === 'world' && (
              <StateOfNationView
                gameState={gameState}
                stage={gameState.career.stage}
                onUpdateStateMargin={handleUpdateStateMargin}
                onOpenPressConference={() => setIsPressModalOpen(true)}
              />
            )}

            {activeTab === 'more' && (
              <MoreMenuView
                onNavigateTab={(tab) => {
                  setSubView(null);
                  setActiveTab(tab as any);
                }}
                onOpenCongress={() => setSubView('congress')}
                onOpenTaxes={() => setSubView('taxes')}
                onOpenManifesto={() => setSubView('manifesto')}
                onOpenLegacy={() => setSubView('legacy')}
                onOpenCareerLadder={() => setSubView('career')}
                onOpenConstitution={() => setSubView('constitution')}
                onOpenDebtSnapshot={() =>
                  setGameState((prev) => ({ ...prev, activeSnapshotModal: 'debt' }))
                }
                onOpenMediaSnapshot={() =>
                  setGameState((prev) => ({ ...prev, activeSnapshotModal: 'media' }))
                }
                onOpenStatesMap={() => {
                  setSubView(null);
                  setActiveTab('world');
                }}
                onOpenPressConference={() => setIsPressModalOpen(true)}
                onResetGame={() => {
                  setGameState(INITIAL_GAME_STATE);
                  showToast('Založena nová kariéra starosty.');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Metric Detail Modal (Approval, Debt, GDP, Inflation, Unemployment, Media) */}
      {gameState.activeSnapshotModal && (
        <MetricDetailModal
          type={gameState.activeSnapshotModal}
          fiscal={gameState.fiscal}
          demographics={gameState.demographics}
          mediaOutlets={gameState.mediaOutlets}
          overallApproval={gameState.overallApproval}
          onClose={() => setGameState((prev) => ({ ...prev, activeSnapshotModal: null }))}
        />
      )}

      {/* Campaign Election & AI Debate Modal */}
      {isCampaignDebateOpen && (
        <CampaignElectionModal
          currentStage={gameState.career.stage}
          targetStage={targetCareerStage}
          gameState={gameState}
          onClose={() => setIsCampaignDebateOpen(false)}
          onWinElection={handleWinElection}
        />
      )}

      {/* Briefing Memo Detail Modal */}
      {gameState.selectedBriefingId && (
        <BriefingDetailModal
          briefing={gameState.inTray.find((b) => b.id === gameState.selectedBriefingId)!}
          onClose={() => setGameState((prev) => ({ ...prev, selectedBriefingId: null }))}
          onSelectOption={(briefingId: string, optId: string) => handleSelectBriefingOption(briefingId, optId)}
          onSendCustomDirective={async (briefingId: string, directiveText: string) => {
            handleCustomAiDirective(briefingId, directiveText);
          }}
        />
      )}

      {/* Press Conference Modal */}
      {isPressModalOpen && (
        <PressConferenceModal
          gameState={gameState}
          onClose={() => setIsPressModalOpen(false)}
          onApplyPressResult={handleApplyPressResult}
        />
      )}

      {/* Global Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#181822] border border-amber-500/40 text-amber-300 text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar (Dynamic for Mayor / Governor / Senator / President) */}
      {(() => {
        const navLabels: Record<CareerStage, { home: string; cabinet: string; ai: string; world: string; more: string }> = {
          mayor: {
            home: 'Radnice',
            cabinet: 'Správa města',
            ai: 'AI Radní',
            world: 'Město & PA',
            more: 'Kariéra',
          },
          governor: {
            home: 'Kapitol PA',
            cabinet: 'Vláda PA',
            ai: 'AI Štáb PA',
            world: 'Kraje PA',
            more: 'Kariéra',
          },
          senator: {
            home: 'Senát D.C.',
            cabinet: 'Senátní tým',
            ai: 'AI Poradce',
            world: '50 států',
            more: 'Kariéra',
          },
          president: {
            home: 'Domů',
            cabinet: 'Vláda',
            ai: 'AI Velín',
            world: 'Svět & Státy',
            more: 'Více',
          },
        };

        const currentNav = navLabels[gameState.career.stage] || navLabels.mayor;

        return (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-lg border-t border-white/10 h-16">
            <div className="max-w-md mx-auto h-full grid grid-cols-5 items-center px-2">
              {/* 1. Radnice / Kapitol / Senát / Domů */}
              <button
                onClick={() => {
                  setSubView(null);
                  setActiveTab('home');
                }}
                className={`flex flex-col items-center justify-center relative py-1 transition-colors ${
                  activeTab === 'home' && !subView ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="relative">
                  <Inbox className="w-5 h-5" />
                  {unreadBriefingsCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {unreadBriefingsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[68px]">{currentNav.home}</span>
              </button>

              {/* 2. Správa města / Vláda PA / Tým / Vláda */}
              <button
                onClick={() => {
                  setSubView(null);
                  setActiveTab('cabinet');
                }}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'cabinet' && !subView ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[68px]">{currentNav.cabinet}</span>
              </button>

              {/* 3. AI Asistent / AI Štáb / AI Poradce / AI Velín */}
              <button
                onClick={() => {
                  setSubView(null);
                  setActiveTab('aivelin');
                }}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'aivelin' && !subView ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] mt-1 text-amber-300 font-semibold tracking-tight truncate max-w-[68px]">{currentNav.ai}</span>
              </button>

              {/* 4. Město & PA / Kraje PA / 50 států / Svět */}
              <button
                onClick={() => {
                  setSubView(null);
                  setActiveTab('world');
                }}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'world' && !subView ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Globe2 className="w-5 h-5" />
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[68px]">{currentNav.world}</span>
              </button>

              {/* 5. Kariéra / Více */}
              <button
                onClick={() => {
                  setSubView(null);
                  setActiveTab('more');
                }}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  activeTab === 'more' || subView ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Menu className="w-5 h-5" />
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[68px]">{currentNav.more}</span>
              </button>
            </div>
          </nav>
        );
      })()}
    </div>
  );
}
