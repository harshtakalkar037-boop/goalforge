"use client";

import { Trophy, Medal, Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const leaderboard = [
  { rank: 1, name: "Ravi Menon", dept: "Quality", score: 91, badges: 5, streak: 4, change: "same" },
  { rank: 2, name: "Priya Sharma", dept: "Engineering", score: 84, badges: 4, streak: 3, change: "up" },
  { rank: 3, name: "Lalita Rao", dept: "Strategy", score: 82, badges: 3, streak: 2, change: "up" },
  { rank: 4, name: "Meena Joshi", dept: "Analytics", score: 78, badges: 3, streak: 2, change: "down" },
  { rank: 5, name: "Arun Pillai", dept: "Engineering", score: 67, badges: 2, streak: 1, change: "same" },
  { rank: 6, name: "Anita Desai", dept: "Design", score: 62, badges: 2, streak: 0, change: "down" },
  { rank: 7, name: "Suresh Kumar", dept: "Engineering", score: 55, badges: 1, streak: 0, change: "down" },
  { rank: 8, name: "Vikram Nair", dept: "Engineering", score: 43, badges: 1, streak: 0, change: "down" },
];

const rankMedal = (rank: number) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
};

const changeIcon = (change: string) => {
  if (change === "up") return <span className="text-green-600 text-xs font-bold">↑</span>;
  if (change === "down") return <span className="text-red-600 text-xs font-bold">↓</span>;
  return <span className="text-muted-foreground text-xs">—</span>;
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Team performance rankings · FY 2025–26 Q2</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, i) => (
          <Card key={p.rank} className={`text-center ${i === 1 ? "border-yellow-300 bg-yellow-50/50 -mt-4" : ""}`}>
            <CardContent className="p-4">
              <div className="flex justify-center mb-2">{rankMedal(p.rank)}</div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-xs font-bold text-primary">
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <p className="font-semibold text-xs leading-tight">{p.name.split(" ")[0]}</p>
              <p className={`text-lg font-bold mt-1 ${i === 1 ? "text-yellow-600" : "text-primary"}`}>{p.score}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4" />Full Rankings</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {leaderboard.map(person => (
              <div key={person.rank} className={`flex items-center gap-4 p-4 hover:bg-accent/20 transition-colors ${person.name === "Priya Sharma" ? "bg-primary/5" : ""}`}>
                <div className="w-8 flex justify-center shrink-0">{rankMedal(person.rank)}</div>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {person.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{person.name}</p>
                    {person.name === "Priya Sharma" && <Badge className="text-xs bg-primary/10 text-primary">You</Badge>}
                    {changeIcon(person.change)}
                  </div>
                  <p className="text-xs text-muted-foreground">{person.dept}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: person.badges }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                {person.streak > 0 && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 hidden sm:flex">🔥 {person.streak} streak</Badge>
                )}
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold ${person.score >= 80 ? "text-green-600" : person.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>{person.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
