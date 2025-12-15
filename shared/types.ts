// ElfShift Types

export interface Elf {
  id: string;
  name: string;
  skills: string[];  // ['wrapping', 'qa', 'assembly']
  preferences: string[];  // preferred stations
  recentHours: number;  // hours worked in last 7 days
  consecutiveDays: number;  // days worked in a row
  lastBreak: string;  // ISO date string
  breaksTaken: number;  // breaks taken today
  burnoutRisk?: number;  // calculated score 0-10
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Station {
  id: string;
  name: string;  // 'Wrapping', 'QA', 'Assembly'
  staffNeeded: number;
  stressLevel: number;  // 1-10 task stress rating
  currentStaff?: number;
}

export interface ShiftAssignment {
  id: string;
  elfId: string;
  elfName?: string;
  stationId: string;
  stationName?: string;
  date: string;  // ISO date string
  startTime: string;
  endTime: string;
  burnoutRisk: number;  // calculated score
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Order {
  id: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredStations: string[];
  deadline?: string;
}

export interface BurnoutAlert {
  id: string;
  elfId: string;
  elfName: string;
  riskScore: number;
  riskLevel: 'medium' | 'high';
  message: string;
  suggestedAction: string;
  createdAt: string;
  resolved: boolean;
}

export interface ScheduleGenerationResult {
  schedule: ShiftAssignment[];
  alerts: BurnoutAlert[];
  summary: string;
}

export interface RotationResult {
  success: boolean;
  message: string;
  elfA: string;
  elfB: string;
  duration: number;
  slackNotified: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
