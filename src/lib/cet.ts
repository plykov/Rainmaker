export const CET_TZ = "Europe/Berlin";

export function cetParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CET_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    weekday: get("weekday"),
    day: get("day"),
    month: get("month"),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
    hm: `${get("hour")}:${get("minute")}`,
  };
}

function elapsedSeconds(d: Date) {
  const { hour, minute, second } = cetParts(d);
  return hour * 3600 + minute * 60 + second;
}

export function nextHalfHour(d: Date): { label: string; seconds: number } {
  const elapsed = elapsedSeconds(d);
  const next = (Math.floor(elapsed / 1800) + 1) * 1800;
  const seconds = next - elapsed;
  const nh = Math.floor((next % 86400) / 3600);
  const nm = Math.floor((next % 3600) / 60);
  return {
    label: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")} CET`,
    seconds,
  };
}

export function nextSevenCet(d: Date): { label: string; seconds: number; isToday: boolean } {
  const elapsed = elapsedSeconds(d);
  const seven = 7 * 3600;
  if (elapsed < seven) {
    return { label: "07:00 CET today", seconds: seven - elapsed, isToday: true };
  }
  return {
    label: "07:00 CET tomorrow",
    seconds: 86400 - elapsed + seven,
    isToday: false,
  };
}

export function secondsLabel(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function cetStamp(d: Date): string {
  return `${cetParts(d).hm} CET`;
}
