import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '@/data/projects';
import { getDataset } from '@/data/datasets';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { useProgressStore } from '@/store/progressStore';
import { Clock, FileSpreadsheet, ArrowRight, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  const project = getProjectById(projectId);
  const dataset = getDataset(project?.dataset || '');
  const { getProgress } = useProgressStore();
  const progress = getProgress(projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">返回首页</Link>
        </div>
      </div>
    );
  }

  const completedSteps = progress?.completedSteps?.length || 0;
  const totalSteps = project.steps.length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const isCompleted = progress?.completed || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180 mr-1" />返回项目列表
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-6">
            <span className="text-6xl">{project.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                {isCompleted && <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"><CheckCircle className="w-4 h-4 mr-1" />已完成</span>}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <DifficultyBadge difficulty={project.difficulty} />
                <div className="flex items-center gap-1 text-gray-500"><Clock className="w-4 h-4" /><span>{project.duration}分钟</span></div>
                <div className="flex items-center gap-1 text-gray-500"><FileSpreadsheet className="w-4 h-4" /><span>{dataset?.name || project.dataset}</span></div>
              </div>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
          {totalSteps > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">学习进度</span>
                <span className="text-gray-700 font-medium">{completedSteps}/{totalSteps} 步骤</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-indigo-500" /><h2 className="text-lg font-semibold">学习目标</h2></div>
              <ul className="space-y-2">
                {project.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" /><span className="text-gray-600">{obj}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">学习步骤</h2>
              <div className="space-y-4">
                {project.steps.map((step, index) => {
                  const isStepCompleted = progress?.completedSteps?.includes(step.id);
                  return (
                    <div key={step.id} className={clsx('flex items-start gap-4 p-4 rounded-lg', isStepCompleted ? 'bg-emerald-50' : 'bg-gray-50')}>
                      <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', isStepCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600')}>
                        {isStepCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <h3 className={clsx('font-medium', isStepCompleted ? 'text-emerald-700' : 'text-gray-900')}>{step.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{step.instruction}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {dataset && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><FileSpreadsheet className="w-5 h-5 text-indigo-500" /><h2 className="text-lg font-semibold">数据集</h2></div>
                <h3 className="text-gray-900 font-medium mb-2">{dataset.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{dataset.description}</p>
                <h4 className="text-sm font-medium text-gray-700 mb-2">字段说明</h4>
                <div className="space-y-1">
                  {dataset.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{col.name}</span>
                      <span className="text-gray-400">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-indigo-500" /><h3 className="font-semibold text-gray-900">学习提示</h3></div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 每一步都有初始代码</li>
                <li>• 遇到困难可以查看提示</li>
                <li>• 完成所有步骤即可获得徽章</li>
              </ul>
            </div>
            <Link to={`/learn/${project.id}`} className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg">
              {completedSteps > 0 ? '继续学习' : '开始学习'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
