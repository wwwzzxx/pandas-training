export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ProjectStep {
  id: number;
  title: string;
  instruction: string;
  initialCode: string;
  expectedOutput?: string;
  hints: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  dataset: string;
  icon: string;
  objectives: string[];
  steps: ProjectStep[];
}

export interface UserProgress {
  projectId: number;
  currentStep: number;
  completedSteps: number[];
  completed: boolean;
  completedAt?: string;
}

export interface Dataset {
  name: string;
  filename: string;
  description: string;
  columns: ColumnInfo[];
  sampleData: string;
}

export interface ColumnInfo {
  name: string;
  type: string;
  description: string;
}

export interface RunResult {
  success: boolean;
  output?: string;
  error?: string;
  data?: unknown;
}

export const difficultyConfig: Record<Difficulty, { label: string; color: string; bgColor: string }> = {
  beginner: { label: '入门', color: '#10b981', bgColor: 'bg-emerald-100 text-emerald-700' },
  intermediate: { label: '进阶', color: '#f59e0b', bgColor: 'bg-amber-100 text-amber-700' },
  advanced: { label: '高级', color: '#ef4444', bgColor: 'bg-red-100 text-red-700' },
};
