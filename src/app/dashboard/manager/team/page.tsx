"use client";

import { Users, TrendingUp, Target, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const team = [
  { id: "1", name: "Priya Sharma", designation: "Senior Engineer", department: "Engineering", goals: 5, approved: 5, progress: 84, checkinStatus: "Q2 Submitted" },
  { id: "2", name: "Ravi Menon", designation: "QA Lead", department: "Quality", goals: 4, approved: 4, progress: 91, checkinStatus: "Q2 Submitted" },
  { id: "3", name: "Anita Desai", designation: "Product Designer", department: "Design", goals: 4, approved: 3, progress: 62, checkinStatus: "Pending" },
  { id: "4", name: "Suresh Kumar", designation: "Backend Developer", department: "Engineering", goals: 5, approved: 4, progress: 55, checkinStatus: "Overdue" },
  { id: "5", name: "Meena Joshi", designation: "Data Analyst", department: "Analytics", goals: 3, approved: 3, progress: 78, checkinStatus: "Q2 Submitted" },
  { id: "6", name: "Vikram Nair", designation: "DevOps Engineer", department: "Engineering", goals: 4, approved: 0, progress: 0, checkinStatus: "Not Started" },
  { id: "7", name: "Lalita Rao", designation: "Business Analyst", department: "Strategy", goals: 4, approved: 4, progress: 72, checkinStatus: "Q2 Submitted" },
  { id: "8", name: "Arun Pillai", designation: "Frontend Developer", department: "Engineering", goals: 5, approved: 5, progress: 67, checkinStatus: "Pending" },
];

export default function ManagerTeamPage() {
  const avgProgress = Math.round(team.reduce((a, m) => a + m.progress, 0) / team.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your team's goal progress and check-in status</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Team Size", value: team.length, icon: Users },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp },
          { label: "Goals Approved", value: team.reduce((a, m) => a + m.approved, 0), icon: Target },
          { label: "Check-ins Pending", value: team.filter(m => m.checkinStatus === "Pending" || m.checkinStatus === "Overdue").length, icon: CheckSquare },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-3 pr-4">Member</th>
                  <th className="text-left py-3 pr-4">Department</th>
                  <th className="text-center py-3 pr-4">Goals</th>
                  <th className="text-left py-3 pr-4 min-w-[140px]">Progress</th>
                  <th className="text-center py-3">Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {team.map(member => (
                  <tr key={member.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{member.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{member.department}</td>
                    <td className="py-3 pr-4 text-center">
                      <span className="font-medium">{member.approved}</span>
                      <span className="text-muted-foreground">/{member.goals}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Progress value={member.progress} className="h-1.5 flex-1" />
                        <span className={`text-xs font-bold w-8 text-right ${member.progress >= 80 ? "text-green-600" : member.progress >= 60 ? "text-yellow-600" : member.progress > 0 ? "text-orange-600" : "text-gray-400"}`}>
                          {member.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        member.checkinStatus.includes("Submitted") ? "bg-green-100 text-green-700 border-green-200" :
                        member.checkinStatus === "Overdue" ? "bg-red-100 text-red-700 border-red-200" :
                        member.checkinStatus === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>{member.checkinStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
