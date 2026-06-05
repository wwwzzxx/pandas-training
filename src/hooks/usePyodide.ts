import { useState, useEffect, useCallback, useRef } from 'react';

interface PyodideState {
  loading: boolean;
  ready: boolean;
  error: string | null;
  progress: number;
  status: string;
}

declare global {
  interface Window {
    loadPyodide: (config?: { 
      indexURL: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
}

const PYODIDE_URLS = [
  'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
  'https://cdnjs.cloudflare.com/ajax/libs/pyodide/0.24.1/',
  'https://cdn.jsdelivr.net/npm/pyodide@0.24.1/full/'
];

export function usePyodide(lazyLoad?: boolean) {
  const [state, setState] = useState<PyodideState>({ 
    loading: false, 
    ready: false, 
    error: null, 
    progress: 0,
    status: lazyLoad ? '等待加载' : '准备中'
  });
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const initializedRef = useRef(false);

  const loadPyodideWithFallback = useCallback(async (): Promise<PyodideInterface> => {
    setState(prev => ({ ...prev, status: '正在加载 Pyodide 脚本...', progress: 10 }));
    
    for (let i = 0; i < PYODIDE_URLS.length; i++) {
      try {
        const url = PYODIDE_URLS[i];
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = `${url}pyodide.js`;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load from ${url}`));
          });
        }

        setState(prev => ({ ...prev, status: '正在初始化 Python 环境...', progress: 40 }));
        
        const pyodideInstance = await window.loadPyodide({ 
          indexURL: url,
          stdout: () => {},
          stderr: () => {}
        });
        
        setState(prev => ({ ...prev, status: '正在加载 Python 包...', progress: 60 }));
        await pyodideInstance.loadPackage(['pandas', 'numpy']);
        
        setState(prev => ({ ...prev, status: '加载完成', progress: 100 }));
        return pyodideInstance;
      } catch (err) {
      if (i === PYODIDE_URLS.length - 1) throw err;
      // @ts-ignore - Clear script for next attempt
      window.loadPyodide = undefined;
      const scripts = document.querySelectorAll('script[src*="pyodide.js"]');
      scripts.forEach(script => script.remove());
    }
    }
    throw new Error('Failed to load Pyodide from all URLs');
  }, []);

  const initPyodide = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    setState({ loading: true, ready: false, error: null, progress: 0, status: '准备中' });
    
    try {
      const pyodideInstance = await loadPyodideWithFallback();
      setPyodide(pyodideInstance);
      setState({ loading: false, ready: true, error: null, progress: 100, status: '就绪' });
    } catch (err) {
      setState({ 
        loading: false, 
        ready: false, 
        error: err instanceof Error ? err.message : '初始化失败', 
        progress: 0, 
        status: '加载失败'
      });
    }
  }, [loadPyodideWithFallback]);

  useEffect(() => {
    if (!lazyLoad) {
      initPyodide();
    }
  }, [lazyLoad, initPyodide]);

  const loadDataset = useCallback(async (datasetName: string, csvContent: string) => {
    if (!pyodide) return;
    await pyodide.runPythonAsync(`import pandas as pd\nimport io\n${datasetName} = pd.read_csv(io.StringIO("""${csvContent}"""))`);
  }, [pyodide]);

  const runCode = useCallback(async (code: string): Promise<{ success: boolean; output?: string; error?: string }> => {
    if (!pyodide) return { success: false, error: 'Pyodide 未初始化' };
    try {
      const wrappedCode = `import sys\nfrom io import StringIO\nold_stdout = sys.stdout\nsys.stdout = StringIO()\ntry:\n${code.split('\n').map(line => '    ' + line).join('\n')}\n    output = sys.stdout.getvalue()\nfinally:\n    sys.stdout = old_stdout\nprint(output)`;
      const result = await pyodide.runPythonAsync(wrappedCode);
      return { success: true, output: String(result) };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [pyodide]);

  return { ...state, runCode, loadDataset, initPyodide };
}
