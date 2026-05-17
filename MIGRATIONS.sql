-- =============================================
-- GoalForge SQL Migrations
-- Run these in Supabase SQL Editor
-- =============================================

-- 1. COMPANY OBJECTIVES TABLE
CREATE TABLE IF NOT EXISTS company_objectives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  progress NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','on_track','at_risk','completed','cancelled')),
  due_date DATE,
  department TEXT,
  cycle_id UUID REFERENCES performance_cycles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning','active','on_hold','completed','cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  progress NUMERIC DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECT MEMBERS (junction table)
CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('success','warning','info','ai','alert')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE company_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view objectives" ON company_objectives
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage objectives" ON company_objectives
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can view projects" ON projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users see own badges" ON badges
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =============================================
-- DEMO DATA (replace UUIDs with your actual ones)
-- =============================================

-- First get your user IDs:
-- SELECT id, email FROM auth.users;

-- Then replace EMPLOYEE_UUID, MANAGER_UUID, ADMIN_UUID, CYCLE_UUID below

-- Insert demo notifications (replace EMPLOYEE_UUID)
/*
INSERT INTO notifications (user_id, type, category, title, body) VALUES
  ('EMPLOYEE_UUID', 'success', 'Approval', 'Goal sheet approved', 'Your goal sheet for FY 2025-26 was approved.'),
  ('EMPLOYEE_UUID', 'warning', 'Deadline', 'Q2 check-in due in 5 days', 'Submit your Q2 check-in values before October 15.'),
  ('EMPLOYEE_UUID', 'ai', 'AI Alert', 'Goal at risk', 'AWS Certification has had no update for 3 weeks.'),
  ('EMPLOYEE_UUID', 'success', 'Badge', 'Badge earned: Goal Crusher', 'You have achieved 90%+ on 3 goals this cycle!');

-- Insert demo objectives (replace ADMIN_UUID, CYCLE_UUID)
INSERT INTO company_objectives (title, description, owner_id, target_value, current_value, progress, status, due_date, department, cycle_id) VALUES
  ('Achieve ISO 27001 Compliance', 'All departments must meet ISO 27001 security standards by Q3.', 'ADMIN_UUID', 100, 68, 68, 'on_track', '2026-01-31', 'All Departments', 'CYCLE_UUID'),
  ('Grow Customer NPS to 65+', 'Improve net promoter score across customer-facing teams.', 'MANAGER_UUID', 65, 52, 52, 'at_risk', '2026-03-31', 'Sales & Support', 'CYCLE_UUID'),
  ('Reduce Operational Costs by 15%', 'Streamline processes and reduce redundant expenditure.', 'ADMIN_UUID', 100, 74, 74, 'on_track', '2026-03-31', 'Operations', 'CYCLE_UUID');

-- Insert demo projects
INSERT INTO projects (name, description, owner_id, status, priority, progress, due_date) VALUES
  ('Customer Portal Redesign', 'Complete UX overhaul of the customer-facing portal.', 'EMPLOYEE_UUID', 'active', 'high', 72, '2025-12-31'),
  ('Microservices Migration', 'Migrate legacy monolith to microservices architecture.', 'EMPLOYEE_UUID', 'active', 'high', 45, '2026-02-28'),
  ('ISO 27001 Audit Readiness', 'Documentation and controls for ISO certification.', 'ADMIN_UUID', 'active', 'critical', 68, '2026-01-31');

-- Insert demo badges
INSERT INTO badges (user_id, badge_key, label, description) VALUES
  ('EMPLOYEE_UUID', 'top_performer', 'Top Performer', 'Top 15% this quarter'),
  ('EMPLOYEE_UUID', 'fast_starter', 'Fast Starter', 'Goals set in first week'),
  ('EMPLOYEE_UUID', 'goal_crusher', 'Goal Crusher', '3 goals at 90%+');
*/
