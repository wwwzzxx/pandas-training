import type { Difficulty } from '@/types';
import { difficultyConfig } from '@/types';
import { clsx } from 'clsx';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.bgColor, className)}>
      {config.label}
    </span>
  );
}
