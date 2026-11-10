import React, { useState } from 'react';
import { CareerStage, AdvancedGameState } from '../types/game';
import {
  Vote,
  Radio,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  TrendingUp,
  TrendingDown,
  Flag,
  ArrowRight
} from 'lucide-react';

interface CampaignElectionModalProps {
  currentStage: CareerStage;
  targetStage: CareerStage;
  gameState: AdvancedGameState;
  onClose: () => void;
  onWinElection: (newStage: CareerStage) => void;
}

export const CampaignElectionModal: React.FC<CampaignElectionModalProps> = ({
  currentStage,
  targetStage,
  gameState,
  onClose,
  onWinElection,
}) => {
  const [step, setStep] = useState<'debate' | 'voting' | 'victory'>('debate');
  const [playerArgument, setPlayerArgument] = useState('');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [debateScore, setDebateScore] = useState<{
    rebuttal: string;
    shift: number;
    winner: string;
  } | null>(null);

  // Voting simulation state
  const [playerVotesPercent, setPlayerVotesPercent] = useState(53.4);
  const [opponentVotesPercent, setOpponentVotesPercent] = useState(46.6);
  const [countedPercent, setCountedPercent] = useState(0);

  const stageNames: Record<CareerStage, string> = {
    mayor: 'Starosta města',
    governor: 'Guvernér státu Pensylvánie',
    senator: 'Senátor Spojených států',
    president: 'Prezident Spojených států (POTUS)',
  };

  const opponentName = gameState.politician.oppositionLeader.name || 'James C. Sterling';

  const debateTopic =
    targetStage === 'governor'
      ? 'Hospodářský růst státu, energetická nezávislost a financování školství'
      : targetStage === 'senator'
      ? 'Federální rozpočet, potvrzování soudců SCOTUS a obranná strategie'
      : 'Boj s inflací, mezinárodní krize a vedení svobodného světa z Oválné pracovny';

  const handleRunDebate = async (statementText?: string) => {
    const textToUse = statementText || playerArgument;
    if (!textToUse.trim()) return;

    setIsAiEvaluating(true);

    try {
      const res = await fetch('/api/ai/debate-round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: debateTopic,
          playerStatement: textToUse,
          opponentName,
          opponentParty: gameState.politician.party === 'Democratic' ? 'Republican' : 'Democratic',
          playerParty: gameState.politician.party,
        }),
      });

      const data = await res.json();
      setDebateScore({
        rebuttal: data.opponentRebuttal || `„Můj oponent nabízí líbivá hesla, ale rozpočtová realita neodpouští. Američané potřebují fiskální disciplínu a bezpečí.“`,
        shift: data.pollingShift || 2.4,
        winner: data.snapPollWinner || gameState.politician.firstName,
      });
    } catch (err) {
      setDebateScore({
        rebuttal: `„Můj oponent nabízí líbivá hesla, ale rozpočtová realita neodpouští. Američané potřebují odpovědné vedení a nižší daně.“`,
        shift: 2.1,
        winner: gameState.politician.firstName,
      });
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const handleStartVoteCount = () => {
    setStep('voting');
    setCountedPercent(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCountedPercent(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('victory');
        }, 800);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-amber-400">Volební kampaň</span>
            <h2 className="text-lg font-bold font-serif-title text-white">
              Kandidatura na post: {stageNames[targetStage]}
            </h2>
          </div>
        </div>

        {/* Step 1: Debate */}
        {step === 'debate' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-mono">Téma televizní debaty:</span>
              <p className="text-sm font-semibold text-white">{debateTopic}</p>
            </div>

            {debateScore ? (
              <div className="p-4 bg-[#181824] rounded-xl border border-amber-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-amber-400">Vítěz televizní debaty podle bleskového průzkumu:</span>
                  <span className="text-emerald-400">+{debateScore.shift}% posun</span>
                </div>
                <p className="text-xs text-zinc-300 italic">
                  <strong>Oponent {opponentName}: </strong>
                  {debateScore.rebuttal}
                </p>
                <button
                  onClick={handleStartVoteCount}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all mt-2"
                >
                  Přejít k volební noci a sčítání hlasů ➔
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-medium text-zinc-300 block">
                  Vyberte strategický postoj v přímém přenosu:
                </span>

                <div className="space-y-2">
                  <button
                    onClick={() => handleRunDebate('Zdůraznit zkušenosti z komunální politiky, splacený dluh a konkrétní výsledky pro rodiny')}
                    disabled={isAiEvaluating}
                    className="w-full p-3 rounded-xl bg-[#18181f] hover:bg-[#22222c] border border-white/10 text-left text-xs text-white transition-all space-y-0.5"
                  >
                    <span className="font-bold text-amber-300 block">Apel na praktické výsledky z terénu</span>
                    <span className="text-zinc-400 text-[11px]">Zdůraznit hospodářské investice, nové fabriky a spolehlivost.</span>
                  </button>

                  <button
                    onClick={() => handleRunDebate('Ostře napadnout oponenta za vazby na lobbisty a neschopnost nabídnout vizi pro pracující třídu')}
                    disabled={isAiEvaluating}
                    className="w-full p-3 rounded-xl bg-[#18181f] hover:bg-[#22222c] border border-white/10 text-left text-xs text-white transition-all space-y-0.5"
                  >
                    <span className="font-bold text-rose-300 block">Ofenzivní střet s oponentem</span>
                    <span className="text-zinc-400 text-[11px]">Zaútočit na nečinnost opozice a obhájit zájmy běžných daňových poplatníků.</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[11px] text-zinc-400 block">Nebo zadejte vlastní projev:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={playerArgument}
                      onChange={(e) => setPlayerArgument(e.target.value)}
                      placeholder="Napište přesný argument pro televizní diváky..."
                      disabled={isAiEvaluating}
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleRunDebate()}
                      disabled={!playerArgument.trim() || isAiEvaluating}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-40"
                    >
                      {isAiEvaluating ? 'AI simuluje...' : 'Obhájit'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Voting Count Animation */}
        {step === 'voting' && (
          <div className="py-8 text-center space-y-4">
            <Radio className="w-8 h-8 text-amber-400 animate-pulse mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white font-serif-title">
                Volební noc · Živé sčítání hlasů
              </h3>
              <p className="text-xs text-zinc-400">
                Sečteno: <strong className="text-white font-mono">{countedPercent} % okrsků</strong>
              </p>
            </div>

            <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden max-w-sm mx-auto">
              <div
                style={{ width: `${countedPercent}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
              />
            </div>

            <div className="flex justify-around max-w-xs mx-auto text-xs font-mono pt-2">
              <div>
                <span className="text-zinc-500 block">Vy:</span>
                <span className="text-lg font-bold text-sky-400">{playerVotesPercent}%</span>
              </div>
              <div>
                <span className="text-zinc-500 block">{opponentName}:</span>
                <span className="text-lg font-bold text-rose-400">{opponentVotesPercent}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Victory Screen */}
        {step === 'victory' && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-wider">
                Volební vítězství potvrzeno!
              </span>
              <h3 className="text-xl font-bold font-serif-title text-white">
                Byl jste zvolen do úřadu: {stageNames[targetStage]}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Voličský mandát byl potvrzen. Váš aparát přebírá nové pravomoci, vyšší rozpočtovou odpovědnost a možnost ovlivňovat celonárodní politiku.
              </p>
            </div>

            <button
              onClick={() => onWinElection(targetStage)}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xl transition-all"
            >
              Složit slavnostní přísahu a převzít úřad ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
