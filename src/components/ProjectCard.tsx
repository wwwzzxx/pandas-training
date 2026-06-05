import { Link } from 'react-router-dom';
import type { Project, UserProgress } from '@/types';
import { DifficultyBadge } from './DifficultyBadge';
import { Clock, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ProjectCardProps {
  project: Project;
  progress?: UserProgress;
  className?: string;
  style?: React.CSSProperties;
}

export function ProjectCard({ project, progress, className, style }: ProjectCardProps) {
  const completedSteps = progress?.completedSteps?.length || 0;
  const totalSteps = project.steps.length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const isCompleted = progress?.completed || false;

  return (
    <Link to={`/project/${project.id}`} style={style} className={clsx('group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300', className)}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{project.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">{project.title}</h3>
              <DifficultyBadge difficulty={project.difficulty} className="mt-1" />
            </div>
          </div>
          {isCompleted && <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium"><CheckCircle className="w-3 h-3 mr-1" />已完成</span>}
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{project.duration}分钟</span></div>
          <div className="flex items-center gap-1"><FileSpreadsheet className="w-4 h-4" /><span>{project.dataset}</span></div>
        </div>
        {totalSteps > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>学习进度</span><span>{completedSteps}/{totalSteps}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-indigo-50 transition-colors">
        <span className="text-sm font-medium text-indigo-600">开始学习 →</span>
      </div>
    </Link>
  );
}
