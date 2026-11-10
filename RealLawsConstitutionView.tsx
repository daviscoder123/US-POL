import React, { useState } from 'react';
import { RealUsLaw, ScotusJustice, ScotusJudicialReview } from '../types/game';
import { SCOTUS_JUSTICES } from '../data/initialData';
import {
  Scale,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Gavel,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface RealLawsConstitutionViewProps {
  realLaws: RealUsLaw[];
  scotusReviews: ScotusJudicialReview[];
  onAddScotusReview: (review: ScotusJudicialReview) => void;
}

export const RealLawsConstitutionView: React.FC<RealLawsConstitutionViewProps> = ({
  realLaws,
  scotusReviews,
  onAddScotusReview,
}) => {
  const [activeTab, setActiveTab] = useState<'laws' | 'scotus' | 'articles'>('laws');
  const [selectedLawId, setSelectedLawId] = useState<string | null>(realLaws[0]?.id || null);
  const [isTestingConstitutionality, setIsTestingConstitutionality] = useState(false);
  const [customDecreeForTest, setCustomDecreeForTest] = useState('');

  const selectedLaw = realLaws.find((l) => l.id === selectedLawId) || realLaws[0];

  const handleTestConstitutionality = async (lawTitle: string, summary: string) => {
    setIsTestingConstitutionality(true);

    try {
      const prompt = `Jsi White House Counsel a ústavní expert analyzující soulad zákona/dekretu s Ústavou Spojených států amerických a judikaturou Nejvyššího soudu USA (SCOTUS).
Aktuální složení SCOTUS: 6 konzervativních soudců (Roberts, Thomas, Alito, Gorsuch, Kavanaugh, Barrett) a 3 liberální soudkyně (Sotomayor, Kagan, Jackson).
Zákon/Dekret: "${lawTitle}"
Obsah: "${summary}"

Proveď ústavní přezkum (Judicial Review). Zhodnoť:
1. Který článek či dodatek Ústavy USA je dotčen (Článek I výdajová pravomoc, Článek II exekutiva, 1. dodatek, 2. dodatek, 10. dodatek práva států, 14. dodatek, nebo doktrína zásadních otázek Major Questions).
2. Jak by hlasoval Nejvyšší soud (poměr hlasů, např. 6-3, 5-4, 9-0).
3. Zda obstojí, nebo bude zrušen (isStruckDown).

Vrať POUZE platný JSON ve formátu:
{
  "caseTitle": "string (název hypotetického sporu, např. State of Texas v. United States)",
  "plaintiff": "string (žalobce)",
  "constitutionalIssue": "string (1-2 věty o ústavním střetu)",
  "majorityOpinion": "string (2-3 věty odůvodnění většinového stanoviska SCOTUS)",
  "voteSplit": "string (např. 6-3 nebo 5-4)",
  "isStruckDown": boolean
}`;

      const res = await fetch('/api/ai/bill-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `SCOTUS Review: ${lawTitle}`,
          category: 'Civil Rights',
          summary: prompt,
          playerRole: 'White House Counsel',
          playerParty: 'Nonpartisan',
        }),
      });

      const data = await res.json();

      const newReview: ScotusJudicialReview = {
        id: `scotus-${Date.now()}`,
        caseTitle: data.headline || `Stát Texas v. Federální vláda USA (${lawTitle})`,
        plaintiff: 'Koalice generálních prokurátorů států a občanských svazů',
        constitutionalIssue: `Přezkum ústavnosti podle Článku I, Oddílu 8 a 10. dodatku Ústavy USA.`,
        majorityOpinion: data.analysis || `Nejvyšší soud potvrdil, že opatření spadá pod pravomoc Kongresu a prezidenta regulovat mezistátní obchod.`,
        voteSplit: '6-3',
        isStruckDown: false,
        dateDecided: 'Dnes, Nejvyšší soud USA',
      };

      onAddScotusReview(newReview);
    } catch (err) {
      const fallbackReview: ScotusJudicialReview = {
        id: `scotus-${Date.now()}`,
        caseTitle: `State of Ohio v. United States (${lawTitle})`,
        plaintiff: 'Koalice 14 států vedená generálním prokurátorem Ohia',
        constitutionalIssue: 'Přezkum pravomocí federální exekutivy podle 10. dodatku Ústavy USA.',
        majorityOpinion: 'Soud těsnou většinou 5-4 potvrdil, že Kongres výslovně zmocnil prezidenta k realizaci tohoto opatření v souladu s Commerce Clause.',
        voteSplit: '5-4 (Většina Roberts, Kavanaugh, Barrett, Sotomayor, Kagan)',
        isStruckDown: false,
        dateDecided: 'Dnes, Nejvyšší soud USA',
      };
      onAddScotusReview(fallbackReview);
    } finally {
      setIsTestingConstitutionality(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
            <Scale className="w-4 h-4" />
            <span>Ústava Spojených států amerických & Reálné zákony</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-white mt-1">
            Zákonodárství USA a Nejvyšší soud (SCOTUS)
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Skutečné historicky prosazené federální zákony a ústavní testy před 9 soudci Nejvyššího soudu.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#121217] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('laws')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'laws' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Reálné zákony USA
          </button>
          <button
            onClick={() => setActiveTab('scotus')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'scotus' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Nejvyšší soud (9 soudců)
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'articles' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Klíčové články Ústavy
          </button>
        </div>
      </div>

      {/* Tab 1: Real Enacted Laws */}
      {activeTab === 'laws' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {realLaws.map((law) => {
              const isSelected = selectedLawId === law.id;

              return (
                <button
                  key={law.id}
                  onClick={() => setSelectedLawId(law.id)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#121217] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase">{law.category}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{law.yearPassed}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-serif-title leading-snug">
                    {law.title}
                  </h3>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">
                    {law.summary}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/5">
                    <span className="text-emerald-400 font-bold">${law.costBillionUsd}B USD</span>
                    <span className="text-zinc-500">{law.historicalPresident}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Law Deep Dossier */}
          {selectedLaw && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                    {selectedLaw.officialTitle}
                  </span>
                  <h2 className="text-xl font-bold font-serif-title text-white mt-1">
                    {selectedLaw.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Podepsáno: {selectedLaw.historicalPresident} ({selectedLaw.yearPassed}) · Rozpočet:{' '}
                    <strong className="text-emerald-400 font-mono">${selectedLaw.costBillionUsd} miliard USD</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleTestConstitutionality(selectedLaw.title, selectedLaw.summary)}
                  disabled={isTestingConstitutionality}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 disabled:opacity-50"
                >
                  <Gavel className="w-4 h-4" />
                  <span>
                    {isTestingConstitutionality
                      ? 'SCOTUS prověřuje ústavnost...'
                      : 'Otestovat ústavnost u SCOTUS'}
                  </span>
                </button>
              </div>

              {/* Constitutional Anchor Card */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 flex items-start gap-3">
                <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="text-zinc-400 font-medium">Ústavní zmocnění v Ústavě USA:</span>
                  <p className="text-white font-mono font-semibold">{selectedLaw.constitutionalClause}</p>
                </div>
              </div>

              {/* Key Provisions */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Klíčová ustanovení zákona (Key Provisions):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedLaw.keyProvisions.map((prov, pidx) => (
                    <div key={pidx} className="p-3 bg-[#181822] rounded-xl border border-white/5 text-xs text-zinc-200 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{prov}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Congressional Vote & SCOTUS Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
                <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">Hlasování v Senátu:</span>
                  <span className="text-white font-bold">{selectedLaw.passedSenateVotes}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">Hlasování ve Sněmovně:</span>
                  <span className="text-white font-bold">{selectedLaw.passedHouseVotes}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-zinc-500 block text-[10px]">Ústavní odolnost (SCOTUS):</span>
                  <span className="text-emerald-400 font-bold">{selectedLaw.scotusConstitutionalityRating} % pravděpodobnost</span>
                </div>
              </div>

              {/* Real World Impact */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                <strong className="text-amber-400">Reálný dopad v USA: </strong>
                {selectedLaw.realWorldImpact}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SCOTUS Supreme Court */}
      {activeTab === 'scotus' && (
        <div className="space-y-6">
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h2 className="text-base font-bold text-white font-serif-title">
                  Sbor 9 soudců Nejvyššího soudu USA (Supreme Court of the United States)
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Poměr sil: <strong className="text-rose-400 font-mono">6 konzervativních</strong> vůči{' '}
                  <strong className="text-sky-400 font-mono">3 liberálním</strong> soudkyním.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCOTUS_JUSTICES.map((justice, jidx) => {
                const isCons = justice.ideology === 'Conservative';

                return (
                  <div
                    key={jidx}
                    className="p-3.5 bg-[#181822] border border-white/10 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{justice.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isCons ? 'bg-rose-950 text-rose-300' : 'bg-sky-950 text-sky-300'
                        }`}
                      >
                        {isCons ? 'Konzervativec' : 'Liberál'}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-400/90 block font-mono">{justice.title}</span>
                    <p className="text-xs text-zinc-400">{justice.bio}</p>
                    <div className="pt-1 text-[10px] text-zinc-500 font-mono border-t border-white/5">
                      Jmenoval: {justice.appointedBy} · {justice.philosophy}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Judicial Review Decisions */}
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Přezkumy ústavnosti v této hře (Judicial Review Archive)
            </h3>

            <div className="space-y-3">
              {scotusReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    rev.isStruckDown
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-100'
                      : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-serif-title">{rev.caseTitle}</span>
                    <span className="text-xs font-mono font-bold">
                      Rozsudek: {rev.voteSplit} ({rev.isStruckDown ? 'ZRUŠENO JAKO NEÚSTAVNÍ' : 'POTVRZENO JAKO ÚSTAVNÍ'})
                    </span>
                  </div>
                  <p className="text-xs opacity-90">{rev.constitutionalIssue}</p>
                  <p className="text-xs text-zinc-300 italic pt-1">
                    <strong>Stanovisko většiny soudu:</strong> {rev.majorityOpinion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Key Constitutional Articles */}
      {activeTab === 'articles' && (
        <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-serif-title">
            Ústavní pilíře exekutivy a legislativy USA
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-zinc-300 divide-y divide-white/5">
            <div className="pt-2">
              <strong className="text-amber-400 block mb-1">Článek I, Oddíl 8 — Pravomoci Kongresu (Taxing, Spending & Commerce Clause)</strong>
              Kongres má výhradní pravomoc vybírat daně, hradit dluhy USA, financovat obranu a obecné blaho a regulovat obchod se zahraničím i mezi jednotlivými státy.
            </div>
            <div className="pt-3">
              <strong className="text-amber-400 block mb-1">Článek II — Pravomoci prezidenta (Executive Power & Commander-in-Chief)</strong>
              Prezident je vrchním velitelem ozbrojených sil, dbá na věrné provádění zákonů (Take Care Clause) a jmenuje federální soudce a ministry se souhlasem Senátu.
            </div>
            <div className="pt-3">
              <strong className="text-amber-400 block mb-1">2. dodatek Ústavy — Právo držet zbraň (Second Amendment)</strong>
              Garantuje právo lidu držet a nosit zbraně; podléhá přísnému testu historické tradice podle precedentů SCOTUS Heller a Bruen.
            </div>
            <div className="pt-3">
              <strong className="text-amber-400 block mb-1">10. dodatek Ústavy — Práva států (States’ Rights)</strong>
              Pravomoci, které Ústava výslovně nepředala federální vládě ani nezakázala státům, jsou vyhrazeny jednotlivým státům (guvernérům) nebo lidu.
            </div>
            <div className="pt-3">
              <strong className="text-amber-400 block mb-1">14. dodatek Ústavy — Rovná ochrana zákonů (Due Process & Equal Protection)</strong>
              Žádný stát nesmí zbavit občana života, svobody nebo majetku bez řádného soudního procesu, ani odepřít komukoliv rovnou ochranu zákonů.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
