import Link from 'next/link';
import type { ZoneData } from '@/lib/data';
import { ExpansionBadge } from './Badge';

export function ZoneCard({ zone }: { zone: ZoneData }) {
  return (
    <Link
      href={`/zones/${zone.id}`}
      className="block p-4 bg-[#141824] border border-[#2A3347] rounded-lg hover:border-[#C9A554]/30 hover:bg-[#1a2030] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[#e2e8f0] font-medium">{zone.name}</h3>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {zone.levelRange && (
          <span className="text-xs px-2 py-0.5 rounded bg-[#67B23D]/15 text-[#67B23D]">
            Level {zone.levelRange}
          </span>
        )}
        {zone.expansion && <ExpansionBadge name={zone.expansion} />}
        {zone.continent && (
          <span className="text-xs px-2 py-0.5 rounded bg-[#8BA4B8]/15 text-[#8BA4B8]">
            {zone.continent}
          </span>
        )}
      </div>
      {zone.connectedZones && zone.connectedZones.length > 0 && (
        <div className="text-xs text-[#64748b]">
          Connects to: {zone.connectedZones.slice(0, 3).join(', ')}
          {zone.connectedZones.length > 3 && ` +${zone.connectedZones.length - 3} more`}
        </div>
      )}
    </Link>
  );
}
