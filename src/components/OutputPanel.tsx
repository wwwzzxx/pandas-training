import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface OutputPanelProps {
  output?: string;
  error?: string;
  success?: boolean;
  className?: string;
}

export function OutputPanel({ output, error, success, className }: OutputPanelProps) {
  const hasOutput = output && output.trim().length > 0;
  const hasError = error && error.trim().length > 0;

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className={clsx('flex items-center gap-2 px-4 py-2 rounded-t-lg border-b', hasError ? 'bg-red-900/50 border-red-800' : 'bg-gray-800 border-gray-700')}>
        {hasError ? <XCircle className="w-4 h-4 text-red-400" /> : success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
        <span className={clsx('text-sm font-medium', hasError ? 'text-red-400' : success ? 'text-emerald-400' : 'text-gray-400')}>
          {hasError ? '错误输出' : '运行结果'}
        </span>
      </div>
      <div className={clsx('flex-1 p-4 overflow-auto font-mono text-sm min-h-[200px] max-h-[400px]', hasError ? 'bg-red-950/50' : 'bg-gray-900')}>
        {hasOutput && <pre className={clsx('whitespace-pre-wrap', hasError ? 'text-red-300' : 'text-gray-300')}>{output}</pre>}
        {hasError && !hasOutput && <pre className="text-red-300 whitespace-pre-wrap">{error}</pre>}
        {!hasOutput && !hasError && <div className="text-gray-500 text-center py-8">点击"运行"按钮执行代码</div>}
      </div>
    </div>
  );
}
