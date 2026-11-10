/**
 * Statecraft / Politics Simulator - Comprehensive Type Definitions
 * Inspired by the UK/US political simulator screenshots and mechanics
 */

export type PoliticianRole = 'President' | 'Prime Minister' | 'Senator' | 'Governor';

export type Party =
  | 'Democratic'
  | 'Republican'
  | 'Independent'
  | 'Labour'
  | 'Conservative'
  | 'Liberal Democrats'
  | 'Reform'
  | 'Green';

export type GameMode = 'Fresh start' | 'Current day';
export type GameDifficulty = 'Backbencher' | 'Cabinet' | 'Prime Minister';
export type MajorityType = 'Landslide' | 'Working Majority' | 'Hung Parliament / Razor Thin';

export interface DemographicBreakdown {
  workingClass: number;   // 0-100
  middleClass: number;    // 0-100
  business: number;       // 0-100
  under35s: number;       // 0-100
  pensioners: number;     // 0-100
  general: number;        // 0-100
  publicSector: number;   // 0-100
  ethnicMinority: number; // 0-100
  rural: number;          // 0-100
  mediaMood: number;      // 0-100
}

export interface MediaOutletRating {
  name: string;
  rating: number; // e.g. +35, -17
  alignment: 'Left' | 'Centre' | 'Right' | 'Financial';
}

export interface PersonalStatsRadar {
  integrity: number; // 0-100
  charisma: number;  // 0-100
  intellect: number; // 0-100
  resilience: number;// 0-100
  authority: number; // 0-100
}

export interface LegacyScore {
  overall: number; // 0-100
  status: 'Historic' | 'Strong' | 'Average' | 'Vulnerable' | 'Disastrous';
  economy: number;
  workers: number;
  wellbeing: number;
  publicServices: number;
  housing: number;
  socialCohesion: number;
}

export interface CareerTrait {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'life' | 'background';
  bonuses: { label: string; positive: boolean }[];
}

export interface ManifestoPledge {
  id: string;
  title: string;
  category: 'Budget & Fiscal' | 'Tax' | 'Bills & Laws';
  description: string;
  difficulty: number; // 1 (easy), 2 (medium), 3 (hard), 5 (very hard)
  impactSummary: string;
  isCommitted: boolean;
  status: 'Pending' | 'Delivered' | 'Broken';
}

export interface InTrayBriefing {
  id: string;
  senderTitle: string;
  senderName: string;
  category: 'BRIEFING · CHIEF OF STAFF' | 'TREASURY MEMO' | 'FOREIGN INTEL' | 'WHIP ALERT' | 'PRESS ADVISORY';
  title: string;
  previewSnippet: string;
  fullMemo: string;
  isUrgent: boolean;
  isUnread: boolean;
  needsReply: boolean;
  weekReceived: number;
  repliedOptionId?: string;
  options: {
    id: string;
    label: string;
    description: string;
    authorityCost?: number;
    approvalDelta?: number;
    debtDeltaBillion?: number;
    consequenceNotes: string;
  }[];
}

export interface CabinetMinister {
  id: string;
  portfolio: string; // e.g. 'Deputy Prime Minister / VP', 'Chancellor / Treasury', 'Foreign Secretary / State Dept'
  name: string;
  isVacant: boolean;
  loyalty: number; // 0-100
  competence: number; // 0-100
  faction: string;
  bio: string;
}

export interface TaxItem {
  id: string;
  name: string;
  category: 'Major' | 'Other';
  currentRate: number; // % e.g. 20
  annualRevenueBillion: number; // e.g. 245
  taxpayersMillions: number; // e.g. 34
  elasticity: number; // e.g. 0.4
  adjustStep: number;
}

export interface PollsterResult {
  pollster: string;
  methodology: string;
  leadMargin: number; // positive = leading, negative = trailing
  sampleSize: number;
  date: string;
}

export interface CountryFiscalStats {
  debtGdpPercent: number; // e.g. 89.4
  bondRating: 'AAA' | 'AA+' | 'AA' | 'A+';
  totalPublicDebtBillion: number; // e.g. 2580
  deficitBeforeInterestBillion: number; // e.g. 95.4
  debtInterestBillion: number; // e.g. 45.2
  totalBorrowingBillion: number; // e.g. 140.6
  totalRevenueBillion: number; // e.g. 1040
  totalSpendingBillion: number; // e.g. 1135.4
  tenYearGiltYield: number; // % e.g. 3.5
  averageInterestOnDebt: number; // % e.g. 1.75
  inflationRate: number; // % e.g. 2.2
  gdpGrowthRate: number; // % e.g. 2.0
  gdpPerCapita: number; // e.g. 34800
  unemploymentRate: number; // % e.g. 3.8
  youthUnemploymentRate: number; // % e.g. 10.0
  longTermSickMillions: number; // e.g. 2.2
  stockMarketIndex: number; // e.g. 8750
  businessConfidence: number; // e.g. 62/100
  consumerConfidence: number; // e.g. 58/100
  nhsWaitingListMillions: number; // e.g. 6.0
  aeWaitHours: number; // e.g. 4.4
}

export interface AdvancedGameState {
  week: number;
  term: number;
  dateString: string;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  majorityType: MajorityType;
  politician: {
    firstName: string;
    lastName: string;
    title: string;
    party: Party;
    constituencyOrState: string;
    backstory: string[];
    mandate: string;
    oppositionLeader: {
      name: string;
      style: string;
      quote: string;
    };
  };
  radarStats: PersonalStatsRadar;
  legacyScore: LegacyScore;
  overallApproval: number; // e.g. 55%
  debtRating: string; // e.g. "AA+"
  loyalLawmakers: number; // e.g. 287
  sleazeScore: number; // 0
  pollLead: number; // e.g. +3.2
  demographics: DemographicBreakdown;
  fiscal: CountryFiscalStats;
  inTray: InTrayBriefing[];
  cabinet: CabinetMinister[];
  taxes: TaxItem[];
  manifestoPledges: ManifestoPledge[];
  mediaOutlets: MediaOutletRating[];
  pollsters: PollsterResult[];
  activeSnapshotModal: 'approval' | 'debt' | 'gdp' | 'inflation' | 'unemployment' | 'media' | null;
  selectedBriefingId: string | null;
  career: CareerProgress;
  realLaws: RealUsLaw[];
  scotusReviews: ScotusJudicialReview[];
  superPacs: SuperPacDonor[];
}

export type CareerStage = 'mayor' | 'governor' | 'senator' | 'president';

export interface CareerProgress {
  stage: CareerStage;
  stageTitle: string; // e.g. "Starosta města Scranton, PA", "Guvernér státu Pensylvánie", "Prezident USA"
  cityName?: string;
  stateName: string;
  stateCode: string;
  experiencePoints: number; // XP to promote
  targetXpForPromotion: number;
  promotionRequirementsMet: boolean;
  termsServedInRole: number;
  localApproval: number; // 0-100%
  localCrimeRate?: number; // for mayor
  localSchoolRating?: number; // for mayor
  localBudgetDeficitMillion?: number;
  stateBondRating?: string; // for governor
  campaignChestMillion: number;
  grassrootsDonorsCount: number;
  superPacSupportMillion: number;
  careerHistory: {
    role: string;
    location: string;
    years: string;
    majorAchievement: string;
  }[];
}

export interface RealUsLaw {
  id: string;
  title: string;
  officialTitle: string;
  yearPassed: number;
  historicalPresident: string;
  category: 'Economy & Energy' | 'Tech & Manufacturing' | 'Healthcare' | 'Taxes' | 'Infrastructure' | 'Defense & Rights';
  constitutionalClause: string;
  summary: string;
  costBillionUsd: number;
  keyProvisions: string[];
  ideologicalLean: 'Progressive' | 'Bipartisan' | 'Conservative';
  passedSenateVotes: string;
  passedHouseVotes: string;
  status: 'Historicky schváleno' | 'Na stole k podpisu' | 'V projednávání' | 'Ústavně napadeno';
  scotusConstitutionalityRating: number;
  realWorldImpact: string;
}

export interface ScotusJustice {
  name: string;
  title: string;
  ideology: 'Conservative' | 'Liberal';
  appointedBy: string;
  bio: string;
  philosophy: 'Textualism / Originalism' | 'Living Constitution / Pragmatism';
}

export interface ScotusJudicialReview {
  id: string;
  caseTitle: string;
  plaintiff: string;
  constitutionalIssue: string;
  majorityOpinion: string;
  voteSplit: string;
  isStruckDown: boolean;
  dateDecided: string;
}

export interface SuperPacDonor {
  id: string;
  name: string;
  industry: 'Tech & Silicon Valley' | 'Wall Street & Finance' | 'Energy & Oil' | 'Labor Unions' | 'Healthcare & Pharma' | 'Defense Contractors';
  annualDonationMillion: number;
  influenceExpectation: string;
  loyalty: number;
}

export interface StateDemographics {
  urban: number;
  suburban: number;
  rural: number;
  collegeEducated: number;
  workingClass: number;
}

export interface StateData {
  code: string;
  name: string;
  electoralVotes: number;
  pvi: number;
  demMargin: number;
  population: number;
  isBattleground: boolean;
  demographics: StateDemographics;
  playerAdSpend: number;
  playerVisits: number;
}

export type BillCategory = 'Economy' | 'Healthcare' | 'Immigration' | 'Climate & Energy' | 'Defense' | 'Tech & AI' | 'Civil Rights';

export interface Bill {
  id: string;
  title: string;
  sponsor: string;
  category: BillCategory;
  summary: string;
  economicCostBillion: number;
  economicImpactRating: string;
  ideologyAlignment: { economic: number; social: number };
  senateVotes: { yeas: number; nays: number; required: number };
  houseVotes: { yeas: number; nays: number; required: number };
  status: 'In Committee' | 'Senate Floor' | 'House Floor' | 'Enacted' | 'Failed' | 'Vetoed';
  demSupport: number;
  repSupport: number;
  publicSupport: number;
  isPlayerSponsored: boolean;
  aiAnalysis?: string;
}

export interface PoliticianProfile {
  name: string;
  role: PoliticianRole;
  party: Party;
  faction: string;
  homeState: string;
  ideology: { economic: number; social: number; foreign: number };
  traits: string[];
  stats: {
    charisma: number;
    policyMastery: number;
    whipClout: number;
    donorAppeal: number;
    mediaSavvy: number;
  };
}

export interface GameState {
  week: number;
  weeksUntilElection: number;
  player: PoliticianProfile;
  politicalCapital: number;
  campaignFundsMillion: number;
  approval: {
    overall: number;
    democrats: number;
    republicans: number;
    independents: number;
  };
  metrics: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
    nationalDebtTrillion: number;
    approvalTrend: number[];
  };
  congress: {
    senateDem: number;
    senateRep: number;
    senateInd: number;
    houseDem: number;
    houseRep: number;
  };
  bills: Bill[];
  states: Record<string, StateData>;
  gameLog: { turn: number; message: string; type: string }[];
}
