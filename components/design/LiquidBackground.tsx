export function LiquidBackground() {
  return (
    <div aria-hidden className="liquid-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="liquid-blob liquid-blob-1" />
      <div className="liquid-blob liquid-blob-2" />
      <div className="liquid-blob liquid-blob-3" />
      <div className="liquid-blob liquid-blob-4" />
      <div className="liquid-noise" />
    </div>
  );
}
