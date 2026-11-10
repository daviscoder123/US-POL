import React, { useState, useEffect } from 'react';
import { AdvancedGameState } from '../types/game';
import {
  Radio,
  Mic,
  Sparkles,
  Send,
  X,
  AlertCircle,
  Award,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PressQuestion {
  id: string;
  reporter: string;
  outlet: string;
  question: string;
  category: string;
  suggestedAnswers: {
    label: string;
    description: string;
    ideologyShift: { capitalChange: number; approvalDelta: number };
  }[];
}

interface PressConferenceModalProps {
  gameState: AdvancedGameState;
  onClose: () => void;
  onApplyPressResult: (approvalDelta: number, logHeadline: string) => void;
}

export const PressConferenceModal: React.FC<PressConferenceModalProps> = ({
  gameState,
  onClose,
  onApplyPressResult,
}) => {
  const [questions, setQuestions] = useState<PressQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [customAnswer, setCustomAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      try {
        const res = await fetch('/api/ai/press-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerRole: gameState.politician.title,
            playerParty: gameState.politician.party,
            approval: gameState.overallApproval,
            week: gameState.week,
            gdpGrowth: gameState.fiscal.gdpGrowthRate,
            inflationRate: gameState.fiscal.inflationRate,
            lastEvent: `Stav federálního dluhu ${gameState.fiscal.debtGdpPercent} % HDP a projednávání rozpočtu v Kongresu`,
          }),
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(getFallbackQuestions());
        }
      } catch (err) {
        setQuestions(getFallbackQuestions());
      } finally {
        setIsLoadingQuestions(false);
      }
    }
    fetchQuestions();
  }, [gameState.week]);

  function getFallbackQuestions(): PressQuestion[] {
    return [
      {
        id: 'q1',
        reporter: 'Rachel Kelly',
        outlet: 'The Washington Post',
        question: `Vážená paní prezidentko, federální dluh dosahuje 89,4 % HDP a inflace zůstává citlivým tématem pro rodiny. Jak hodláte obhájit plánované výdajové balíčky před daňovými poplatníky?`,
        category: 'Hospodářství',
        suggestedAnswers: [
          {
            label: 'Zdůraznit dlouhodobé investice a růst mezd',
            description: 'Vysvětlit, že investice do infrastruktury a domácí výroby čipů sníží náklady rodin.',
            ideologyShift: { capitalChange: 2, approvalDelta: 1.2 },
          },
          {
            label: 'Oznámit přísný audit federálních výdajů',
            description: 'Ujistit veřejnost, že každé ušetřené ministerstvo pomůže stabilizovat rozpočet.',
            ideologyShift: { capitalChange: 1, approvalDelta: 1.5 },
          },
        ],
      },
      {
        id: 'q2',
        reporter: 'David Vance',
        outlet: 'Fox News Channel',
        question: `Kritici v Senátu tvrdí, že vaše administrativa ustupuje nátlaku radikálního křídla a ohrožuje bezpečnost jižní hranice. Co odpovíte voličům v Texasu a Arizoně?`,
        category: 'Bezpečnost',
        suggestedAnswers: [
          {
            label: 'Zvýšit federální financování pohraniční stráže',
            description: 'Poukázat na konkrétní počty agentů a moderní radarové systémy.',
            ideologyShift: { capitalChange: 3, approvalDelta: 1.0 },
          },
          {
            label: 'Apelovat na oboustrannou dohodu v Kongresu',
            description: 'Vyzvat opozici k okamžitému schválení balíčku pro azylové soudy.',
            ideologyShift: { capitalChange: 0, approvalDelta: 0.6 },
          },
        ],
      },
    ];
  }

  const currentQ = questions[currentQIndex];

  const handleSelectSuggested = (answer: PressQuestion['suggestedAnswers'][0]) => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvalResult({
        grade: 'A-',
        pressReaction: `Tiskový sál Bílého domu přijal odpověď s respektem. Novináři ocenili konkrétní argumenty.`,
        approvalDelta: answer.ideologyShift.approvalDelta,
        capitalDelta: answer.ideologyShift.capitalChange,
        punditQuote: `„Prezidentka prokázala pevnost a schopnost uklidnit středové voliče.“ — CNN Tonight`,
      });
      setIsEvaluating(false);
    }, 600);
  };

  const handleCustomSubmit = async () => {
    if (!customAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/evaluate-press-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          answer: customAnswer,
          reporter: currentQ.reporter,
          outlet: currentQ.outlet,
          playerRole: gameState.politician.title,
          playerParty: gameState.politician.party,
        }),
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      setEvalResult({
        grade: 'B+',
        pressReaction: 'Vaše přímá reakce zazněla ve všech večerních zprávách.',
        approvalDelta: 1.2,
        capitalDelta: 2,
        punditQuote: '„Výrazný a autentický projev z Oválné pracovny.“',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishQuestion = () => {
    if (evalResult) {
      onApplyPressResult(
        evalResult.approvalDelta || 0,
        `Tisková konference: ${currentQ?.outlet} — známka ${evalResult.grade}`
      );
    }
    setEvalResult(null);
    setCustomAnswer('');
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-serif-title">
              Tiskový sál Bílého domu (James S. Brady Press Briefing Room)
            </h2>
            <p className="text-xs text-zinc-400">
              Předstupte před akreditované novináře a čelte otázkám národních médií.
            </p>
          </div>
        </div>

        {isLoadingQuestions ? (
          <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span>Novináři se usazují v tiskovém sále Bílého domu...</span>
          </div>
        ) : currentQ ? (
          <div className="space-y-4">
            {/* Question Card */}
            <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">
                  {currentQ.reporter} · <span className="text-white">{currentQ.outlet}</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {currentQ.category}
                </span>
              </div>
              <p className="text-sm text-zinc-200 italic leading-relaxed">
                „{currentQ.question}“
              </p>
            </div>

            {/* Answer Result Callout */}
            {evalResult ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Hodnocení odpovědi: Známka {evalResult.grade}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {evalResult.approvalDelta >= 0 ? `+${evalResult.approvalDelta}%` : `${evalResult.approvalDelta}%`} podpora
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{evalResult.pressReaction}</p>
                {evalResult.punditQuote && (
                  <p className="text-xs italic text-amber-300/90 font-serif">
                    {evalResult.punditQuote}
                  </p>
                )}
                <button
                  onClick={handleFinishQuestion}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all mt-2"
                >
                  {currentQIndex + 1 < questions.length ? 'Přejít na další otázku novináře ➔' : 'Ukončit tiskovou konferenci ✕'}
                </button>
              </div>
            ) : (
              /* Answer Options */
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-400 block uppercase tracking-wider">
                  Zvolte strategickou odpověď nebo formulujte vlastní:
                </span>

                <div className="space-y-2">
                  {currentQ.suggestedAnswers?.map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggested(ans)}
                      disabled={isEvaluating}
                      className="w-full p-3 rounded-xl bg-[#18181f] hover:bg-[#202029] border border-white/10 text-left transition-all disabled:opacity-50 space-y-1 group"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {ans.label}
                      </div>
                      <div className="text-[11px] text-zinc-400">{ans.description}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Answer Input */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[11px] font-medium text-zinc-400 block">
                    Nebo napište vlastní autentickou odpověď prezidentky:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      placeholder="Napište přesnou formulaci odpovědi..."
                      disabled={isEvaluating}
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleCustomSubmit}
                      disabled={!customAnswer.trim() || isEvaluating}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md disabled:opacity-40"
                    >
                      {isEvaluating ? 'Hodnocení...' : 'Odpovědět'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-zinc-400">
            Tisková konference pro tento týden skončila.
          </div>
        )}
      </div>
    </div>
  );
};
