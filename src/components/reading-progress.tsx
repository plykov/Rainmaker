import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max <= 0 ? 0 : el.scrollTop / max);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-0.5 bg-transparent">
      <div
        className="reading-progress h-full bg-accent"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}
