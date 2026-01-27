'use client';

import { CLASS_LIST, RESIST_TYPES, TARGET_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface SpellFilterValues {
  className?: string;
  minLevel?: string;
  maxLevel?: string;
  resist?: string;
  target?: string;
  beneficial?: string;
}

interface SpellFiltersProps {
  values: SpellFilterValues;
  onChange: (values: SpellFilterValues) => void;
}

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#64748b] mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm',
          'text-[#e2e8f0] focus:outline-none focus:border-[#C9A554]/50',
          !value && 'text-[#64748b]'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function SpellFilters({ values, onChange }: SpellFiltersProps) {
  const update = (key: keyof SpellFilterValues, val: string) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <div className="p-4 bg-[#141824] border border-[#2A3347] rounded-lg">
      <h3 className="text-sm font-medium text-[#C9A554] mb-3">Filters</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SelectField
          label="Class"
          value={values.className || ''}
          onChange={v => update('className', v)}
          options={CLASS_LIST}
          placeholder="Any class"
        />
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1">Min Level</label>
          <input
            type="number"
            min="1"
            max="255"
            value={values.minLevel || ''}
            onChange={e => update('minLevel', e.target.value)}
            placeholder="1"
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1">Max Level</label>
          <input
            type="number"
            min="1"
            max="255"
            value={values.maxLevel || ''}
            onChange={e => update('maxLevel', e.target.value)}
            placeholder="255"
            className="w-full px-3 py-2 bg-[#1a1f2e] border border-[#2A3347] rounded-lg text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#C9A554]/50"
          />
        </div>
        <SelectField
          label="Resist"
          value={values.resist || ''}
          onChange={v => update('resist', v)}
          options={RESIST_TYPES}
          placeholder="Any resist"
        />
        <SelectField
          label="Target"
          value={values.target || ''}
          onChange={v => update('target', v)}
          options={TARGET_TYPES}
          placeholder="Any target"
        />
        <SelectField
          label="Type"
          value={values.beneficial || ''}
          onChange={v => update('beneficial', v)}
          options={['Beneficial', 'Detrimental'] as const}
          placeholder="Any type"
        />
      </div>
    </div>
  );
}
