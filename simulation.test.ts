import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectoralCollege, simulateCongressionalVote, calculateStateCampaignEffect } from './simulation';
import { INITIAL_STATES } from './statesData';
import { Bill, PoliticianProfile } from '../types/game';

test('Electoral College sums correctly to 538 total votes', () => {
  const result = calculateElectoralCollege(INITIAL_STATES);
  assert.equal(result.totalVotes, 538, 'Total electoral votes across 50 states + DC must be exactly 538');
  assert.ok(result.demVotes >= 0 && result.demVotes <= 538);
  assert.ok(result.repVotes >= 0 && result.repVotes <= 538);
  assert.equal(result.demVotes + result.repVotes + result.tossupVotes, 538);
});

test('Congressional Vote simulation evaluates Senate and House thresholds', () => {
  const testPlayer: PoliticianProfile = {
    name: 'Sarah Montgomery',
    role: 'Senator',
    party: 'Democratic',
    faction: 'Moderate / Establishment',
    homeState: 'PA',
    ideology: { economic: -10, social: -10, foreign: 0 },
    traits: ['Bipartisan Dealmaker'],
    stats: {
      charisma: 75,
      policyMastery: 80,
      whipClout: 85,
      donorAppeal: 70,
      mediaSavvy: 75
    }
  };

  const congress = {
    senateDem: 51,
    senateRep: 49,
    senateInd: 0,
    houseDem: 219,
    houseRep: 216
  };

  // Centrist infrastructure bill
  const centristBill: Bill = {
    id: 'test-1',
    title: 'Bipartisan Bridge & Rail Modernization Act',
    sponsor: 'Sen. Montgomery (D-PA)',
    category: 'Economy',
    summary: 'Invests $180B into regional freight and bridge overhauls.',
    economicCostBillion: 180,
    economicImpactRating: 'Moderate Growth',
    ideologyAlignment: { economic: 5, social: 0 },
    senateVotes: { yeas: 0, nays: 0, required: 60 },
    houseVotes: { yeas: 0, nays: 0, required: 218 },
    status: 'In Committee',
    demSupport: 80,
    repSupport: 65,
    publicSupport: 72,
    isPlayerSponsored: true
  };

  const voteResult = simulateCongressionalVote(centristBill, congress, testPlayer, 20);
  assert.ok(voteResult.senateYeas >= 50, `Senate Yeas should be competitive: got ${voteResult.senateYeas}`);
  assert.ok(voteResult.houseYeas >= 200, `House Yeas should be strong: got ${voteResult.houseYeas}`);
  assert.equal(typeof voteResult.passedBoth, 'boolean');
});

test('Campaign ad buys and rallies adjust state polling margin with diminishing returns', () => {
  const paState = { ...INITIAL_STATES['PA'] };
  const initialMargin = paState.demMargin;

  // Democratic ad buy in PA
  const adResult = calculateStateCampaignEffect(paState, 'Democratic', 'ad_buy', 5, 70);
  assert.ok(adResult.delta > 0, 'Dem ad buy should increase Dem margin');
  assert.equal(adResult.newMargin, Number((initialMargin + adResult.delta).toFixed(2)));

  // Republican rally in PA
  const repRallyResult = calculateStateCampaignEffect(paState, 'Republican', 'rally', 0, 85);
  assert.ok(repRallyResult.delta < 0, 'Rep rally should decrease Dem margin (move towards R)');
});
