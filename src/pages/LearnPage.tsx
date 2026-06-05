import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjectById } from '@/data/projects';
import { getDataset } from '@/data/datasets';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputPanel } from '@/components/OutputPanel';
import { usePyodide } from '@/hooks/usePyodide';
import { useProgressStore } from '@/store/progressStore';
import { ArrowRight, ArrowLeft, CheckCircle, ChevronRight, Loader2, AlertTriangle, Lightbulb, Home } from 'lucide-react';
import { clsx } from 'clsx';

export function LearnPage() {
  const { id, step } = useParams<{ id: string; step?: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '0', 10);
  const currentStepId = parseInt(step || '1', 10);
  const project = getProjectById(projectId);
  const dataset = getDataset(project?.dataset || '');
  const { loading, ready, error, runCode, loadDataset } = usePyodide();
  const { getProgress, completeStep } = useProgressStore();
  const progress = getProgress(projectId);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string>('');
  const [runError, setRunError] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [runSuccess, setRunSuccess] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const currentStep = project?.steps.find(s => s.id === currentStepId);
  const stepIndex = project?.steps.findIndex(s => s.id === currentStepId) ?? 0;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === (project?.steps.length ?? 0) - 1;
  const isStepCompleted = progress?.completedSteps?.includes(currentStepId);

  useEffect(() => {
    if (currentStep) {
      setCode(currentStep.initialCode);
      setOutput('');
      setRunError('');
      setRunSuccess(false);
      setShowHints(false);
    }
  }, [currentStep, currentStepId]);

  useEffect(() => {
    if (ready && dataset) loadDataset(project?.dataset || '', dataset.sampleData);
  }, [ready, dataset, project?.dataset, loadDataset]);

  if (!project || !currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">返回首页</Link>
        </div>
      </div>
    );
  }

  const handleRun = async () => {
    if (!ready) return;
    setIsRunning(true);
    setOutput('');
    setRunError('');
    setRunSuccess(false);
    try {
      const result = await runCode(code);
      if (result.success) {
        setOutput(result.output || '代码执行成功');
        setRunSuccess(true);
        completeStep(projectId, currentStepId);
      } else {
        setRunError(result.error || '执行出错');
      }
    } catch (err) {
      setRunError(err instanceof Error ? err.message : '未知错误');
    }
    setIsRunning(false);
  };

  const goToNextStep = () => {
    if (!isLastStep) navigate(`/learn/${projectId}/${project.steps[stepIndex + 1].id}`);
  };
  const goToPrevStep = () => {
    if (!isFirstStep) navigate(`/learn/${projectId}/${project.steps[stepIndex - 1].id}`);
  };

  const completedSteps = progress?.completedSteps?.length || 0;
  const totalSteps = project.steps.length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={`/project/${projectId}`} className="flex items-center gap-1 text-gray-500 hover:text-indigo-600">
            <Home className="w-4 h-4" /><span className="text-sm">{project.icon} {project.title}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {project.steps.map((s, idx) => {
                const isStepComplete = progress?.completedSteps?.includes(s.id);
                const isCurrent = s.id === currentStepId;
                return (
                  <div key={s.id} className="flex items-center">
                    <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium', isStepComplete && 'bg-emerald-500 text-white', isCurrent && !isStepComplete && 'bg-indigo-500 text-white', !isStepComplete && !isCurrent && 'bg-gray-200 text-gray-500')}>
                      {isStepComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < project.steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />}
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-gray-500">{completedSteps}/{totalSteps}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/3 bg-white border-r border-gray-200 p-6 overflow-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', isStepCompleted ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white')}>
                {isStepCompleted ? <CheckCircle className="w-4 h-4" /> : stepIndex + 1}
              </span>
              <h2 className="text-xl font-semibold text-gray-900">{currentStep.title}</h2>
            </div>
            {isStepCompleted && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">已完成</span>}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{currentStep.instruction}</p>
          {currentStep.hints.length > 0 && (
            <div className="mt-6">
              <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                <Lightbulb className="w-4 h-4" /><span className="text-sm font-medium">{showHints ? '隐藏提示' : '查看提示'}</span>
              </button>
              {showHints && (
                <div className="mt-3 p-4 bg-indigo-50 rounded-lg">
                  <ul className="space-y-2">
                    {currentStep.hints.map((hint, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-indigo-700">
                        <span className="text-indigo-400">•</span><span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:w-2/3 flex flex-col p-4 gap-4">
          {!ready ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                {loading && <><Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" /><p className="text-gray-600">正在初始化 Python 环境...</p></>}
                {error && <><AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="text-gray-600">环境初始化失败</p><p className="text-sm text-red-500 mt-2">{error}</p></>}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1"><CodeEditor code={code} onChange={setCode} onRun={handleRun} isRunning={isRunning} className="h-full rounded-lg overflow-hidden shadow-lg" /></div>
              <OutputPanel output={output} error={runError} success={runSuccess} className="rounded-lg overflow-hidden shadow-lg" />
            </>
          )}
          <div className="flex items-center justify-between pt-4">
            <button onClick={goToPrevStep} disabled={isFirstStep} className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg font-medium', isFirstStep ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200')}>
              <ArrowLeft className="w-4 h-4" />上一步
            </button>
            {isLastStep && isStepCompleted ? (
              <Link to={`/project/${projectId}`} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium">
                <CheckCircle className="w-4 h-4" />完成！返回项目
              </Link>
            ) : (
              <button onClick={goToNextStep} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600">
                下一步<ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
