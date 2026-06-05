import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  className?: string;
}

export function CodeEditor({ code, onChange, onRun, isRunning, className }: CodeEditorProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
        <span className="text-sm text-gray-400 font-mono">Python</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(code)} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="重置">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onRun} disabled={isRunning} className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all">
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? '运行中...' : '运行'}</span>
          </button>
        </div>
      </div>
      <CodeMirror value={code} height="300px" extensions={[python()]} onChange={(v) => onChange(v)} theme="dark" className="text-sm font-mono" />
    </div>
  );
}
