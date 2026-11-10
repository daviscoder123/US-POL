import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const rawApiKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && !rawApiKey.includes('PLACEHOLDER') ? rawApiKey : '';

const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy-key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

async function generateWithTimeout(params: any, timeoutMs: number = 8000) {
  return Promise.race([
    ai.models.generateContent(params),
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI generation timeout')), timeoutMs)),
  ]) as Promise<any>;
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: MODEL_NAME,
  });
});

/**
 * 1. AI Bill Analysis & CBO Scoring
 */
app.post('/api/ai/bill-analysis', async (req: Request, res: Response) => {
  const { title, category, summary, playerRole, playerParty } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Bill title is required' });
  }

  if (apiKey) {
    try {
      const prompt = `You are the Congressional Budget Office (CBO) and Capitol Hill Legislative Assessment engine for a realistic US politics simulation game.
Analyze this proposed legislation:
Title: "${title}"
Category: ${category}
Summary: "${summary || 'No summary provided'}"
Sponsor: ${playerRole} (${playerParty})

Return ONLY a valid JSON object matching this schema:
{
  "economicCostBillion": number (estimated 10-year budget effect; negative if revenue/surplus, positive if net new spending, e.g. 150 or -40),
  "economicImpactRating": string (one of: "Strongly Positive", "Moderate Growth", "Neutral", "Inflationary Risk", "Fiscal Strain"),
  "demSupport": number (0 to 100 percentage support among Democratic lawmakers),
  "repSupport": number (0 to 100 percentage support among Republican lawmakers),
  "publicSupport": number (0 to 100 percentage general public approval),
  "analysis": string (2 sharp sentences on the policy merits, CBO score, and partisan flashpoints),
  "headline": string (one realistic major newspaper headline about this bill)
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini bill analysis fallback due to:', err?.message || err);
    }
  }

  // High-quality deterministic fallback
  const isSpending = /infrastructure|health|climate|education|relief|childcare|defense/i.test(title);
  const isTax = /tax|revenue|tariff|deduction/i.test(title);
  const cost = isSpending ? 185 : isTax ? -75 : 45;
  const demSup = playerParty === 'Democratic' ? 88 : 28;
  const repSup = playerParty === 'Republican' ? 86 : 22;

  return res.json({
    economicCostBillion: cost,
    economicImpactRating: cost > 100 ? 'Moderate Growth' : 'Fiscal Strain',
    demSupport: demSup,
    repSupport: repSup,
    publicSupport: Math.round((demSup + repSup) / 2 + 8),
    analysis: `The CBO projects this measure would affect federal deficits by $${Math.abs(cost)}B over a 10-year window. Whip counts suggest a tight floor battle along partisan fault lines.`,
    headline: `Capitol Hill Braces for Bitter Clashes Over Proposed "${title}"`,
  });
});

/**
 * 2. Press Conference Questions
 */
app.post('/api/ai/press-questions', async (req: Request, res: Response) => {
  const { playerRole, playerParty, approval, week, gdpGrowth, inflationRate, lastEvent } = req.body;

  if (apiKey) {
    try {
      const prompt = `You are the White House and Capitol Hill press corps covering a realistic US politics simulation.
The player is a ${playerRole} (${playerParty}), current national approval: ${approval}%, Week ${week}.
GDP Growth: ${gdpGrowth}%, Inflation: ${inflationRate}%.
Recent event/policy: ${lastEvent || 'General legislative session'}.

Generate 3 realistic, probing press questions from different reporters (e.g., NYT, Fox News, CNN, WSJ, AP).
Return ONLY a valid JSON array matching this format:
[
  {
    "id": "q1",
    "reporter": "string (name)",
    "outlet": "string (outlet)",
    "question": "string (tough, realistic journalistic question)",
    "category": "string (Economy / Foreign Policy / Scandal / Governance)",
    "suggestedAnswers": [
      {
        "label": "string (short tactical stance)",
        "description": "string (brief summary of this response)",
        "ideologyShift": { "capitalChange": number (-5 to 5), "approvalDelta": number (-2.0 to 2.0) }
      },
      {
        "label": "string (alternative stance)",
        "description": "string",
        "ideologyShift": { "capitalChange": number, "approvalDelta": number }
      }
    ]
  }
]`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini press questions fallback:', err?.message || err);
    }
  }

  // Fallback press questions
  return res.json([
    {
      id: 'q1',
      reporter: 'Rachel Kelly',
      outlet: 'The Washington Post',
      question: `With national inflation hovering at ${inflationRate || 3.1}% and families feeling squeezed at the grocery store, how do you justify your current economic agenda?`,
      category: 'Economy',
      suggestedAnswers: [
        {
          label: 'Defend Economic Fundamentals',
          description: 'Highlight wage growth, low unemployment, and blame global supply chain pressures.',
          ideologyShift: { capitalChange: 2, approvalDelta: 0.8 },
        },
        {
          label: 'Pivot to Bipartisan Relief',
          description: 'Promise targeted middle-class tax relief and crackdowns on corporate price gouging.',
          ideologyShift: { capitalChange: -3, approvalDelta: 1.5 },
        },
      ],
    },
    {
      id: 'q2',
      reporter: 'David Vance',
      outlet: 'Fox News',
      question: 'Critics across the aisle claim your administration is catering strictly to your ideological base at the expense of national unity. What is your response?',
      category: 'Politics',
      suggestedAnswers: [
        {
          label: 'Strike a Bipartisan Tone',
          description: 'Emphasize your willingness to compromise and reach across the aisle for common ground.',
          ideologyShift: { capitalChange: -5, approvalDelta: 1.2 },
        },
        {
          label: 'Double Down on Mandate',
          description: 'Assert that the American people elected your party to deliver bold, unapologetic change.',
          ideologyShift: { capitalChange: 5, approvalDelta: -0.5 },
        },
      ],
    },
    {
      id: 'q3',
      reporter: 'Dana Rodriguez',
      outlet: 'CNN',
      question: 'Key swing voters in Pennsylvania and Wisconsin express anxiety over international conflicts and defense spending. What reassurance can you offer them?',
      category: 'Foreign Policy',
      suggestedAnswers: [
        {
          label: 'Peace Through Strength',
          description: 'Reaffirm unwavering commitments to democratic allies while deterring adversaries.',
          ideologyShift: { capitalChange: 1, approvalDelta: 0.6 },
        },
        {
          label: 'America First Focus',
          description: 'Argue that domestic priorities must take precedence before foreign entanglements.',
          ideologyShift: { capitalChange: 2, approvalDelta: 0.4 },
        },
      ],
    },
  ]);
});

/**
 * 3. Press Answer Evaluation
 */
app.post('/api/ai/evaluate-press-answer', async (req: Request, res: Response) => {
  const { question, answer, reporter, outlet, playerRole, playerParty } = req.body;

  if (apiKey) {
    try {
      const prompt = `You are a political pundit and communications strategist in a US politics simulation.
The ${playerRole} (${playerParty}) answered a question from ${reporter} (${outlet}).
Question: "${question}"
Politician Answer: "${answer}"

Evaluate the answer. Return ONLY a JSON object:
{
  "grade": "string (A, B, C, D, or F)",
  "pressReaction": "string (1 realistic sentence describing the press room atmosphere and journalistic take)",
  "approvalDelta": number (between -3.0 and +3.0 percentage points shift in public approval),
  "capitalDelta": number (between -10 and +10 political capital change),
  "punditQuote": "string (a 1-sentence quote from a cable news host analyzing the clip)"
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini press answer fallback:', err?.message || err);
    }
  }

  const length = (answer || '').trim().length;
  const delta = length > 40 ? 1.2 : 0.2;
  return res.json({
    grade: length > 60 ? 'A-' : 'B',
    pressReaction: `Reporters noted the politician's poised demeanor, though follow-ups pressed on implementation specifics.`,
    approvalDelta: delta,
    capitalDelta: 2,
    punditQuote: `"A solid, measured answer that reassures moderates without alienating the base."`,
  });
});

/**
 * 4. Executive AI Chat (Multi-turn presidential governance chat)
 */
app.post('/api/ai/executive-chat', async (req: Request, res: Response) => {
  const { history = [], message, gameState } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Zpráva prezidenta je povinná.' });
  }

  const stage = gameState?.career?.stage || 'mayor';
  const roleTitle = gameState?.career?.stageTitle || gameState?.politician?.title || 'Starostka města Scranton, PA';
  const location = gameState?.career?.cityName ? `${gameState.career.cityName}, ${gameState.career.stateName}` : 'USA';

  const systemInstruction = `Jsi vrchní politický a právní poradce v realistickém americkém politickém simulátoru Statecraft.
Mluvíš výhradně česky. Komunikuješ přímo s politikem: ${gameState?.politician?.firstName || 'Sarah'} ${gameState?.politician?.lastName || 'Montgomeryová'} (${gameState?.politician?.party || 'Democratic'}).
Jeho aktuální úřad: ${roleTitle} (${location}).
Kariérní úroveň hráče: ${stage} (1 = Starosta města, 2 = Guvernér státu, 3 = Senátor USA, 4 = Prezident USA v Bílém domě).
Místní / celostátní podpora: ${gameState?.overallApproval || 68}%.

Pravidla pro odpověď podle aktuálního úřadu:
- Pokud je hráč STAROSTA: Odpovídej jako městský manažer nebo šéf štábu radnice. Řeš městskou policii, školy, místní vyhlášky, schvalování investic, městskou daň a komunální krize.
- Pokud je hráč GUVERNÉR: Odpovídej jako šéf kanceláře guvernéra. Řeš státní rozpočet, nasazení Národní gardy, dálnice, právo veta nad zákony státu a obranu pravomocí podle 10. dodatku Ústavy USA.
- Pokud je hráč SENÁTOR: Odpovídej jako legislativní ředitel Senátu USA. Řeš federální zákony, filibuster (60 hlasů v Senátu), slyšení v Kongresu a potvrzování soudců.
- Pokud je hráč PREZIDENT: Odpovídej jako šéfka kanceláře Bílého domu a White House Counsel. Řeš prezidentské dekrety (Executive Orders), vrchní velení ozbrojeným silám, ústavní test před Nejvyšším soudem (SCOTUS) a globální velmocenskou politiku.

Vždy reaguj věcně, státnicky a s hlubokou znalostí amerického ústavního systému. Pokud hráč dává konkrétní pokyn k provedení (vyhláška, rozkaz, dekret), potvrď jeho exekutivní zaevidování a popiš politický i rozpočtový dopad.`;

  if (apiKey) {
    try {
      // Map history into format expected by SDK
      const contents = history.map((item: any) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }],
      }));

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await generateWithTimeout({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.warn('Gemini executive chat fallback:', err?.message || err);
    }
  }

  // Realistický záložní režim
  let reply = `Rozumím, pane prezidente. Váš pokyn jsem zaznamenala a předávám legislativnímu týmu v Západním křídle. `;
  if (/daň|daně|tax/i.test(message)) {
    reply += `Úprava daňových sazeb ovlivní výnos státní pokladny a spotřebitelskou náladu. Připravujeme výpočet pro rozpočtový výbor Kongresu.`;
  } else if (/senát|kongres|hlas/i.test(message)) {
    reply += `V Senátu prověřujeme pozice nerozhodnutých senátorů za swing states. K prolomení obstrukcí budeme potřebovat disciplínu celé strany.`;
  } else if (/dekret|příkaz|order/i.test(message)) {
    reply += `Právní kancelář Bílého domu vypracovala návrh prezidentského exekutivního příkazu tak, aby obstál před federálními soudy.`;
  } else {
    reply += `Situaci v Bílém domě koordinujeme a sledujeme okamžitou reakci finančních trhů a tiskového střediska.`;
  }

  return res.json({ reply });
});

/**
 * 5. Presidential Debate Rebuttal & Scoring
 */
app.post('/api/ai/debate-round', async (req: Request, res: Response) => {
  const { topic, playerStatement, opponentName, opponentParty, playerParty } = req.body;

  if (apiKey) {
    try {
      const prompt = `You are the debate simulation engine for a nationally televised US Presidential / Senate Debate.
Topic: "${topic}"
Player (${playerParty}) statement: "${playerStatement}"
Opponent: ${opponentName} (${opponentParty})

Generate:
1. A sharp, articulate 2-sentence rebuttal from ${opponentName} challenging the player's statement and policy record.
2. The instant snap poll / focus group dial winner for this exchange.
3. Polling swing percentage (-2.5 to +2.5 for player).

Return ONLY JSON:
{
  "opponentRebuttal": "string",
  "moderatorSummary": "string",
  "focusGroupWinner": "Player" | "Opponent" | "Draw",
  "pollingShift": number
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini debate fallback:', err?.message || err);
    }
  }

  return res.json({
    opponentRebuttal: `My opponent speaks of ambition, but when you look at the real costs, it's middle-class taxpayers who foot the bill while Washington bureaucrats expand their reach.`,
    moderatorSummary: `A fierce exchange that highlighted contrasting economic philosophies for the nation's future.`,
    focusGroupWinner: 'Player',
    pollingShift: 0.8,
  });
});

/**
 * 6. Dynamic Crisis Generator
 */
app.post('/api/ai/generate-crisis', async (req: Request, res: Response) => {
  const { week, approval, metrics } = req.body;

  if (apiKey) {
    try {
      const prompt = `Generate a realistic, unexpected national crisis for a US political simulation game.
Current metrics: Inflation ${metrics?.inflationRate}%, GDP ${metrics?.gdpGrowth}%, Approval ${approval}%, Week ${week}.

Return ONLY JSON:
{
  "id": "crisis_${Date.now()}",
  "title": "string (dramatic realistic crisis title)",
  "severity": "Warning" | "High Emergency" | "National Crisis",
  "description": "string (2-3 sentences explaining the emergency)",
  "options": [
    {
      "id": "opt1",
      "title": "string (action title)",
      "description": "string (what action is taken)",
      "capitalCost": number (10 to 30),
      "expectedOutcome": "string (political & public consequence)"
    },
    {
      "id": "opt2",
      "title": "string",
      "description": "string",
      "capitalCost": number,
      "expectedOutcome": "string"
    },
    {
      "id": "opt3",
      "title": "string",
      "description": "string",
      "capitalCost": number,
      "expectedOutcome": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini crisis generator fallback:', err?.message || err);
    }
  }

  return res.json({
    id: `crisis_${Date.now()}`,
    title: 'Impending Federal Government Shutdown Brinkmanship',
    severity: 'High Emergency',
    description: 'Fiscal year funding expires in 72 hours. Hardliners in Congress refuse to pass a continuing resolution without steep spending cuts, threatening federal worker furloughs and stock market jitters.',
    options: [
      {
        id: 'opt1',
        title: 'Sign Bipartisan Stopgap Resolution',
        description: 'Accept modest spending caps to keep the government open for 90 days.',
        capitalCost: 15,
        expectedOutcome: 'Averts shutdown; stabilizes markets (+1.2% approval), but frustrates party base.',
      },
      {
        id: 'opt2',
        title: 'Hold the Line & Veto Spending Cuts',
        description: 'Blame congressional obstructionists on prime-time television and refuse any concessions.',
        capitalCost: 25,
        expectedOutcome: 'Government shuts down for 5 days. Energizes base, but swing voter anxiety spikes.',
      },
      {
        id: 'opt3',
        title: 'Executive Emergency Reprogramming',
        description: 'Use presidential executive authority to divert discretionary accounts to critical agencies.',
        capitalCost: 20,
        expectedOutcome: 'Keeps essential services operating; faces swift legal challenges from state attorneys general.',
      },
    ],
  });
});

// Setup dev server with Vite or static production serving
async function startServer() {
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Statecraft US Politics Simulator running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
