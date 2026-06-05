import { useState, useEffect, useCallback } from 'react';

interface PyodideState {
  loading: boolean;
  ready: boolean;
  error: string | null;
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/';

export function usePyodide() {
  const [state, setState] = useState<PyodideState>({ loading: false, ready: false, error: null });
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);

  useEffect(() => {
    const initPyodide = async () => {
      setState({ loading: true, ready: false, error: null });
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = `${PYODIDE_URL}pyodide.js`;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide'));
          });
        }
        const pyodideInstance = await window.loadPyodide({ indexURL: PYODIDE_URL });
        await pyodideInstance.loadPackage(['pandas', 'numpy', 'matplotlib']);
        setPyodide(pyodideInstance);
        setState({ loading: false, ready: true, error: null });
      } catch (err) {
        setState({ loading: false, ready: false, error: err instanceof Error ? err.message : 'Failed to initialize Pyodide' });
      }
    };
    initPyodide();
  }, []);

  const loadDataset = useCallback(async (datasetName: string, csvContent: string) => {
    if (!pyodide) return;
    await pyodide.runPythonAsync(`import pandas as pd\nimport io\n${datasetName} = pd.read_csv(io.StringIO("""${csvContent}"""))`);
  }, [pyodide]);

  const runCode = useCallback(async (code: string): Promise<{ success: boolean; output?: string; error?: string }> => {
    if (!pyodide) return { success: false, error: 'Pyodide not initialized' };
    try {
      const wrappedCode = `import sys\nfrom io import StringIO\nold_stdout = sys.stdout\nsys.stdout = StringIO()\ntry:\n${code.split('\n').map(line => '    ' + line).join('\n')}\n    output = sys.stdout.getvalue()\nfinally:\n    sys.stdout = old_stdout\nprint(output)`;
      const result = await pyodide.runPythonAsync(wrappedCode);
      return { success: true, output: String(result) };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [pyodide]);

  return { ...state, runCode, loadDataset };
}
