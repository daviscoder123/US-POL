import React, { useState } from 'react';
import { CabinetMinister, CareerStage } from '../types/game';
import { UserCheck, Shield, Award, Plus, Check, Users, Landmark, Building2, Briefcase } from 'lucide-react';

interface CabinetViewProps {
  cabinet: CabinetMinister[];
  stage?: CareerStage;
  onAssignMinister: (ministerId: string, name: string, faction: string) => void;
}

export const CabinetView: React.FC<CabinetViewProps> = ({ cabinet, stage = 'mayor', onAssignMinister }) => {
  const [selectedSeat, setSelectedSeat] = useState<CabinetMinister | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateFaction, setCandidateFaction] = useState('Středové křídlo');

  const handleConfirmAssignment = () => {
    if (!selectedSeat || !candidateName.trim()) return;
    onAssignMinister(selectedSeat.id, candidateName, candidateFaction);
    setSelectedSeat(null);
    setCandidateName('');
  };

  const stageTitles: Record<CareerStage, { category: string; title: string; subtitle: string; icon: any }> = {
    mayor: {
      category: 'RADNICE MĚSTA SCRANTON · APARÁT STAROSTY',
      title: 'Vedení města Scranton & Městské služby',
      subtitle: 'Městský manažer, velení policie, kontrola rozpočtu radnice a školský obvod.',
      icon: Building2,
    },
    governor: {
      category: 'COMMONWEALTH OF PENNSYLVANIA · STÁTNÍ KAPITOL',
      title: 'Vláda státu Pensylvánie (Commonwealth Executive)',
      subtitle: 'Vedení státních agentur, velitelství Národní gardy PA a státní finance v Harrisburgu.',
      icon: Landmark,
    },
    senator: {
      category: 'KONGRES USA · RUSSELL SENATE OFFICE BUILDING',
      title: 'Senátní legislativní aparát na Kapitolu',
      subtitle: 'Legislativní ředitel, poradci pro výbory a tiskový štáb pro celostátní média.',
      icon: Briefcase,
    },
    president: {
      category: 'BÍLÝ DŮM · ZÁPADNÍ KŘÍDLO',
      title: 'Kabinet prezidenta Spojených států (POTUS)',
      subtitle: 'Ministři federálních resortů, viceprezident a Národní bezpečnostní rada (NSC).',
      icon: Users,
    },
  };

  const currentMeta = stageTitles[stage] || stageTitles.mayor;
  const HeaderIcon = currentMeta.icon;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      <div className="bg-[#12161f] border border-amber-500/20 rounded-2xl p-5 space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-amber-400">
          <HeaderIcon className="w-3.5 h-3.5" />
          <span>{currentMeta.category}</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">
          {currentMeta.title}
        </h1>
        <p className="text-xs text-slate-400">
          {currentMeta.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cabinet.map((seat) => (
          <div
            key={seat.id}
            onClick={() => seat.isVacant && setSelectedSeat(seat)}
            className={`p-4 rounded-2xl border transition-all ${
              seat.isVacant
                ? 'bg-[#151922] border-dashed border-rose-500/40 hover:border-rose-400 cursor-pointer'
                : 'bg-[#12161f] border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-amber-400 shrink-0">
                {seat.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block truncate">
                  {seat.portfolio}
                </span>
                <span className="text-sm font-semibold text-white block truncate">
                  {seat.isVacant ? (
                    <span className="text-rose-400 text-xs">NEOBSAZENO — jmenovat</span>
                  ) : (
                    seat.name
                  )}
                </span>
                {!seat.isVacant && (
                  <span className="text-[11px] text-slate-400 block truncate">{seat.faction}</span>
                )}
              </div>
            </div>

            {!seat.isVacant && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Loajalita: <strong className="text-emerald-400">{seat.loyalty}%</strong></span>
                <span>Odbornost: <strong className="text-sky-400">{seat.competence}%</strong></span>
              </div>
            )}
            <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {seat.bio}
            </p>
          </div>
        ))}
      </div>

      {/* Dialog jmenování člena aparátu */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">
              Jmenovat: {selectedSeat.portfolio}
            </h3>
            <p className="text-xs text-slate-400">
              Vyberte kandidáta pro vedení tohoto federálního úřadu.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jméno a příjmení kandidáta
                </label>
                <input
                  type="text"
                  placeholder="např. Dr. Michael Ross"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Stranická frakce / Odborné zázemí
                </label>
                <select
                  value={candidateFaction}
                  onChange={(e) => setCandidateFaction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Prezidentovi loajalisté">Prezidentovi loajalisté (Vysoká loajalita)</option>
                  <option value="Technokratický expert">Technokratický expert (Vysoká kompetence)</option>
                  <option value="Most k opozici v Senátu">Most k opozici v Senátu (Bipartisanship)</option>
                  <option value="Progresivní křídlo">Progresivní křídlo (Odbory a aktivisté)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSeat(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Zrušit
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={!candidateName.trim()}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50"
              >
                Potvrdit jmenování
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
