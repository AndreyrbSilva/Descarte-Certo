// ── Role types ───────────────────────────────────────────────────────────────

export type Role       = "STUDENT" | "TEACHER" | "ADMIN";
export type RoleFilter = "ALL" | Role;

// ── Entity interfaces ─────────────────────────────────────────────────────────

export interface AdminUser {
  id:            string;
  name:          string;
  email:         string;
  turma:         string;
  role:          Role;
  emailVerified: boolean;
  createdAt:     string;
  matricula?:    string;
  scans?: {
    id:        string;
    category:  string;
    points:    number;
    createdAt: string;
  }[];
  points?: {
    total: number;
  };
}

export interface AdminStats {
  totalUsers:  number;
  totalScans:  number;
  totalPoints: number;
  turmas: { turma: string; count: number }[];
  roles:  { role: Role;   count: number }[];
}

// ── Computed helpers ──────────────────────────────────────────────────────────

export interface WeekDay {
  label:      string;
  day:        string;
  count:      number;
  percentage: number;
}

export interface TurmaRealData {
  turma:        string;
  scansCount:   number;
  membersCount: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Aluno",
  TEACHER: "Professor",
  ADMIN:   "Admin",
};

export const ROLES: Role[] = ["STUDENT", "TEACHER", "ADMIN"];
