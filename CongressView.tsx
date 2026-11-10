import React, { useState } from 'react';
import { Bill, GameState, BillCategory } from '../types/game';
import { simulateCongressionalVote } from '../game/simulation';
import { Vote, PlusCircle, CheckCircle2, XCircle, Sparkles, FileText, ArrowRight, Clock } from 'lucide-react';

interface CongressViewProps {
  gameState: GameState;
  onUpdateBills: (bills: Bill[]) => void;
  onSpendPoliticalCapital: (amount: number) => void;
  onAddNews: (headline: string, snippet: string, sentiment: 'positive' | 'critical' | 'breaking') => void;
  onBack?: () => void;
}

export const CongressView: React.FC<CongressViewProps> = ({
  gameState,
  onUpdateBills,
  onSpendPoliticalCapital,
  onAddNews,
  onBack,
}) => {
  const { bills, congress, player, politicalCapital } = gameState;

  // Custom Bill Modal & State
  const [isDrafting, setIsDrafting] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<BillCategory>('Economy');
  const [customSummary, setCustomSummary] = useState('');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Voting Simulation State
  const [votingBillId, setVotingBillId] = useState<string | null>(null);
  const [lastVoteResult, setLastVoteResult] = useState<any | null>(null);
  const [whipCapitalToSpend, setWhipCapitalToSpend] = useState(10);

  // AI Bill Analysis call
  const handleAnalyzeBillWithAi = async () => {
    if (!customTitle.trim()) return;
    setIsAnalyzingAi(true);
    try {
      const res = await fetch('/api/ai/bill-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle,
          category: customCategory,
          summary: customSummary,
          playerRole: player.role,
          playerParty: player.party,
        }),
      });
      const data = await res.json();
      setAiAnalysisResult(data);
    } catch (err) {
      console.error('Error analyzing bill with AI:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Submit custom bill to the floor
  const handleIntroduceBill = () => {
    if (!customTitle.trim()) return;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      title: customTitle,
      sponsor: `${player.name} (${player.party[0]}-${player.homeState})`,
      category: customCategory,
      summary: customSummary || 'Proposed legislative measure introduced by the player.',
      economicCostBillion: aiAnalysisResult?.economicCostBillion ?? 120,
      economicImpactRating: aiAnalysisResult?.economicImpactRating ?? 'Moderate Growth',
      ideologyAlignment: {
        economic: player.ideology.economic,
        social: player.ideology.social,
      },
      senateVotes: { yeas: 0, nays: 0, required: 60 },
      houseVotes: { yeas: 0, nays: 0, required: 218 },
      status: 'Senate Floor',
      demSupport: aiAnalysisResult?.demSupport ?? 85,
      repSupport: aiAnalysisResult?.repSupport ?? 25,
      publicSupport: aiAnalysisResult?.publicSupport ?? 60,
      isPlayerSponsored: true,
      aiAnalysis: aiAnalysisResult?.analysis,
    };

    onUpdateBills([newBill, ...bills]);
    onAddNews(
      aiAnalysisResult?.headline || `Nový legislativní návrh: "${customTitle}" zamířil do Senátu`,
      `Zákonodárce ${player.name} oficiálně předložil návrh zákona, který nyní čelí hlasování na plénu.`,
      'breaking'
    );

    // Reset draft state
    setCustomTitle('');
    setCustomSummary('');
    setAiAnalysisResult(null);
    setIsDrafting(false);
  };

  // Execute roll-call vote
  const handleRollCallVote = (bill: Bill) => {
    if (politicalCapital < whipCapitalToSpend) {
      alert('Nemáte dostatek politického kapitálu k vyjednávání!');
      return;
    }

    onSpendPoliticalCapital(whipCapitalToSpend);

    const voteOutcome = simulateCongressionalVote(bill, congress, player, whipCapitalToSpend);
    setLastVoteResult({
      billTitle: bill.title,
      ...voteOutcome,
    });

    const updatedBills = bills.map((b) => {
      if (b.id === bill.id) {
        return {
          ...b,
          senateVotes: { ...b.senateVotes, yeas: voteOutcome.senateYeas, nays: voteOutcome.senateNays },
          houseVotes: { ...b.houseVotes, yeas: voteOutcome.houseYeas, nays: voteOutcome.houseNays },
          status: (voteOutcome.passedBoth ? 'Enacted' : 'Failed') as Bill['status'],
        };
      }
      return b;
    });

    onUpdateBills(updatedBills);

    if (voteOutcome.passedBoth) {
      onAddNews(
        `Historický úspěch: Zákon "${bill.title}" úspěšně prošel Kongresem!`,
        voteOutcome.notes,
        'positive'
      );
    } else {
      onAddNews(
        `Zákon "${bill.title}" zablokován v Kongresu`,
        voteOutcome.notes,
        'critical'
      );
    }
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <span>← Zpět do menu Vše ostatní</span>
        </button>
      )}

      {/* Header Deck */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Vote className="w-4 h-4" />
            <span>Zákonodárný proces & Hlasování v Kongresu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-100 mt-1">
            Kapitol Spojených států amerických
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Navrhujte federální zákony, analyzujte dopady pomocí AI CBO scoringu a přesvědčujte zákonodárce k překonání filibusteru (60 hlasů v Senátu).
          </p>
        </div>

        <button
          onClick={() => setIsDrafting(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Navrhnout nový zákon (AI Drafter)</span>
        </button>
      </div>

      {/* Last Vote Outcome Callout */}
      {lastVoteResult && (
        <div
          className={`p-4 rounded-xl border ${
            lastVoteResult.passedBoth
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-100'
              : 'bg-rose-950/40 border-rose-800 text-rose-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              {lastVoteResult.passedBoth ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
              <span>
                Výsledek hlasování: {lastVoteResult.passedBoth ? 'SCHVÁLENO A PODEPSÁNO' : 'ZABLOKOVÁNO V KONGRESU'}
              </span>
            </div>
            <button
              onClick={() => setLastVoteResult(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Zavřít hlášení ✕
            </button>
          </div>
          <p className="text-xs mt-1.5 opacity-90">{lastVoteResult.notes}</p>
          <div className="mt-2 flex gap-4 text-xs font-mono">
            <span>Senát: {lastVoteResult.senateYeas} Pro / {lastVoteResult.senateNays} Proti</span>
            <span>Sněmovna: {lastVoteResult.houseYeas} Pro / {lastVoteResult.houseNays} Proti</span>
          </div>
        </div>
      )}

      {/* Active Bills List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Aktivní návrhy zákonů (Bills on the Docket)
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {bills.map((bill) => {
            const isEnacted = bill.status === 'Enacted';
            const isFailed = bill.status === 'Failed';
            const isPending = !isEnacted && !isFailed;

            return (
              <div
                key={bill.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {bill.category}
                    </span>
                    <span className="text-xs text-slate-400">Předkladatel: {bill.sponsor}</span>
                    {bill.isPlayerSponsored && (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-bold">
                        Váš návrh
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold self-start sm:self-auto ${
                      isEnacted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isFailed
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-sky-950 text-sky-400 border border-sky-800 animate-pulse'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">{bill.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{bill.summary}</p>
                  {bill.aiAnalysis && (
                    <div className="mt-2 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <strong className="text-amber-400 font-medium">CBO & AI Hodnocení: </strong>
                      {bill.aiAnalysis}
                    </div>
                  )}
                </div>

                {/* Score & Support Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Rozpočtový dopad (10 let):</span>
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        bill.economicCostBillion > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {bill.economicCostBillion > 0 ? `+$${bill.economicCostBillion}B výdaje` : `-$${Math.abs(bill.economicCostBillion)}B úspory`}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">CBO Rating:</span>
                    <span className="font-semibold text-slate-200">{bill.economicImpactRating}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Stranická podpora:</span>
                    <span className="font-mono text-sky-400">Dem {bill.demSupport}%</span> ·{' '}
                    <span className="font-mono text-rose-400">Rep {bill.repSupport}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Podpora veřejnosti:</span>
                    <span className="font-mono font-semibold text-amber-400 tabular-nums">{bill.publicSupport}%</span>
                  </div>
                </div>

                {/* Action Row for Pending Bills */}
                {isPending && (
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">Kapitál na přesvědčování kolegů (Whip):</span>
                      <select
                        value={whipCapitalToSpend}
                        onChange={(e) => setWhipCapitalToSpend(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                      >
                        <option value={0}>0 bodů (Základní disciplína)</option>
                        <option value={10}>10 bodů (+10% loajalita)</option>
                        <option value={20}>20 bodů (+20% masivní lobbing)</option>
                      </select>
                      <span className="text-slate-400 text-[11px]">Dostupný kapitál: {politicalCapital}</span>
                    </div>

                    <button
                      onClick={() => handleRollCallVote(bill)}
                      className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Vote className="w-4 h-4" />
                      <span>Hlasovat na plénu Kongresu</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Bill Drafter Modal */}
      {isDrafting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-serif-title text-slate-100">
                  Navrhnout federální zákon (AI CBO Drafter)
                </h3>
              </div>
              <button
                onClick={() => setIsDrafting(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Název zákona</label>
                <input
                  type="text"
                  placeholder="např. Clean Energy & High-Tech Manufacturing Independence Act"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Oblast politiky</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as BillCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Economy">Hospodářství a daně (Economy)</option>
                  <option value="Healthcare">Zdravotnictví (Healthcare)</option>
                  <option value="Immigration">Imigrace a hranice (Immigration)</option>
                  <option value="Climate & Energy">Klima a energetika (Climate & Energy)</option>
                  <option value="Defense">Obrana a bezpečnost (Defense)</option>
                  <option value="Tech & AI">Technologie a AI (Tech & AI)</option>
                  <option value="Civil Rights">Občanská práva (Civil Rights)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Klíčová ustanovení a cíl zákona (Summary)
                </label>
                <textarea
                  rows={3}
                  placeholder="Popište konkrétní rozpočtová a regulační opatření tohoto zákona..."
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* AI Analysis Trigger */}
              <button
                type="button"
                onClick={handleAnalyzeBillWithAi}
                disabled={isAnalyzingAi || !customTitle.trim()}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isAnalyzingAi
                    ? 'AI simuluje rozpočtový dopad (CBO)...'
                    : 'Analyzovat návrh zákona pomocí AI (CBO Scoring)'}
                </span>
              </button>

              {/* AI Result Card */}
              {aiAnalysisResult && (
                <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-300 font-semibold">
                    <span>Hodnocení Rozpočtového úřadu Kongresu (CBO):</span>
                    <span className="font-mono">
                      {aiAnalysisResult.economicCostBillion > 0
                        ? `+$${aiAnalysisResult.economicCostBillion}B výdaje`
                        : `-$${Math.abs(aiAnalysisResult.economicCostBillion)}B úspory`}
                    </span>
                  </div>
                  <p className="text-slate-300">{aiAnalysisResult.analysis}</p>
                  <div className="flex gap-4 pt-1 font-mono text-[11px] text-slate-400">
                    <span className="text-sky-400">Podpora Dem: {aiAnalysisResult.demSupport}%</span>
                    <span className="text-rose-400">Podpora Rep: {aiAnalysisResult.repSupport}%</span>
                    <span className="text-amber-400">Veřejnost: {aiAnalysisResult.publicSupport}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 italic mt-1">
                    Titulek v médiích: "{aiAnalysisResult.headline}"
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsDrafting(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Zrušit
              </button>
              <button
                onClick={handleIntroduceBill}
                disabled={!customTitle.trim()}
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50"
              >
                Předložit do Kongresu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
