import React from 'react';
import { AdvancedGameState } from '../types/game';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';

interface ProfileLegacyViewProps {
  gameState: AdvancedGameState;
}

export const ProfileLegacyView: React.FC<ProfileLegacyViewProps> = ({ gameState }) => {
  const { politician, radarStats, legacyScore, week, term } = gameState;

  // Radar chart SVG points calculation (5-axis pentagon)
  // Axes: 1. Integrity (top, -90deg), 2. Charisma (right-top, -18deg), 3. Intellect (right-bottom, 54deg),
  // 4. Resilience (left-bottom, 126deg), 5. Authority (left-top, 198deg)
  const center = 100;
  const radius = 75;

  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  const pIntegrity = getCoordinates(radarStats.integrity, -90);
  const pCharisma = getCoordinates(radarStats.charisma, -18);
  const pIntellect = getCoordinates(radarStats.intellect, 54);
  const pResilience = getCoordinates(radarStats.resilience, 126);
  const pAuthority = getCoordinates(radarStats.authority, 198);

  const polygonPath = `${pIntegrity.x},${pIntegrity.y} ${pCharisma.x},${pCharisma.y} ${pIntellect.x},${pIntellect.y} ${pResilience.x},${pResilience.y} ${pAuthority.x},${pAuthority.y}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Hlavička profilu - přesně jako screenshot 15:39 */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-amber-500">
          PREZIDENTKA SPOJENÝCH STÁTŮ AMERICKÝCH
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mt-0.5">
          {politician.firstName} {politician.lastName}
        </h1>
        <div className="text-xs text-slate-400 mt-1">
          {politician.party} · {term}. funkční období · {week}. týden
        </div>
        <div className="text-xs text-amber-400 font-medium">
          Domovský stát: {politician.constituencyOrState}
        </div>
      </div>

      {/* Životní příběh (Backstory) */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          ŽIVOTNÍ PŘÍBĚH A MANDÁT
        </div>

        <div>
          <span className="text-xs text-slate-400">Mandát: </span>
          <strong className="text-xs text-white">{politician.mandate}</strong>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-800/60">
          {politician.backstory.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="text-amber-400 mt-0.5">•</span>
              <span className="text-slate-200">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vůdce opozice */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          VŮDCE OPOZICE V KONGRESU
        </div>

        <div>
          <span className="text-xs text-slate-400">Styl opozice: </span>
          <strong className="text-xs text-white">{politician.oppositionLeader.style}</strong>
          <span className="text-xs text-slate-300 ml-1">({politician.oppositionLeader.name})</span>
        </div>

        <p className="text-xs text-slate-400 italic pt-1">
          {politician.oppositionLeader.quote}
        </p>
      </div>

      {/* Osobní statistiky & Radarový graf - přesně jako screenshot 15:39 */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold text-center">
          OSOBNÍ STATISTIKY POLITIKA (RADAR CHART)
        </div>

        {/* SVG Pentagon Radar Chart */}
        <div className="flex justify-center py-2">
          <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible">
            {/* Background concentric web polygons */}
            {[0.25, 0.5, 0.75, 1.0].map((level) => {
              const pts = [-90, -18, 54, 126, 198]
                .map((deg) => {
                  const { x, y } = getCoordinates(level * 100, deg);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={pts}
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.25)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Connecting spokes */}
            {[-90, -18, 54, 126, 198].map((deg) => {
              const { x, y } = getCoordinates(100, deg);
              return (
                <line
                  key={deg}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(100, 116, 139, 0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Player's stat polygon (Purple tinted) */}
            <polygon
              points={polygonPath}
              fill="rgba(168, 85, 247, 0.25)"
              stroke="#a855f7"
              strokeWidth="2"
            />

            {/* Vertex dots */}
            {[pIntegrity, pCharisma, pIntellect, pResilience, pAuthority].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#c084fc" />
            ))}

            {/* Labels around axes */}
            <text x="100" y="10" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              INTEGRITA
            </text>
            <text x="190" y="75" textAnchor="start" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              CHARISMA
            </text>
            <text x="160" y="185" textAnchor="start" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              INTELEKT
            </text>
            <text x="40" y="185" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              ODOLNOST
            </text>
            <text x="10" y="75" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              AUTORITA
            </text>
          </svg>
        </div>

        {/* Hodnoty pod grafem */}
        <div className="grid grid-cols-5 text-center font-mono border-t border-slate-800/60 pt-3">
          <div>
            <div className="text-[10px] text-slate-400">INTEGRITA</div>
            <div className="text-sm font-bold text-white mt-0.5">{radarStats.integrity}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">CHARISMA</div>
            <div className="text-sm font-bold text-white mt-0.5">{radarStats.charisma}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">INTELEKT</div>
            <div className="text-sm font-bold text-white mt-0.5">{radarStats.intellect}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">ODOLNOST</div>
            <div className="text-sm font-bold text-white mt-0.5">{radarStats.resilience}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">AUTORITA</div>
            <div className="text-sm font-bold text-white mt-0.5">{radarStats.authority}</div>
          </div>
        </div>
      </div>

      {/* Skóre odkazu (Legacy Score) - přesně jako screenshot 15:39 */}
      <div className="bg-[#12161f] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          HISTORICKÝ ODKAZ PREZIDENSTVÍ (LEGACY)
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-emerald-400">
              {legacyScore.overall}
            </span>
            <span className="text-base font-bold text-emerald-400 uppercase tracking-wide">
              {legacyScore.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 italic mt-0.5">
            Kompetentní lídr — úspěšné zvládnutí složité situace a zachování stability národa.
          </p>
        </div>

        <div className="space-y-2 border-t border-slate-800/60 pt-3 text-xs">
          {[
            { label: 'Ekonomika a životní úroveň (20 %)', value: legacyScore.economy },
            { label: 'Pracující a zaměstnanost (18 %)', value: legacyScore.workers },
            { label: 'Spokojenost občanů (18 %)', value: legacyScore.wellbeing },
            { label: 'Veřejné služby a školství (18 %)', value: legacyScore.publicServices },
            { label: 'Dostupnost bydlení (14 %)', value: legacyScore.housing },
            { label: 'Společenská soudržnost a mír (12 %)', value: legacyScore.socialCohesion },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-0.5 font-mono">
              <span className="text-slate-300 font-sans">{item.label}</span>
              <span className="font-bold text-emerald-400">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
