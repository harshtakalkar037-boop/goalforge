import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, CHECKIN_STATUS_LABELS } from "@/lib/constants";
import { capitalizeFirst } from "@/lib/utils";
export function StatusBadge({ status, type="goal", className }: { status:string; type?:"goal"|"checkin"; className?:string }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
  const label = type==="checkin" ? CHECKIN_STATUS_LABELS[status] || capitalizeFirst(status) : capitalizeFirst(status);
  return (<Badge variant="outline" className={cn(colorClass, "border-0", className)}>{label}</Badge>);
}