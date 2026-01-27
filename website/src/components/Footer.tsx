export function Footer() {
  return (
    <footer className="border-t border-[#2A3347] bg-[#0C0E14] mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#64748b]">
            <span className="font-[family-name:var(--font-heading)] text-[#C9A554]">
              EQ Encyclopedia
            </span>
            {' '}&mdash; EverQuest game data reference. Not affiliated with Darkpaw Games.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/ArtSabintsev/everquest-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8BA4B8] hover:text-[#C9A554] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[#2A3347]">|</span>
            <span className="text-[#64748b]">
              Powered by everquest-mcp
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
