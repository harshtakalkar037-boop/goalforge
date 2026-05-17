import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: string | null | undefined): string { if (!date) return "—"; return new Date(date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
export function formatDateTime(date: string | null | undefined): string { if (!date) return "—"; return new Date(date).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); }
export function getInitials(name: string): string { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }
export function capitalizeFirst(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " "); }
export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [headers.join(","), ...data.map((row) => headers.map((h) => { const v = row[h]; const s = v === null || v === undefined ? "" : String(v); return `"${s.replace(/"/g, '""')}"` }).join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}
