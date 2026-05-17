"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const data = [
  { name: "Priya S.", score: 84 },
  { name: "Ravi M.", score: 91 },
  { name: "Anita D.", score: 62 },
  { name: "Suresh K.", score: 55 },
  { name: "Meena J.", score: 78 },
  { name: "Vikram N.", score: 43 },
  { name: "Lalita R.", score: 72 },
  { name: "Arun P.", score: 67 },
];

export function TeamPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        <ReferenceLine y={70} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Target", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.score >= 70 ? "#10b981" : entry.score >= 55 ? "#f59e0b" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
