import React, { useState } from 'react';
import { ManifestoPledge } from '../types/game';
import { Search, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ManifestoBuilderViewProps {
  pledges: ManifestoPledge[];
  onTogglePledge: (pledgeId: string) => void;
  onCommitManifesto: () => void;
}

export const ManifestoBuilderView: React.FC<ManifestoBuilderViewProps> = ({
  pledges,
  onTogglePledge,
  onCommitManifesto,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPledgeId, setExpandedPledgeId] = useState<string | null>(null);

  const committedCount = pledges.filter((p) => p.isCommitted).length;
  const totalDifficulty = pledges
    .filter((p) => p.isCommitted)
    .reduce((acc, p) => acc + p.difficulty, 0);

  // Credibility calculation: high credibility if 8-15 pledges and balanced difficulty
  let credibility = 85;
  if (committedCount < 8) credibility = Math.max(10, committedCount * 10);
  else if (committedCount > 15) credibility = Math.max(20, 85 - (committedCount - 15) * 8);

  const filteredPledges = pledges.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'Budget' && p.category === 'Budget & Fiscal') ||
      (activeCategory === 'Tax' && p.category === 'Tax') ||
      (activeCategory === 'Laws' && p.category === 'Bills & Laws');

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-amber-500">
          VÁŠ VOLEBNÍ PROGRAM
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mt-0.5">
          Sestavte svůj vládní program
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Zvolte 8–15 závazků, ke kterým se veřejně zavážete. Každý slib bude přísně sledován.
        </p>
      </div>

      {/* Rámeček s radou od šéfky kanceláře - přesně podle screenshotu 15:36 */}
      <div className="bg-[#12161f] border border-amber-500/30 rounded-2xl p-4 flex gap-3 text-xs">
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-amber-400 shrink-0">
          KH
        </div>
        <div>
          <div className="font-semibold text-white">Kate Hollowayová · Šéfka kanceláře</div>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            Sliby se uzamknou ve volebním programu. Pokud je splníte, získáte obrovskou integritu a podporu u cílových voličů. Pokud je porušíte, novináři a opozice vám to okamžitě spočítají.
          </p>
        </div>
      </div>

      {/* 3 Počítadla: Závazky, Důvěryhodnost, Obtížnost - přesně podle screenshotu 15:36 */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 text-center space-y-2">
        <div className="grid grid-cols-3 divide-x divide-slate-800/80 font-mono">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">ZÁVAZKY</div>
            <div className="text-3xl font-bold text-white mt-1">{committedCount}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">DŮVĚRYHODNOST</div>
            <div className={`text-3xl font-bold mt-1 ${credibility >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {credibility}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">OBTÍŽNOST</div>
            <div className="text-3xl font-bold text-slate-200 mt-1">{totalDifficulty}</div>
          </div>
        </div>

        <div className="text-xs text-amber-400/90 font-medium pt-2">
          {committedCount < 8
            ? `Chybí ještě ${8 - committedCount} slibů do minimálního programu`
            : committedCount > 15
            ? 'Příliš mnoho slibů snižuje celkovou důvěryhodnost programu'
            : 'Vyvážený vládní program připravený k uzamčení'}
        </div>
      </div>

      {/* Vyhledávání a kategorie */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Hledat závazky v rozpočtu, daních či zákonech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12161f] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'All', label: 'Vše' },
            { id: 'Budget', label: 'Rozpočet a finance' },
            { id: 'Tax', label: 'Daně' },
            { id: 'Laws', label: 'Zákony a reformy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#12161f] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seznam slibů */}
      <div className="space-y-3">
        {filteredPledges.map((pledge) => {
          const isExpanded = expandedPledgeId === pledge.id;
          return (
            <div
              key={pledge.id}
              className={`bg-[#12161f] border rounded-2xl p-4 transition-all ${
                pledge.isCommitted
                  ? 'border-amber-500/80 shadow-md shadow-amber-500/5'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedPledgeId(isExpanded ? null : pledge.id)}
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500">
                    {pledge.category}
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-0.5">{pledge.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {isExpanded && (
                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-3 text-xs">
                  <p className="text-slate-300 leading-relaxed">{pledge.description}</p>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-slate-400 italic">
                    {pledge.impactSummary}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-mono text-slate-400">
                      Obtížnost prosazení: <strong className="text-amber-400">{pledge.difficulty} b.</strong>
                    </span>

                    <button
                      onClick={() => onTogglePledge(pledge.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        pledge.isCommitted
                          ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                      }`}
                    >
                      {pledge.isCommitted ? 'Odebrat z programu' : 'Přidat do programu'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spodní akční tlačítko pro uzamčení manifestu */}
      <div className="sticky bottom-4 pt-4">
        <button
          onClick={onCommitManifesto}
          disabled={committedCount < 8}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl transition-all"
        >
          {committedCount < 8
            ? `Vyberte ještě alespoň ${8 - committedCount} slibů`
            : `Potvrdit a uzamknout vládní program (${committedCount} slibů)`}
        </button>
      </div>
    </div>
  );
};
