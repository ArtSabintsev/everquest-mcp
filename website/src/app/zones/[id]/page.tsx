export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocalZone, getZoneMapPOIs } from '@/lib/data';
import { ExpansionBadge } from '@/components/Badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default async function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const zone = await getLocalZone(id).catch(() => null);

  if (!zone) {
    notFound();
  }

  const pois = await getZoneMapPOIs(zone.name).catch(() => null);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748b]">
        <Link href="/zones" className="hover:text-[#8BA4B8]">Zones</Link>
        <span className="mx-2">/</span>
        <span className="text-[#e2e8f0]">{zone.name}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#C9A554] mb-3">
          {zone.name}
        </h1>
        <div className="flex flex-wrap gap-2">
          {zone.levelRange && (
            <span className="text-sm px-3 py-1 rounded bg-[#67B23D]/15 text-[#67B23D]">
              Level {zone.levelRange}
            </span>
          )}
          {zone.expansion && <ExpansionBadge name={zone.expansion} />}
          {zone.continent && (
            <span className="text-sm px-3 py-1 rounded bg-[#8BA4B8]/15 text-[#8BA4B8]">
              {zone.continent}
            </span>
          )}
        </div>
      </div>

      {/* Connected Zones */}
      {zone.connectedZones && zone.connectedZones.length > 0 && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Connected Zones
          </h2>
          <div className="flex flex-wrap gap-2">
            {zone.connectedZones.map(z => (
              <span key={z} className="text-sm px-3 py-1.5 bg-[#1a1f2e] border border-[#2A3347] rounded-md text-[#8BA4B8]">
                {z}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Notable Locations */}
      {zone.notableLocations && zone.notableLocations.length > 0 && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Notable Locations
          </h2>
          <div className="space-y-3">
            {zone.notableLocations.map((loc, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-[#e2e8f0] font-medium">{loc.name}</span>
                {loc.description && <span className="text-[#94a3b8]">- {loc.description}</span>}
                {loc.coordinates && (
                  <span className="text-[#64748b] shrink-0">
                    ({loc.coordinates.x}, {loc.coordinates.y}{loc.coordinates.z !== undefined ? `, ${loc.coordinates.z}` : ''})
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POIs from maps */}
      {pois && (
        <section className="bg-[#141824] border border-[#2A3347] rounded-lg p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#C9A554] mb-4">
            Map Points of Interest
          </h2>
          <MarkdownRenderer content={pois} />
        </section>
      )}
    </div>
  );
}
