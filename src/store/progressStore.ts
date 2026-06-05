import { create } from 'zustand';
import type { UserProgress } from '@/types';

interface ProgressState {
  progress: Record<number, UserProgress>;
  setProgress: (projectId: number, progress: UserProgress) => void;
  getProgress: (projectId: number) => UserProgress | undefined;
  completeStep: (projectId: number, stepId: number) => void;
  resetProgress: (projectId: number) => void;
}

const STORAGE_KEY = 'pandas-training-progress';

function loadProgress(): Record<number, UserProgress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveProgress(progress: Record<number, UserProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: loadProgress(),
  
  setProgress: (projectId, newProgress) => {
    set((state) => {
      const updated = { ...state.progress, [projectId]: newProgress };
      saveProgress(updated);
      return { progress: updated };
    });
  },
  
  getProgress: (projectId) => get().progress[projectId],
  
  completeStep: (projectId, stepId) => {
    set((state) => {
      const current = state.progress[projectId] || {
        projectId,
        currentStep: 1,
        completedSteps: [],
        completed: false,
      };
      const completedSteps = [...new Set([...current.completedSteps, stepId])];
      const updated = { ...current, completedSteps, currentStep: Math.max(current.currentStep, stepId + 1) };
      const newState = { ...state.progress, [projectId]: updated };
      saveProgress(newState);
      return { progress: newState };
    });
  },
  
  resetProgress: (projectId) => {
    set((state) => {
      const updated = { ...state.progress };
      delete updated[projectId];
      saveProgress(updated);
      return { progress: updated };
    });
  },
}));
