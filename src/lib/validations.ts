import { z } from "zod";
export const goalSchema = z.object({ thrust_area_id: z.string().uuid(), title: z.string().min(3).max(200), description: z.string().max(1000).optional().default(""), uom_type: z.enum(["min_numeric","max_numeric","min_percent","max_percent","timeline","zero"]), target_value: z.number().nullable(), target_date: z.string().nullable(), weightage: z.number().min(10).max(100) });
export const goalSheetValidation = {
  validateTotalWeightage(goals: { weightage: number }[]) { const total = goals.reduce((s,g)=>s+g.weightage,0); return { valid: total===100, total, message: total===100?"Valid":`Total must be 100%. Current: ${total}%` }; },
  validateGoalCount(count: number) { if (count > 8) return { valid:false, message:`Max 8 goals. Current: ${count}` }; if (count===0) return { valid:false, message:"At least one goal required" }; return { valid:true, message:"Valid" }; },
  validateGoalTarget(uomType: string, targetValue: number|null, targetDate: string|null) { if (uomType==="timeline") { if (!targetDate) return { valid:false, message:"Target date required" }; } else if (uomType!=="zero") { if (targetValue===null) return { valid:false, message:"Target value required" }; if (targetValue<=0) return { valid:false, message:"Target must be > 0" }; } return { valid:true, message:"Valid" }; }
};
