import React, { useState, useEffect, useRef } from 'react'
import './App.css' // Placeholder for future styles
import { useMatrixStore } from './store/useMatrixStore'
import { MatrixGrid } from './components/matrix/MatrixGrid'
import { cn } from './lib/utils' // Import cn for conditional classes

function App() {
  const size = useMatrixStore((state) => state.size)
  const setSize = useMatrixStore((state) => state.setSize)
  const resetGrid = useMatrixStore((state) => state.resetGrid)
  const inputRef = useRef<HTMLInputElement>(null) // Ref for the currently focused cell

  // Effect to focus the first cell after grid size changes or on initial load
  useEffect(() => {
    const firstCell = document.querySelector(`[data-index='0']`) as HTMLInputElement
    firstCell?.focus()
    firstCell?.select()
  }, [size]) // Re-run when size changes

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10)
    if (!isNaN(newSize) && newSize > 0) {
      setSize(newSize)
    }
  }

  const handleDoneClick = () => {
    console.log('Matrix input done. Current matrix:', useMatrixStore.getState().grid)
    // TODO: Proceed to calculation/visualization phase
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">LinearBase 3D Matrix Calculator</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 w-full">
        <div className="flex items-center gap-2">
          <label htmlFor="matrix-size" className="text-lg">Matrix Size:</label>
          <select
            id="matrix-size"
            value={size}
            onChange={handleSizeChange}
            className="bg-gray-800 border-2 border-gray-700 rounded p-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>{s}x{s}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={resetGrid}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Reset Grid
        </button>

        <button
          onClick={handleDoneClick}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Done (Calculate & Visualize)
        </button>
      </div>

      <MatrixGrid />

      {/* Placeholder for History Panel */}
      <div className="mt-8 w-full max-w-4xl h-32 bg-gray-800 rounded-lg flex items-center justify-center">
        <span>History Panel (Last 10 Calculations)</span>
      </div>

      <p className="text-sm text-gray-400 mt-12">
        Matrix input is ready. Use arrow keys, Space, and Enter to navigate.
      </p>
    </div>
  )
}

export default App
