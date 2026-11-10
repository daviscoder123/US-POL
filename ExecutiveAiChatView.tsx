import React, { useState, useRef, useEffect } from 'react';
import { AdvancedGameState } from '../types/game';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  Briefcase,
  Globe2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Landmark,
  Zap,
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'president' | 'advisor';
  advisorName?: string;
  advisorRole?: string;
  text: string;
  timestamp: string;
  actionCard?: {
    title: string;
    description: string;
    applied: boolean;
    approvalDelta: number;
    debtDeltaBillion: number;
    authorityDelta: number;
  };
}

interface ExecutiveAiChatViewProps {
  gameState: AdvancedGameState;
  onApplyExecutiveAction: (approvalDelta: number, debtDeltaBillion: number, authorityDelta: number, logMessage: string) => void;
}

const getInitialMessagesForStage = (stage: string, cityName = 'Scranton', stateName = 'Pensylvánie'): ChatMessage[] => {
  if (stage === 'mayor') {
    return [{
      id: 'init-mayor',
      sender: 'advisor',
      advisorName: 'Mark Brennan',
      advisorRole: `Městský manažer & Šéf štábu radnice (${cityName})`,
      text: `Dobrý den, pane starosto. Vítejte na radnici města ${cityName}. Jsem připraven koordinovat městské odbory, městskou policii i městskou radu (City Council). Můžete mi zadat jakýkoliv pokyn — od nočních hlídek, opravy silnic a mostů až po schválení územního plánu a rozpočtu na školství.\n\nCo máme na stole jako první prioritu?`,
      timestamp: 'Právě teď',
      actionCard: {
        title: 'Městská směrnice č. 1: Audit komunální infrastruktury a hlídek',
        description: 'Vydat pokyn odboru veřejných prací a městské policii k vyhodnocení stavu silnic a posílení pořádku v rizikových čtvrtích.',
        applied: false,
        approvalDelta: 1.2,
        debtDeltaBillion: 0,
        authorityDelta: 2,
      },
    }];
  }
  if (stage === 'governor') {
    return [{
      id: 'init-gov',
      sender: 'advisor',
      advisorName: 'Elena Thorne',
      advisorRole: `Šéfka kanceláře guvernéra (${stateName})`,
      text: `Dobrý den, pane guvernére. Vítejte v Kapitolu v Harrisburgu. Připravila jsem pro vás přehled státního rozpočtu Commonwealth of Pennsylvania, stavu jednání ve Valném shromáždění a pohotovosti Národní gardy. Můžete mi zadat jakýkoliv úkol v rámci pravomocí daných 10. dodatkem Ústavy.\n\nJaký je váš první krok ve funkci guvernéra?`,
      timestamp: 'Právě teď',
      actionCard: {
        title: 'Guvernérský výnos č. 1: Zavedení investičních priorit Commonwealthu',
        description: 'Vydat výnos státnímu sekretariátu pro hospodářský rozvoj a zahájit jednání s lídry legislativy v Harrisburgu.',
        applied: false,
        approvalDelta: 1.5,
        debtDeltaBillion: 0,
        authorityDelta: 3,
      },
    }];
  }
  if (stage === 'senator') {
    return [{
      id: 'init-sen',
      sender: 'advisor',
      advisorName: 'Rachel Adams',
      advisorRole: 'Šéfka senátní kanceláře (Russell Senate Office Building)',
      text: `Dobrý den, pane senátore. Vítejte na Capitol Hill. Připravila jsem pro vás přehled legislativní agendy v Senátu USA, stavu vyjednávání s parlamentními frakcemi k prolomení filibusteru (60 hlasů) a aktuálních otázek v soudním a finančním výboru.\n\nKterému zákonu se budeme věnovat jako prvnímu?`,
      timestamp: 'Právě teď',
      actionCard: {
        title: 'Senátní legislativní iniciativa: Svolání slyšení výboru',
        description: 'Iniciovat slyšení v Senátním výboru pro spravedlnost a koordinovat stanoviska nestranických senátorů.',
        applied: false,
        approvalDelta: 1.1,
        debtDeltaBillion: 0,
        authorityDelta: 2,
      },
    }];
  }
  return [{
    id: 'init-potus',
    sender: 'advisor',
    advisorName: 'Kate Hollowayová',
    advisorRole: 'Šéfka kanceláře Bílého domu (Chief of Staff)',
    text: `Dobrý den, pane prezidente. Vítejte v Oválné pracovně. Jsem připravena okamžitě vykonávat vaše pokyny — od přípravy prezidentských exekutivních příkazů (Executive Orders) a koordinace s ministry až po strategii pro překonání obstrukcí v Senátu a reakce na mimořádné události.\n\nCo máme na stole jako první prioritu?`,
    timestamp: 'Právě teď',
    actionCard: {
      title: 'Exekutivní směrnice č. 1: Nastavení priorit Západního křídla',
      description: 'Vydat pokyn všem federálním agenturám k plnému soustředění na programový manifest a stabilitu země.',
      applied: false,
      approvalDelta: 0.8,
      debtDeltaBillion: 0,
      authorityDelta: 2,
    },
  }];
};

export const ExecutiveAiChatView: React.FC<ExecutiveAiChatViewProps> = ({
  gameState,
  onApplyExecutiveAction,
}) => {
  const stage = gameState.career?.stage || 'mayor';
  const [selectedAdvisor, setSelectedAdvisor] = useState<'chief' | 'treasury' | 'state' | 'defense'>('chief');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialMessagesForStage(stage, gameState.career?.cityName, gameState.career?.stateName)
  );

  // Update initial message when career stage changes
  useEffect(() => {
    setMessages(getInitialMessagesForStage(stage, gameState.career?.cityName, gameState.career?.stateName));
  }, [stage]);

  const advisors = stage === 'mayor'
    ? [
        {
          id: 'chief' as const,
          name: 'Mark Brennan',
          role: 'Městský manažer & Šéf štábu radnice',
          dept: `Radnice města ${gameState.career?.cityName || 'Scranton'}`,
          icon: Landmark,
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
          badge: 'Městský manažer',
          specialty: 'Městské vyhlášky, územní plánování, komunální stávky',
        },
        {
          id: 'treasury' as const,
          name: 'Sarah Vance',
          role: 'Finanční ředitelka města (Comptroller)',
          dept: 'Finanční odbor radnice',
          icon: Briefcase,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badge: 'Městský rozpočet',
          specialty: 'Místní daň z nemovitostí, investice do mostů a škol',
        },
        {
          id: 'state' as const,
          name: 'Jim O\'Connor',
          role: 'Policejní náčelník (Chief of Police)',
          dept: 'Městský policejní sbor',
          icon: Shield,
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
          badge: 'Pořádek & Bezpečí',
          specialty: 'Pochůzky, prevence kriminality, městské kamery',
        },
        {
          id: 'defense' as const,
          name: 'Dr. Arthur Green',
          role: 'Předseda školské rady (School Board)',
          dept: 'Městský školský obvod',
          icon: Globe2,
          color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
          badge: 'Školství',
          specialty: 'Veřejné školy, dotované obědy, školní areály',
        },
      ]
    : stage === 'governor'
    ? [
        {
          id: 'chief' as const,
          name: 'Elena Thorne',
          role: 'Šéfka kanceláře guvernéra (Chief of Staff)',
          dept: `Úřad guvernéra státu ${gameState.career?.stateName || 'Pensylvánie'}`,
          icon: Landmark,
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
          badge: 'Vrchní stratég',
          specialty: 'Právo veta, státní parlament, primárky',
        },
        {
          id: 'treasury' as const,
          name: 'Marcus Cole',
          role: 'Státní pokladník (State Treasurer)',
          dept: 'Ministerstvo financí státu',
          icon: Briefcase,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badge: 'Státní rozpočet',
          specialty: 'Státní daně, rating obligací státu, gigafactory',
        },
        {
          id: 'state' as const,
          name: 'Genmjr. Thomas Vance',
          role: 'Velitel Národní gardy (Adjutant General)',
          dept: 'Národní garda státu',
          icon: Shield,
          color: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
          badge: 'Národní garda',
          specialty: 'Nouzové stavy, živelné pohromy, ochrana pořádku',
        },
        {
          id: 'defense' as const,
          name: 'Robert Bennett',
          role: 'Generální prokurátor státu (State AG)',
          dept: 'Ministerstvo spravedlnosti státu',
          icon: Globe2,
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
          badge: '10. dodatek Ústavy',
          specialty: 'Žaloby na federální vládu, ochrana pravomocí státu',
        },
      ]
    : stage === 'senator'
    ? [
        {
          id: 'chief' as const,
          name: 'Rachel Adams',
          role: 'Šéfka kanceláře senátora (Chief of Staff)',
          dept: 'Russell Senate Office Building, D.C.',
          icon: Landmark,
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
          badge: 'Kapitol',
          specialty: 'Senátní strategie, frakční dohody, slyšení',
        },
        {
          id: 'treasury' as const,
          name: 'Brian O\'Connor',
          role: 'Legislativní ředitel (Legislative Director)',
          dept: 'Senátní výbor pro finance a rozpočet',
          icon: Briefcase,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badge: 'Filibuster & Zákony',
          specialty: 'Whip count (60 hlasů), pozměňovací návrhy, CBO odhady',
        },
        {
          id: 'state' as const,
          name: 'Samantha Reedová',
          role: 'Tisková mluvčí & Ředitelka komunikace',
          dept: 'Mediální tým senátora',
          icon: Globe2,
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
          badge: 'Média & Debaty',
          specialty: 'Meet the Press, rozhovory, tiskové zprávy pro Pensylvánii',
        },
        {
          id: 'defense' as const,
          name: 'Jonathan Cruz',
          role: 'Vrchní právní poradce (Judiciary Counsel)',
          dept: 'Senátní výbor pro soudnictví',
          icon: Shield,
          color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
          badge: 'Soudci & Ústava',
          specialty: 'Slyšení nominantů Nejvyššího soudu SCOTUS, ústavní právo',
        },
      ]
    : [
        {
          id: 'chief' as const,
          name: 'Kate Hollowayová',
          role: 'Šéfka kanceláře Bílého domu (Chief of Staff)',
          dept: 'Západní křídlo Bílého domu',
          icon: Landmark,
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
          badge: 'Vrchní stratég',
          specialty: 'Prezidentské dekrety, Senát, vnitřní politika',
        },
        {
          id: 'treasury' as const,
          name: 'Alistair Vance',
          role: 'Ministr financí (Treasury)',
          dept: 'Ministerstvo financí USA',
          icon: Briefcase,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badge: 'Fiskální politika',
          specialty: 'Federální dluhopisy, daně, inflace, Wall Street',
        },
        {
          id: 'state' as const,
          name: 'Helena Campbellová',
          role: 'Ministryně zahraničí (State Dept)',
          dept: 'Ministerstvo zahraničí USA',
          icon: Globe2,
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
          badge: 'Zahraniční věci',
          specialty: 'Diplomacie, NATO, krizové zóny, globální obchod',
        },
        {
          id: 'defense' as const,
          name: 'Gen. Marcus Hayes',
          role: 'Ministr obrany (Pentagon)',
          dept: 'Ministerstvo obrany USA',
          icon: Shield,
          color: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
          badge: 'Národní obrana',
          specialty: 'Vojenská připravenost, odstrašení, kyberbezpečnost',
        },
      ];

  const currentAdvisor = advisors.find((a) => a.id === selectedAdvisor) || advisors[0];

  const quickDirectives = stage === 'mayor'
    ? [
        {
          label: '👮 Městská vyhláška: Zvýšení počtu pěších hlídek',
          prompt: 'Vydej starostenské nařízení na posílení pěších policejních hlídek v rizikových čtvrtích města ke snížení kriminality.',
        },
        {
          label: '🏫 Školní program: Dotované obědy pro žáky',
          prompt: 'Schval financování bezplatných obědů pro žáky základních škol ve městě z komunálních přebytků.',
        },
        {
          label: '🏗️ Územní plán: Schválení nové továrny',
          prompt: 'Předlož městské radě zrychlené schválení územního povolení pro výstavbu technologického logistického parku.',
        },
        {
          label: '💵 Komunální rozpočet: Úspory v provozu radnice',
          prompt: 'Ulož městskému manažerovi prověřit provozní výdaje radnice a najít 2 miliony USD na opravy mostů a silnic.',
        },
      ]
    : stage === 'governor'
    ? [
        {
          label: '🛡️ Povolat Národní gardu státu',
          prompt: 'Jako vrchní velitel státu vydávám rozkaz k pohotovostnímu nasazení Národní gardy na pomoc při mimořádném stavu.',
        },
        {
          label: '🏭 Daňové úlevy pro polovodičové gigafactory',
          prompt: 'Připrav guvernérský balíček 10letých daňových prázdnin pro přilákání výrobců čipů a baterií do našeho státu.',
        },
        {
          label: '⚖️ Žaloba k soudu na obranu 10. dodatku Ústavy',
          prompt: 'Pověř generálního prokurátora státu podáním ústavní žaloby proti federálnímu zásahu do pravomocí našeho státu.',
        },
        {
          label: '📜 Uplatnit guvernérské veto na zákon',
          prompt: 'Vrať státnímu parlamentu kontroverzní výdajový návrh zákona s mým guvernérským vetem.',
        },
      ]
    : stage === 'senator'
    ? [
        {
          label: '🏛️ Prolomit filibuster (získat 60 hlasů)',
          prompt: 'Jak máme vyjednávat se středovými senátory z obou stran, abychom sestavili koalici 60 hlasů a ukončili obstrukci (cloture)?',
        },
        {
          label: '⚖️ Slyšení nominanta Nejvyššího soudu (SCOTUS)',
          prompt: 'Připrav strategii pro grilování nominanta na soudce Nejvyššího soudu v Senátním výboru pro soudnictví.',
        },
        {
          label: '🎙️ Vystoupení v nedělní talkshow (Meet the Press)',
          prompt: 'Připrav hlavní diskusní body a obhajobu našeho daňového a infrastrukturního balíčku pro celostátní vysílání.',
        },
        {
          label: '💰 Kampaňový fond (Super PAC) pro znovuzvolení',
          prompt: 'Vyhodnoť stav našeho senátního volebního konta a naplánuj setkání s klíčovými dárci v Pensylvánii.',
        },
      ]
    : [
        {
          label: '⚡ Exekutivní příkaz: Boj s drahotou',
          prompt: 'Vydej prezidentský exekutivní příkaz k prověření spekulativních marží velkých řetězců a sražení cen základních potravin pro rodiny.',
        },
        {
          label: '🏛️ Projednat situaci v Senátu (60 hlasů)',
          prompt: 'Jaké máme šance na schválení našeho klíčového zákona v Senátu a jak zajistíme 60 hlasů proti filibusteru?',
        },
        {
          label: '💵 Stabilizace státního dluhu',
          prompt: 'Ministře financí Vance, jak reagují výnosy 10letých vládních dluhopisů na náš plán a jak uklidníme Wall Street?',
        },
        {
          label: '🛡️ Bezpečnost jižní hranice',
          prompt: 'Vydej směrnici pro posílení federálních hlídek na jižní hranici a zrychlení azylových řízení.',
        },
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `pres-${Date.now()}`,
      sender: 'president',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'president' ? 'user' : 'model',
        text: m.text,
      }));

      // Call our server endpoint
      const response = await fetch('/api/ai/executive-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyPayload,
          message: textToSend,
          advisor: currentAdvisor.name,
          gameState: {
            term: gameState.term,
            week: gameState.week,
            overallApproval: gameState.overallApproval,
            loyalLawmakers: gameState.loyalLawmakers,
            fiscal: gameState.fiscal,
            politician: gameState.politician,
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Rozkaz byl přijat, pane prezidente. Zahajujeme exekutivní koordinaci napříč Bílým domem.';

      // Determine if this prompt warrants an action card
      const isDecreeOrOrder = /příkaz|dekret|směrnici|order|rozkaz|vydej|schval/i.test(textToSend);

      const advisorMsg: ChatMessage = {
        id: `adv-${Date.now()}`,
        sender: 'advisor',
        advisorName: currentAdvisor.name,
        advisorRole: currentAdvisor.role,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
        actionCard: isDecreeOrOrder
          ? {
              title: `Exekutivní opatření na základě prezidentského pokynu`,
              description: `Vládní aparát implementoval směrnici do chodu agentur a federálního věstníku.`,
              applied: false,
              approvalDelta: 1.1,
              debtDeltaBillion: textToSend.includes('dluh') ? -5.0 : 4.0,
              authorityDelta: 2,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } catch (error) {
      console.error('Executive chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `adv-fallback-${Date.now()}`,
        sender: 'advisor',
        advisorName: currentAdvisor.name,
        advisorRole: currentAdvisor.role,
        text: `Rozumím, pane prezidente. Informace z ministerstva byla zaevidována a legislativní tým v Západním křídle připravuje podklady pro schůzi kabinetu.`,
        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (msgId: string, action: NonNullable<ChatMessage['actionCard']>) => {
    if (action.applied) return;

    onApplyExecutiveAction(
      action.approvalDelta,
      action.debtDeltaBillion,
      action.authorityDelta,
      `Rozhodnutí schváleno: ${action.title}`
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.actionCard) {
          return {
            ...m,
            actionCard: {
              ...m.actionCard,
              applied: true,
            },
          };
        }
        return m;
      })
    );
  };

  const stageHeaders: Record<string, { title: string; subtitle: string; placeholderRole: string }> = {
    mayor: {
      title: `Radnice ${gameState.career?.cityName || 'Scranton'} · AI Kancelář starosty`,
      subtitle: `Řiďte město z pozice starosty. Vydávejte městské vyhlášky, úkolujte městské odbory a koordinujte městskou radu.`,
      placeholderRole: 'pokyn starosty',
    },
    governor: {
      title: `Kapitol Harrisburg · AI Štáb guvernéra`,
      subtitle: `Spravujte Commonwealth of Pennsylvania. Vydávejte výnosy, řiďte státní rozpočet a velte Národní gardě.`,
      placeholderRole: 'guvernérský pokyn',
    },
    senator: {
      title: `Capitol Hill · AI Senátní poradce`,
      subtitle: `Prosazujte zákony v Senátu USA. Vyjednávejte 60 hlasů proti filibusteru a veďte slyšení senátních výborů.`,
      placeholderRole: 'senátní pokyn',
    },
    president: {
      title: `Oválná pracovna · AI Prezidentský velín`,
      subtitle: `Řiďte zemi přímo z pozice hlavy státu. Vydávejte prezidentské dekrety, plánujte strategii a úkolujte ministry.`,
      placeholderRole: 'prezidentský pokyn',
    },
  };
  const currentStageHeader = stageHeaders[stage] || stageHeaders.mayor;

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] max-w-4xl mx-auto bg-[#0a0a0c] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#121217] border-b border-white/10 p-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  {currentStageHeader.title}
                </h1>
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini Online
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {currentStageHeader.subtitle}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl self-end sm:self-auto">
            <div>
              <span className="text-zinc-500 text-[10px] block">Podpora:</span>
              <span className="font-bold text-emerald-400 tabular-nums">{gameState.overallApproval}%</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div>
              <span className="text-zinc-500 text-[10px] block">Dluh / HDP:</span>
              <span className="font-bold text-amber-400 tabular-nums">{gameState.fiscal.debtGdpPercent}%</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div>
              <span className="text-zinc-500 text-[10px] block">Týden:</span>
              <span className="font-bold text-white tabular-nums">{gameState.week}.</span>
            </div>
          </div>
        </div>

        {/* Advisor Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 mt-2 border-t border-white/5 scrollbar-none">
          {advisors.map((advisor) => {
            const isSelected = selectedAdvisor === advisor.id;
            const Icon = advisor.icon;
            return (
              <button
                key={advisor.id}
                onClick={() => setSelectedAdvisor(advisor.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? `${advisor.color} font-semibold shadow-sm`
                    : 'bg-[#18181f] border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{advisor.name}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({advisor.badge})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((message) => {
          const isPresident = message.sender === 'president';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isPresident ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {!isPresident ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-[10px]">
                      <Bot className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">
                      {message.advisorName || 'Kate Hollowayová'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {message.advisorRole || 'Poradce Bílého domu'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-zinc-500 font-mono">Prezident Spojených států</span>
                    <span className="text-xs font-semibold text-amber-400">
                      {gameState.politician.firstName} {gameState.politician.lastName}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px]">
                      <User className="w-3 h-3" />
                    </div>
                  </>
                )}
                <span className="text-[10px] text-zinc-600 ml-1">{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                  isPresident
                    ? 'bg-amber-500/15 border border-amber-500/30 text-white rounded-tr-none'
                    : 'bg-[#18181f] border border-white/10 text-zinc-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{message.text}</div>

                {/* Optional Executable Action Card attached to response */}
                {message.actionCard && (
                  <div className="mt-3 pt-3 border-t border-white/10 bg-black/30 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{message.actionCard.title}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">Exekutivní příkaz</span>
                    </div>

                    <p className="text-xs text-zinc-300">{message.actionCard.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-emerald-400">Podpora: +{message.actionCard.approvalDelta}%</span>
                        <span className="text-zinc-500">·</span>
                        <span className={message.actionCard.debtDeltaBillion <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                          Dluh: {message.actionCard.debtDeltaBillion > 0 ? `+${message.actionCard.debtDeltaBillion} mld. $` : `${message.actionCard.debtDeltaBillion} mld. $`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleApplyAction(message.id, message.actionCard!)}
                        disabled={message.actionCard.applied}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          message.actionCard.applied
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md font-bold'
                        }`}
                      >
                        {message.actionCard.applied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Příkaz vykonán</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Podepsat a provést</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2 max-w-full">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-[10px] mt-1">
              <Bot className="w-3 h-3" />
            </div>
            <div className="p-3 bg-[#18181f] border border-white/10 rounded-2xl rounded-tl-none text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{currentAdvisor.name} připravuje stanovisko a právní rozbor...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Directives Bar */}
      <div className="bg-[#121217] px-4 py-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] uppercase font-semibold text-zinc-500 shrink-0">Rychlé pokyny:</span>
        {quickDirectives.map((qd, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(qd.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-[#1c1c24] hover:bg-[#252530] border border-white/10 text-xs text-zinc-300 whitespace-nowrap transition-colors disabled:opacity-40"
          >
            {qd.label}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-[#121217] border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Zadejte ${currentStageHeader.placeholderRole} pro ${currentAdvisor.name}... (např. Vydej příkaz k..., Jak vyřešíme...)`}
            disabled={isLoading}
            className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <span>Vydat pokyn</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
