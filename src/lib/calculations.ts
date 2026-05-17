import type { UomType } from "./types";
export function calculateProgressScore(uomType: UomType, targetValue: number|null, actualValue: number|null, targetDate: string|null, actualDate: string|null): number {
  switch (uomType) {
    case "min_numeric": case "min_percent":
      if (targetValue && targetValue > 0 && actualValue !== null) return Math.min(Math.round((actualValue / targetValue) * 10000) / 100, 150);
      return 0;
    case "max_numeric": case "max_percent":
      if (actualValue && actualValue > 0 && targetValue !== null) return Math.min(Math.round((targetValue / actualValue) * 10000) / 100, 150);
      return 0;
    case "timeline":
      if (actualDate && targetDate) { const a = new Date(actualDate); const t = new Date(targetDate); if (a <= t) return 100; const days = Math.floor((a.getTime()-t.getTime())/(1000*60*60*24)); return Math.max(100-days*2,0); }
      return 0;
    case "zero":
      return (actualValue !== null && actualValue === 0) ? 100 : 0;
    default: return 0;
  }
}
export function getProgressColor(score: number): string { if (score >= 90) return "text-green-600"; if (score >= 70) return "text-yellow-600"; if (score >= 50) return "text-orange-600"; return "text-red-600"; }
export function getProgressBgColor(score: number): string { if (score >= 90) return "bg-green-500"; if (score >= 70) return "bg-yellow-500"; if (score >= 50) return "bg-orange-500"; return "bg-red-500"; }
