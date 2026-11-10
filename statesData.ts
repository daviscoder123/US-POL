import { StateData } from '../types/game';

/**
 * 50 US States + District of Columbia
 * Total Electoral Votes: 538 (270 to win)
 * PVI: negative = Dem favor, positive = Rep favor
 */
export const INITIAL_STATES: Record<string, StateData> = {
  AL: {
    code: 'AL', name: 'Alabama', electoralVotes: 9, pvi: 15, demMargin: -25, population: 5.1, isBattleground: false,
    demographics: { urban: 58, suburban: 22, rural: 20, collegeEducated: 27, workingClass: 73 }, playerAdSpend: 0, playerVisits: 0
  },
  AK: {
    code: 'AK', name: 'Alaska', electoralVotes: 3, pvi: 8, demMargin: -10, population: 0.73, isBattleground: false,
    demographics: { urban: 66, suburban: 14, rural: 20, collegeEducated: 31, workingClass: 69 }, playerAdSpend: 0, playerVisits: 0
  },
  AZ: {
    code: 'AZ', name: 'Arizona', electoralVotes: 11, pvi: 1, demMargin: 0.3, population: 7.4, isBattleground: true,
    demographics: { urban: 89, suburban: 6, rural: 5, collegeEducated: 32, workingClass: 68 }, playerAdSpend: 0, playerVisits: 0
  },
  AR: {
    code: 'AR', name: 'Arkansas', electoralVotes: 6, pvi: 16, demMargin: -28, population: 3.1, isBattleground: false,
    demographics: { urban: 56, suburban: 20, rural: 24, collegeEducated: 24, workingClass: 76 }, playerAdSpend: 0, playerVisits: 0
  },
  CA: {
    code: 'CA', name: 'California', electoralVotes: 54, pvi: -14, demMargin: 24, population: 39.0, isBattleground: false,
    demographics: { urban: 95, suburban: 3, rural: 2, collegeEducated: 36, workingClass: 64 }, playerAdSpend: 0, playerVisits: 0
  },
  CO: {
    code: 'CO', name: 'Colorado', electoralVotes: 10, pvi: -4, demMargin: 11, population: 5.9, isBattleground: false,
    demographics: { urban: 87, suburban: 8, rural: 5, collegeEducated: 44, workingClass: 56 }, playerAdSpend: 0, playerVisits: 0
  },
  CT: {
    code: 'CT', name: 'Connecticut', electoralVotes: 7, pvi: -7, demMargin: 14, population: 3.6, isBattleground: false,
    demographics: { urban: 88, suburban: 7, rural: 5, collegeEducated: 41, workingClass: 59 }, playerAdSpend: 0, playerVisits: 0
  },
  DE: {
    code: 'DE', name: 'Delaware', electoralVotes: 3, pvi: -6, demMargin: 16, population: 1.0, isBattleground: false,
    demographics: { urban: 83, suburban: 10, rural: 7, collegeEducated: 34, workingClass: 66 }, playerAdSpend: 0, playerVisits: 0
  },
  DC: {
    code: 'DC', name: 'District of Columbia', electoralVotes: 3, pvi: -43, demMargin: 84, population: 0.67, isBattleground: false,
    demographics: { urban: 100, suburban: 0, rural: 0, collegeEducated: 60, workingClass: 40 }, playerAdSpend: 0, playerVisits: 0
  },
  FL: {
    code: 'FL', name: 'Florida', electoralVotes: 30, pvi: 4, demMargin: -7.5, population: 22.6, isBattleground: true,
    demographics: { urban: 91, suburban: 5, rural: 4, collegeEducated: 32, workingClass: 68 }, playerAdSpend: 0, playerVisits: 0
  },
  GA: {
    code: 'GA', name: 'Georgia', electoralVotes: 16, pvi: 1, demMargin: -0.5, population: 11.0, isBattleground: true,
    demographics: { urban: 75, suburban: 15, rural: 10, collegeEducated: 33, workingClass: 67 }, playerAdSpend: 0, playerVisits: 0
  },
  HI: {
    code: 'HI', name: 'Hawaii', electoralVotes: 4, pvi: -14, demMargin: 27, population: 1.4, isBattleground: false,
    demographics: { urban: 92, suburban: 5, rural: 3, collegeEducated: 34, workingClass: 66 }, playerAdSpend: 0, playerVisits: 0
  },
  ID: {
    code: 'ID', name: 'Idaho', electoralVotes: 4, pvi: 19, demMargin: -31, population: 1.9, isBattleground: false,
    demographics: { urban: 70, suburban: 15, rural: 15, collegeEducated: 29, workingClass: 71 }, playerAdSpend: 0, playerVisits: 0
  },
  IL: {
    code: 'IL', name: 'Illinois', electoralVotes: 19, pvi: -7, demMargin: 15, population: 12.6, isBattleground: false,
    demographics: { urban: 88, suburban: 6, rural: 6, collegeEducated: 36, workingClass: 64 }, playerAdSpend: 0, playerVisits: 0
  },
  IN: {
    code: 'IN', name: 'Indiana', electoralVotes: 11, pvi: 11, demMargin: -16, population: 6.8, isBattleground: false,
    demographics: { urban: 72, suburban: 14, rural: 14, collegeEducated: 28, workingClass: 72 }, playerAdSpend: 0, playerVisits: 0
  },
  IA: {
    code: 'IA', name: 'Iowa', electoralVotes: 6, pvi: 6, demMargin: -8, population: 3.2, isBattleground: false,
    demographics: { urban: 64, suburban: 16, rural: 20, collegeEducated: 30, workingClass: 70 }, playerAdSpend: 0, playerVisits: 0
  },
  KS: {
    code: 'KS', name: 'Kansas', electoralVotes: 6, pvi: 10, demMargin: -15, population: 2.9, isBattleground: false,
    demographics: { urban: 74, suburban: 12, rural: 14, collegeEducated: 34, workingClass: 66 }, playerAdSpend: 0, playerVisits: 0
  },
  KY: {
    code: 'KY', name: 'Kentucky', electoralVotes: 8, pvi: 16, demMargin: -26, population: 4.5, isBattleground: false,
    demographics: { urban: 58, suburban: 22, rural: 20, collegeEducated: 25, workingClass: 75 }, playerAdSpend: 0, playerVisits: 0
  },
  LA: {
    code: 'LA', name: 'Louisiana', electoralVotes: 8, pvi: 12, demMargin: -19, population: 4.6, isBattleground: false,
    demographics: { urban: 73, suburban: 14, rural: 13, collegeEducated: 25, workingClass: 75 }, playerAdSpend: 0, playerVisits: 0
  },
  ME: {
    code: 'ME', name: 'Maine', electoralVotes: 4, pvi: -2, demMargin: 7, population: 1.4, isBattleground: false,
    demographics: { urban: 39, suburban: 25, rural: 36, collegeEducated: 34, workingClass: 66 }, playerAdSpend: 0, playerVisits: 0
  },
  MD: {
    code: 'MD', name: 'Maryland', electoralVotes: 10, pvi: -14, demMargin: 30, population: 6.2, isBattleground: false,
    demographics: { urban: 87, suburban: 8, rural: 5, collegeEducated: 42, workingClass: 58 }, playerAdSpend: 0, playerVisits: 0
  },
  MA: {
    code: 'MA', name: 'Massachusetts', electoralVotes: 11, pvi: -15, demMargin: 31, population: 7.0, isBattleground: false,
    demographics: { urban: 92, suburban: 5, rural: 3, collegeEducated: 46, workingClass: 54 }, playerAdSpend: 0, playerVisits: 0
  },
  MI: {
    code: 'MI', name: 'Michigan', electoralVotes: 15, pvi: -1, demMargin: 0.8, population: 10.0, isBattleground: true,
    demographics: { urban: 74, suburban: 14, rural: 12, collegeEducated: 31, workingClass: 69 }, playerAdSpend: 0, playerVisits: 0
  },
  MN: {
    code: 'MN', name: 'Minnesota', electoralVotes: 10, pvi: -1, demMargin: 5.5, population: 5.7, isBattleground: true,
    demographics: { urban: 73, suburban: 13, rural: 14, collegeEducated: 37, workingClass: 63 }, playerAdSpend: 0, playerVisits: 0
  },
  MS: {
    code: 'MS', name: 'Mississippi', electoralVotes: 6, pvi: 11, demMargin: -17, population: 3.0, isBattleground: false,
    demographics: { urban: 49, suburban: 25, rural: 26, collegeEducated: 23, workingClass: 77 }, playerAdSpend: 0, playerVisits: 0
  },
  MO: {
    code: 'MO', name: 'Missouri', electoralVotes: 10, pvi: 10, demMargin: -14, population: 6.2, isBattleground: false,
    demographics: { urban: 70, suburban: 15, rural: 15, collegeEducated: 30, workingClass: 70 }, playerAdSpend: 0, playerVisits: 0
  },
  MT: {
    code: 'MT', name: 'Montana', electoralVotes: 4, pvi: 11, demMargin: -15, population: 1.1, isBattleground: false,
    demographics: { urban: 56, suburban: 18, rural: 26, collegeEducated: 34, workingClass: 66 }, playerAdSpend: 0, playerVisits: 0
  },
  NE: {
    code: 'NE', name: 'Nebraska', electoralVotes: 5, pvi: 11, demMargin: -17, population: 2.0, isBattleground: false,
    demographics: { urban: 73, suburban: 12, rural: 15, collegeEducated: 33, workingClass: 67 }, playerAdSpend: 0, playerVisits: 0
  },
  NV: {
    code: 'NV', name: 'Nevada', electoralVotes: 6, pvi: 0, demMargin: 0.5, population: 3.2, isBattleground: true,
    demographics: { urban: 94, suburban: 3, rural: 3, collegeEducated: 26, workingClass: 74 }, playerAdSpend: 0, playerVisits: 0
  },
  NH: {
    code: 'NH', name: 'New Hampshire', electoralVotes: 4, pvi: -1, demMargin: 4.8, population: 1.4, isBattleground: true,
    demographics: { urban: 60, suburban: 22, rural: 18, collegeEducated: 38, workingClass: 62 }, playerAdSpend: 0, playerVisits: 0
  },
  NJ: {
    code: 'NJ', name: 'New Jersey', electoralVotes: 14, pvi: -6, demMargin: 11, population: 9.3, isBattleground: false,
    demographics: { urban: 95, suburban: 3, rural: 2, collegeEducated: 41, workingClass: 59 }, playerAdSpend: 0, playerVisits: 0
  },
  NM: {
    code: 'NM', name: 'New Mexico', electoralVotes: 5, pvi: -3, demMargin: 9.0, population: 2.1, isBattleground: false,
    demographics: { urban: 77, suburban: 13, rural: 10, collegeEducated: 28, workingClass: 72 }, playerAdSpend: 0, playerVisits: 0
  },
  NY: {
    code: 'NY', name: 'New York', electoralVotes: 28, pvi: -10, demMargin: 19, population: 19.6, isBattleground: false,
    demographics: { urban: 88, suburban: 7, rural: 5, collegeEducated: 38, workingClass: 62 }, playerAdSpend: 0, playerVisits: 0
  },
  NC: {
    code: 'NC', name: 'North Carolina', electoralVotes: 16, pvi: 2, demMargin: -1.2, population: 10.8, isBattleground: true,
    demographics: { urban: 66, suburban: 18, rural: 16, collegeEducated: 33, workingClass: 67 }, playerAdSpend: 0, playerVisits: 0
  },
  ND: {
    code: 'ND', name: 'North Dakota', electoralVotes: 3, pvi: 20, demMargin: -32, population: 0.78, isBattleground: false,
    demographics: { urban: 60, suburban: 18, rural: 22, collegeEducated: 31, workingClass: 69 }, playerAdSpend: 0, playerVisits: 0
  },
  OH: {
    code: 'OH', name: 'Ohio', electoralVotes: 17, pvi: 6, demMargin: -7.8, population: 11.8, isBattleground: true,
    demographics: { urban: 78, suburban: 12, rural: 10, collegeEducated: 29, workingClass: 71 }, playerAdSpend: 0, playerVisits: 0
  },
  OK: {
    code: 'OK', name: 'Oklahoma', electoralVotes: 7, pvi: 20, demMargin: -31, population: 4.0, isBattleground: false,
    demographics: { urban: 66, suburban: 16, rural: 18, collegeEducated: 27, workingClass: 73 }, playerAdSpend: 0, playerVisits: 0
  },
  OR: {
    code: 'OR', name: 'Oregon', electoralVotes: 8, pvi: -6, demMargin: 13, population: 4.2, isBattleground: false,
    demographics: { urban: 81, suburban: 11, rural: 8, collegeEducated: 35, workingClass: 65 }, playerAdSpend: 0, playerVisits: 0
  },
  PA: {
    code: 'PA', name: 'Pennsylvania', electoralVotes: 19, pvi: 0, demMargin: 0.6, population: 13.0, isBattleground: true,
    demographics: { urban: 79, suburban: 11, rural: 10, collegeEducated: 32, workingClass: 68 }, playerAdSpend: 0, playerVisits: 0
  },
  RI: {
    code: 'RI', name: 'Rhode Island', electoralVotes: 4, pvi: -8, demMargin: 17, population: 1.1, isBattleground: false,
    demographics: { urban: 91, suburban: 5, rural: 4, collegeEducated: 35, workingClass: 65 }, playerAdSpend: 0, playerVisits: 0
  },
  SC: {
    code: 'SC', name: 'South Carolina', electoralVotes: 9, pvi: 8, demMargin: -12, population: 5.4, isBattleground: false,
    demographics: { urban: 69, suburban: 17, rural: 14, collegeEducated: 30, workingClass: 70 }, playerAdSpend: 0, playerVisits: 0
  },
  SD: {
    code: 'SD', name: 'South Dakota', electoralVotes: 3, pvi: 16, demMargin: -25, population: 0.91, isBattleground: false,
    demographics: { urban: 57, suburban: 19, rural: 24, collegeEducated: 30, workingClass: 70 }, playerAdSpend: 0, playerVisits: 0
  },
  TN: {
    code: 'TN', name: 'Tennessee', electoralVotes: 11, pvi: 14, demMargin: -22, population: 7.1, isBattleground: false,
    demographics: { urban: 66, suburban: 18, rural: 16, collegeEducated: 29, workingClass: 71 }, playerAdSpend: 0, playerVisits: 0
  },
  TX: {
    code: 'TX', name: 'Texas', electoralVotes: 40, pvi: 5, demMargin: -6.0, population: 30.5, isBattleground: true,
    demographics: { urban: 85, suburban: 9, rural: 6, collegeEducated: 31, workingClass: 69 }, playerAdSpend: 0, playerVisits: 0
  },
  UT: {
    code: 'UT', name: 'Utah', electoralVotes: 6, pvi: 13, demMargin: -20, population: 3.4, isBattleground: false,
    demographics: { urban: 91, suburban: 5, rural: 4, collegeEducated: 35, workingClass: 65 }, playerAdSpend: 0, playerVisits: 0
  },
  VT: {
    code: 'VT', name: 'Vermont', electoralVotes: 3, pvi: -15, demMargin: 35, population: 0.65, isBattleground: false,
    demographics: { urban: 39, suburban: 26, rural: 35, collegeEducated: 40, workingClass: 60 }, playerAdSpend: 0, playerVisits: 0
  },
  VA: {
    code: 'VA', name: 'Virginia', electoralVotes: 13, pvi: -2, demMargin: 7.2, population: 8.7, isBattleground: true,
    demographics: { urban: 76, suburban: 14, rural: 10, collegeEducated: 40, workingClass: 60 }, playerAdSpend: 0, playerVisits: 0
  },
  WA: {
    code: 'WA', name: 'Washington', electoralVotes: 12, pvi: -8, demMargin: 18, population: 7.8, isBattleground: false,
    demographics: { urban: 84, suburban: 9, rural: 7, collegeEducated: 37, workingClass: 63 }, playerAdSpend: 0, playerVisits: 0
  },
  WV: {
    code: 'WV', name: 'West Virginia', electoralVotes: 4, pvi: 23, demMargin: -38, population: 1.8, isBattleground: false,
    demographics: { urban: 49, suburban: 22, rural: 29, collegeEducated: 21, workingClass: 79 }, playerAdSpend: 0, playerVisits: 0
  },
  WI: {
    code: 'WI', name: 'Wisconsin', electoralVotes: 10, pvi: 1, demMargin: 0.4, population: 5.9, isBattleground: true,
    demographics: { urban: 70, suburban: 16, rural: 14, collegeEducated: 31, workingClass: 69 }, playerAdSpend: 0, playerVisits: 0
  },
  WY: {
    code: 'WY', name: 'Wyoming', electoralVotes: 3, pvi: 25, demMargin: -42, population: 0.58, isBattleground: false,
    demographics: { urban: 65, suburban: 15, rural: 20, collegeEducated: 29, workingClass: 71 }, playerAdSpend: 0, playerVisits: 0
  }
};

/**
 * Grid coordinates for cartogram / tile rendering
 */
export const STATE_GRID_LAYOUT: { [code: string]: { row: number; col: number } } = {
  AK: { row: 0, col: 0 },
  ME: { row: 0, col: 10 },
  VT: { row: 1, col: 9 }, NH: { row: 1, col: 10 }, MA: { row: 1, col: 11 },
  WA: { row: 1, col: 0 }, ID: { row: 1, col: 1 }, MT: { row: 1, col: 2 }, ND: { row: 1, col: 3 }, MN: { row: 1, col: 4 }, IL: { row: 1, col: 5 }, WI: { row: 1, col: 6 }, MI: { row: 1, col: 7 }, NY: { row: 1, col: 8 },
  OR: { row: 2, col: 0 }, NV: { row: 2, col: 1 }, WY: { row: 2, col: 2 }, SD: { row: 2, col: 3 }, IA: { row: 2, col: 4 }, IN: { row: 2, col: 5 }, OH: { row: 2, col: 6 }, PA: { row: 2, col: 7 }, NJ: { row: 2, col: 8 }, CT: { row: 2, col: 9 }, RI: { row: 2, col: 10 },
  CA: { row: 3, col: 0 }, UT: { row: 3, col: 1 }, CO: { row: 3, col: 2 }, NE: { row: 3, col: 3 }, MO: { row: 3, col: 4 }, KY: { row: 3, col: 5 }, WV: { row: 3, col: 6 }, VA: { row: 3, col: 7 }, MD: { row: 3, col: 8 }, DE: { row: 3, col: 9 },
  AZ: { row: 4, col: 1 }, NM: { row: 4, col: 2 }, KS: { row: 4, col: 3 }, AR: { row: 4, col: 4 }, TN: { row: 4, col: 5 }, NC: { row: 4, col: 6 }, SC: { row: 4, col: 7 }, DC: { row: 4, col: 8 },
  HI: { row: 5, col: 0 }, OK: { row: 5, col: 3 }, LA: { row: 5, col: 4 }, MS: { row: 5, col: 5 }, AL: { row: 5, col: 6 }, GA: { row: 5, col: 7 },
  TX: { row: 6, col: 3 }, FL: { row: 6, col: 8 }
};
