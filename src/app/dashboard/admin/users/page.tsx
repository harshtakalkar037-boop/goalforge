"use client";

import { useState } from "react";
import { Users, Search, Plus, MoreHorizontal, Shield, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const users = [
  { id: "1", full_name: "Aditya Verma", email: "aditya@company.com", role: "admin", department: "IT", designation: "CTO", is_active: true },
  { id: "2", full_name: "Sunita Patel", email: "sunita@company.com", role: "manager", department: "Engineering", designation: "Engineering Manager", is_active: true },
  { id: "3", full_name: "Priya Sharma", email: "priya@company.com", role: "employee", department: "Engineering", designation: "Senior Engineer", is_active: true },
  { id: "4", full_name: "Ravi Menon", email: "ravi@company.com", role: "employee", department: "Quality", designation: "QA Lead", is_active: true },
  { id: "5", full_name: "Anita Desai", email: "anita@company.com", role: "employee", department: "Design", designation: "Product Designer", is_active: true },
  { id: "6", full_name: "Suresh Kumar", email: "suresh@company.com", role: "employee", department: "Engineering", designation: "Backend Developer", is_active: true },
  { id: "7", full_name: "Meena Joshi", email: "meena@company.com", role: "employee", department: "Analytics", designation: "Data Analyst", is_active: false },
  { id: "8", full_name: "Vikram Nair", email: "vikram@company.com", role: "employee", department: "Engineering", designation: "DevOps Engineer", is_active: true },
];

const roleColor: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  manager: "bg-blue-100 text-blue-700 border-blue-200",
  employee: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage employee accounts, roles, and departments</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add User</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email or department..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{users.filter(u => u.is_active).length} active</span>
          <span>·</span>
          <span>{users.filter(u => !u.is_active).length} inactive</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Designation</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{user.full_name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-xs ${roleColor[user.role]}`}>
                        {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.department}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.designation}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className={user.is_active ? "bg-green-100 text-green-700 border-green-200 text-xs" : "bg-gray-100 text-gray-500 border-gray-200 text-xs"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-muted-foreground text-sm">No users found matching "{search}"</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
