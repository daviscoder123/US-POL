import React, { useState } from 'react';
import { InTrayBriefing } from '../types/game';
import { ArrowLeft, Check, Sparkles, Send } from 'lucide-react';

interface BriefingDetailModalProps {
  briefing: InTrayBriefing;
  onClose: () => void;
  onSelectOption: (briefingId: string, optionId: string) => void;
  onSendCustomDirective: (briefingId: string, directiveText: string) => Promise<void>;
}

export const BriefingDetailModal: React.FC<BriefingDetailModalProps> = ({
  briefing,
  onClose,
  onSelectOption,
  onSendCustomDirective,
}) => {
  const [customText, setCustomText] = useState('');
  const [isSendingCustom, setIsSendingCustom] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleCustomSubmit = async () => {
    if (!customText.trim()) return;
    setIsSendingCustom(true);
    try {
      await onSendCustomDirective(briefing.id, customText);
      setAiFeedback('Prezidentský pokyn byl předán kabinetu a zaznamenán vládním tajemníkem.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingCustom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#0c0f14] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl relative my-auto">
        {/* Tlačítko Zpět */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Zpět na doručenou poštu</span>
        </button>

        {/* Hlavička memoranda */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              {briefing.category}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Od: {briefing.senderName} ({briefing.senderTitle})
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white leading-snug">
            {briefing.title}
          </h1>
        </div>

        {/* Text memoranda */}
        <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
          {briefing.fullMemo}
        </div>

        {/* Možnosti rozhodnutí */}
        {briefing.needsReply && !briefing.repliedOptionId && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              PREZIDENTSKÉ ROZHODNUTÍ (VYBERTE MOŽNOST)
            </div>

            <div className="space-y-2.5">
              {briefing.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption(briefing.id, opt.id)}
                  className="w-full text-left p-4 rounded-xl bg-[#141923] hover:bg-[#1a2130] border border-slate-800 hover:border-amber-500/50 transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                      {opt.label}
                    </span>
                    {opt.approvalDelta !== undefined && (
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        +{opt.approvalDelta}% podpora
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{opt.description}</p>
                  <div className="text-[11px] text-amber-400/80 italic pt-1 border-t border-slate-800/60">
                    Dopad: {opt.consequenceNotes}
                  </div>
                </button>
              ))}
            </div>

            {/* Vlastní pokyn přes AI */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Nebo napište vlastní prezidentský pokyn pro poradce (AI analýza):</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="např. Připravte kompromisní návrh se zástupci odborů i byznysu..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={isSendingCustom || !customText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingCustom ? 'Odesílám...' : 'Vydat pokyn'}</span>
                </button>
              </div>
              {aiFeedback && (
                <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg mt-2">
                  {aiFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {briefing.repliedOptionId && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Toto memorandum již bylo vyřešeno a pokyny byly předány do realizace.</span>
          </div>
        )}
      </div>
    </div>
  );
};
