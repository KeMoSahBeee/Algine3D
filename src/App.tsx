import React, { useState, useEffect, useRef } from 'react'
import './App.css' 
import { useMatrixStore, MatrixOperation } from './store/useMatrixStore'
import { MatrixGrid } from './components/matrix/MatrixGrid'
import { HistoryPanel } from './components/matrix/HistoryPanel'
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas'
import { cn } from './lib/utils' 
import * as math from 'mathjs' 
import { Calculator, Play, RotateCcw, Box } from 'lucide-react'

function App() {
  const size = useMatrixStore((state) => state.size)
  const grid = useMatrixStore((state) => state.grid)
  const currentCalculation = useMatrixStore((state) => state.currentCalculation)
  
  const setSize = useMatrixStore((state) => state.setSize)
  const resetGrid = useMatrixStore((state) => state.resetGrid)
  const setCalculationResult = useMatrixStore((state) => state.setCalculationResult)
  const addToHistory = useMatrixStore((state) => state.addToHistory)

  const [selectedOp, setSelectedOp] = useState<MatrixOperation>('determinant')
  const [error, setError] = useState<string | null>(null)

  // Auto-focus on grid change
  useEffect(() => {
    const firstCell = document.querySelector(`[data-index='0']`) as HTMLInputElement
    firstCell?.focus()
    firstCell?.select()
  }, [size])

  const handleCalculate = () => {
    setError(null)
    try {
      // 1. Prepare data
      const matrixArray: number[][] = []
      for (let i = 0; i < size; i++) {
        const row = grid.slice(i * size, (i + 1) * size).map(val => Number(val) || 0)
        matrixArray.push(row)
      }
      const matrix = math.matrix(matrixArray)

      // 2. Perform operation
      let result: any
      switch (selectedOp) {
        case 'determinant':
          result = math.det(matrix)
          break
        case 'inverse':
          result = math.inv(matrix)
          break
        case 'transpose':
          result = math.transpose(matrix)
          break
        case 'eigenvalues':
          // eigenvalues result can be complex or array
          const ev = math.eigs(matrix)
          result = ev.values
          break
        default:
          result = "Unknown operation"
      }

      // 3. Update Store & History
      setCalculationResult(selectedOp, result)
      addToHistory({
        inputGrid: [...grid],
        inputSize: size,
        operation: selectedOp,
        result: result
      })

    } catch (err: any) {
      console.error('Calculation Error:', err)
      setError(err.message || 'Operation failed')
      setCalculationResult(selectedOp, `Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Box className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LinearBase
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
             <span>v1.0.0</span>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-6">
            <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-3">
              <Calculator className="w-4 h-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Matrix Configuration</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 font-medium ml-1">Dimensions</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  {[2, 3, 4, 5].map(s => <option key={s} value={s}>{s}x{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 font-medium ml-1">Operation</label>
                <select
                  value={selectedOp}
                  onChange={(e) => setSelectedOp(e.target.value as MatrixOperation)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="determinant">Determinant</option>
                  <option value="inverse">Inverse</option>
                  <option value="transpose">Transpose</option>
                  <option value="eigenvalues">Eigenvalues</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <MatrixGrid />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={resetGrid}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleCalculate}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Calculate
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
          </section>

          {/* History Panel */}
          <section className="h-[calc(100vh-500px)] min-h-[300px]">
            <HistoryPanel />
          </section>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
               <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 shadow-xl">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 3D Viewport
               </div>
            </div>
            
            <VisualizationCanvas />
            
            {/* Result Overlay */}
            {currentCalculation && (
              <div className="absolute bottom-6 left-6 right-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 p-4 rounded-xl shadow-2xl">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-1">
                    {currentCalculation.operation} Result
                  </div>
                  <div className="text-xl font-mono text-white font-semibold truncate">
                    {typeof currentCalculation.result === 'number' 
                      ? currentCalculation.result.toFixed(6) 
                      : math.isMatrix(currentCalculation.result) 
                        ? `Matrix ${math.size(currentCalculation.result).join('x')}` 
                        : String(currentCalculation.result)
                    }
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="p-6 text-center text-slate-600 text-xs border-t border-slate-800/40">
        <p>© 2026 LinearBase — Professional Matrix Visualizer. Built with React 19 & Three.js.</p>
      </footer>
    </div>
  )
}

export default App
