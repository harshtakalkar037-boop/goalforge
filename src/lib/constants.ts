export const UOM_LABELS: Record<string,string> = { min_numeric:"Numeric (Higher is Better)", max_numeric:"Numeric (Lower is Better)", min_percent:"Percentage (Higher is Better)", max_percent:"Percentage (Lower is Better)", timeline:"Timeline (Date-based)", zero:"Zero-based (Zero = Success)" };
export const UOM_SHORT_LABELS: Record<string,string> = { min_numeric:"Min (Numeric)", max_numeric:"Max (Numeric)", min_percent:"Min (%)", max_percent:"Max (%)", timeline:"Timeline", zero:"Zero" };
export const STATUS_COLORS: Record<string,string> = { draft:"bg-gray-100 text-gray-700", submitted:"bg-blue-100 text-blue-700", approved:"bg-green-100 text-green-700", rejected:"bg-red-100 text-red-700", not_started:"bg-gray-100 text-gray-700", on_track:"bg-yellow-100 text-yellow-700", completed:"bg-green-100 text-green-700" };
export const CHECKIN_STATUS_LABELS: Record<string,string> = { not_started:"Not Started", on_track:"On Track", completed:"Completed" };
export const MAX_GOALS = 8;
export const MIN_WEIGHTAGE = 10;
export const REQUIRED_TOTAL_WEIGHTAGE = 100;
export const QUARTERS = [ { value:"Q1", label:"Q1 Check-in", months:"July" }, { value:"Q2", label:"Q2 Check-in", months:"October" }, { value:"Q3", label:"Q3 Check-in", months:"January" }, { value:"Q4", label:"Q4 / Annual", months:"March/April" } ];
