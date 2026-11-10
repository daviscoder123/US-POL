import { Bill, GameState, StateData, PoliticianProfile } from '../types/game';

export interface ElectoralSummary {
  demVotes: number;
  repVotes: number;
  tossupVotes: number;
  totalVotes: number;
  leader: 'Democratic' | 'Republican' | 'Tie';
  projectedWinner: 'Democratic' | 'Republican' | null;
}

/**
 * Calculates current Electoral College standings across all states
 * 270 needed to win
 */
export function calculateElectoralCollege(states: Record<string, StateData>): ElectoralSummary {
  let demVotes = 0;
  let repVotes = 0;
  let tossupVotes = 0;
  let totalVotes = 0;

  for (const state of Object.values(states)) {
    totalVotes += state.electoralVotes;
    if (state.demMargin > 0.5) {
      demVotes += state.electoralVotes;
    } else if (state.demMargin < -0.5) {
      repVotes += state.electoralVotes;
    } else {
      tossupVotes += state.electoralVotes;
    }
  }

  let leader: 'Democratic' | 'Republican' | 'Tie' = 'Tie';
  if (demVotes > repVotes) leader = 'Democratic';
  else if (repVotes > demVotes) leader = 'Republican';

  let projectedWinner: 'Democratic' | 'Republican' | null = null;
  if (demVotes >= 270) projectedWinner = 'Democratic';
  else if (repVotes >= 270) projectedWinner = 'Republican';

  return { demVotes, repVotes, tossupVotes, totalVotes, leader, projectedWinner };
}

/**
 * Simulates a congressional vote (Senate 100 seats, House 435 seats)
 * Senate filibuster requires 60 votes to pass without cloture override
 */
export function simulateCongressionalVote(
  bill: Bill,
  congress: GameState['congress'],
  player: PoliticianProfile,
  politicalCapitalSpent: number = 0
): {
  senateYeas: number;
  senateNays: number;
  senatePassed: boolean;
  houseYeas: number;
  houseNays: number;
  housePassed: boolean;
  passedBoth: boolean;
  notes: string;
} {
  const isDemSponsor = bill.sponsor.includes('(D') || (bill.isPlayerSponsored && player.party === 'Democratic');
  const isRepSponsor = bill.sponsor.includes('(R') || (bill.isPlayerSponsored && player.party === 'Republican');

  // Baseline party loyalty rates based on ideology alignment
  // If bill is moderately centrist (alignment between -20 and 20), bipartisan appeal increases
  const isCentrist = Math.abs(bill.ideologyAlignment.economic) <= 25 && Math.abs(bill.ideologyAlignment.social) <= 25;
  const isProgressive = bill.ideologyAlignment.economic < -25 || bill.ideologyAlignment.social < -25;
  const isConservative = bill.ideologyAlignment.economic > 25 || bill.ideologyAlignment.social > 25;

  let demSenateLoyalty = 0.85;
  let repSenateLoyalty = 0.10;

  if (isCentrist) {
    demSenateLoyalty = 0.70;
    repSenateLoyalty = 0.45;
  } else if (isConservative) {
    demSenateLoyalty = 0.15;
    repSenateLoyalty = 0.88;
  } else if (isProgressive) {
    demSenateLoyalty = 0.90;
    repSenateLoyalty = 0.05;
  }

  // Clout modifiers
  const whipBonus = (player.stats.whipClout / 100) * 0.15;
  const capitalBonus = Math.min(0.20, (politicalCapitalSpent / 100) * 0.25);
  const totalSponsorBonus = (bill.isPlayerSponsored ? (whipBonus + capitalBonus) : 0);

  if (isDemSponsor) {
    demSenateLoyalty = Math.min(0.98, demSenateLoyalty + totalSponsorBonus);
    repSenateLoyalty = Math.min(0.90, repSenateLoyalty + (totalSponsorBonus * 0.5));
  } else if (isRepSponsor) {
    repSenateLoyalty = Math.min(0.98, repSenateLoyalty + totalSponsorBonus);
    demSenateLoyalty = Math.min(0.90, demSenateLoyalty + (totalSponsorBonus * 0.5));
  }

  // Calculate Senate votes
  const senateDemYeas = Math.round(congress.senateDem * demSenateLoyalty);
  const senateRepYeas = Math.round(congress.senateRep * repSenateLoyalty);
  const senateIndYeas = Math.round(congress.senateInd * (demSenateLoyalty * 0.8 + 0.1));
  const senateYeas = senateDemYeas + senateRepYeas + senateIndYeas;
  const senateNays = 100 - senateYeas;

  // Senate requirement: usually 60 for filibuster-proof majority, or 51 for reconciliation
  const senateThreshold = bill.senateVotes.required || 60;
  const senatePassed = senateYeas >= senateThreshold;

  // House votes (435 total)
  let demHouseLoyalty = isCentrist ? 0.75 : (isProgressive ? 0.92 : 0.12);
  let repHouseLoyalty = isCentrist ? 0.40 : (isConservative ? 0.93 : 0.07);

  if (isDemSponsor) {
    demHouseLoyalty = Math.min(0.99, demHouseLoyalty + totalSponsorBonus);
  } else if (isRepSponsor) {
    repHouseLoyalty = Math.min(0.99, repHouseLoyalty + totalSponsorBonus);
  }

  const houseDemYeas = Math.round(congress.houseDem * demHouseLoyalty);
  const houseRepYeas = Math.round(congress.houseRep * repHouseLoyalty);
  const houseYeas = houseDemYeas + houseRepYeas;
  const houseNays = 435 - houseYeas;
  const housePassed = houseYeas >= 218;

  const passedBoth = senatePassed && housePassed;

  let notes = '';
  if (passedBoth) {
    notes = `Passed Senate (${senateYeas}-100) and House (${houseYeas}-435). Sent to President for enactment.`;
  } else if (!senatePassed && housePassed) {
    notes = `Passed House (${houseYeas}-435), but filibustered in Senate with ${senateYeas} votes (needed ${senateThreshold}).`;
  } else if (senatePassed && !housePassed) {
    notes = `Passed Senate (${senateYeas}-100), but defeated on House floor (${houseYeas} Yeas, 218 required).`;
  } else {
    notes = `Defeated in both chambers: Senate ${senateYeas}-100, House ${houseYeas}-435.`;
  }

  return {
    senateYeas,
    senateNays,
    senatePassed,
    houseYeas,
    houseNays,
    housePassed,
    passedBoth,
    notes
  };
}

/**
 * Calculates rally and advertising effect on a state's polling margin
 */
export function calculateStateCampaignEffect(
  state: StateData,
  playerParty: 'Democratic' | 'Republican' | 'Independent',
  actionType: 'ad_buy' | 'rally',
  amountOrEffort: number, // millions spent or charisma rating
  playerCharisma: number = 50
): { newMargin: number; delta: number; message: string } {
  let shift = 0;

  if (actionType === 'ad_buy') {
    // Diminishing returns on ad buys: sqrt of spending
    // Larger states have higher population, so ads cost more per 0.1% shift
    const costPerPoint = Math.max(1.5, state.population * 0.4);
    shift = (Math.sqrt(amountOrEffort) / costPerPoint) * 2.2;
  } else if (actionType === 'rally') {
    // Rally shift scales with player's charisma
    const charismaFactor = (playerCharisma / 50);
    shift = 0.6 * charismaFactor;
  }

  // Apply in favor of player's party
  // If player is Dem, increases demMargin. If Rep, decreases demMargin. If Ind, pulls margin toward 0.
  let delta = 0;
  if (playerParty === 'Democratic') {
    delta = shift;
  } else if (playerParty === 'Republican') {
    delta = -shift;
  } else {
    // Independent moderates the polarization
    delta = state.demMargin > 0 ? -shift * 0.5 : shift * 0.5;
  }

  // Limit swing per single turn action to prevent unrealistic instant flips
  delta = Math.max(-4.5, Math.min(4.5, delta));
  const newMargin = Number((state.demMargin + delta).toFixed(2));

  const sign = delta > 0 ? '+' : '';
  const message = `${state.name}: Polling shifted ${sign}${delta.toFixed(1)}% (${newMargin >= 0 ? `D+${newMargin.toFixed(1)}` : `R+${Math.abs(newMargin).toFixed(1)}`})`;

  return { newMargin, delta, message };
}

/**
 * Advance one simulation week:
 * Calculates organic fundraising, economic adjustments, ad decay, and approval updates
 */
export function advanceWeekSimulation(currentState: GameState): GameState {
  const nextWeek = currentState.week + 1;
  const nextWeeksUntilElection = Math.max(0, currentState.weeksUntilElection - 1);

  // Weekly fundraising based on donorAppeal stat, approval, and political capital
  const baseFundraising = 1.2; // $1.2M baseline
  const donorMultiplier = currentState.player.stats.donorAppeal / 50; // 0.5 to 2.0
  const approvalMultiplier = currentState.approval.overall / 50;
  const weeklyFundsEarned = Number((baseFundraising * donorMultiplier * approvalMultiplier).toFixed(2));

  // Small weekly political capital regeneration
  const capitalRegen = Math.min(100, currentState.politicalCapital + 3);

  // Economic small drift (realistic macro noise)
  const gdpShift = (Math.random() - 0.48) * 0.1;
  const newGdp = Number(Math.max(0.5, Math.min(5.5, currentState.metrics.gdpGrowth + gdpShift)).toFixed(2));
  
  const inflationShift = (Math.random() - 0.5) * 0.08;
  const newInflation = Number(Math.max(1.2, Math.min(7.0, currentState.metrics.inflationRate + inflationShift)).toFixed(2));

  // Polling drift across battleground states
  const updatedStates: Record<string, StateData> = {};
  for (const [code, state] of Object.entries(currentState.states)) {
    let drift = 0;
    if (state.isBattleground) {
      // Battleground states have slight organic volatility (+/- 0.3%)
      drift = (Math.random() - 0.5) * 0.4;
    }
    updatedStates[code] = {
      ...state,
      demMargin: Number((state.demMargin + drift).toFixed(2))
    };
  }

  // Re-calculate approval slightly influenced by economy
  const economicBonus = (newGdp > 2.5 ? 0.3 : -0.2) + (newInflation < 3.0 ? 0.3 : -0.4);
  const newOverallApproval = Math.max(18, Math.min(85, Number((currentState.approval.overall + economicBonus).toFixed(1))));

  return {
    ...currentState,
    week: nextWeek,
    weeksUntilElection: nextWeeksUntilElection,
    politicalCapital: capitalRegen,
    campaignFundsMillion: Number((currentState.campaignFundsMillion + weeklyFundsEarned).toFixed(2)),
    metrics: {
      ...currentState.metrics,
      gdpGrowth: newGdp,
      inflationRate: newInflation,
    },
    approval: {
      ...currentState.approval,
      overall: newOverallApproval,
      independents: Math.max(15, Math.min(80, Number((currentState.approval.independents + economicBonus * 0.8).toFixed(1))))
    },
    states: updatedStates,
    gameLog: [
      {
        turn: nextWeek,
        message: `Week ${nextWeek} began. Raised $${weeklyFundsEarned}M in campaign donations. Political capital replenished (+3).`,
        type: 'turn'
      },
      ...currentState.gameLog.slice(0, 30)
    ]
  };
}
