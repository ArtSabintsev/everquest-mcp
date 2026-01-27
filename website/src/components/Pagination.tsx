'use client';

import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          'px-3 py-1.5 text-sm rounded-md transition-colors',
          page <= 1
            ? 'text-[#3a4560] cursor-not-allowed'
            : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#141824]'
        )}
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#64748b]">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              p === page
                ? 'bg-[#C9A554]/15 text-[#C9A554] border border-[#C9A554]/30'
                : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#141824]'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          'px-3 py-1.5 text-sm rounded-md transition-colors',
          page >= totalPages
            ? 'text-[#3a4560] cursor-not-allowed'
            : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#141824]'
        )}
      >
        Next
      </button>
    </div>
  );
}
