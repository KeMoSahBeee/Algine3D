import React, { useState, useEffect, useRef } from 'react'
import './App.css' // Placeholder for future styles
import { useMatrixStore } from './store/useMatrixStore'
import { MatrixGrid } from './components/matrix/MatrixGrid'
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas'
import { cn } from './lib/utils' // Import cn for conditional classes
import * as math from 'mathjs' // Import mathjs
import * as THREE from 'three'; // Import THREE globally
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


// Ensure THREE and FontLoader are available globally for TextGeometry
(window as any).THREE = THREE;
const loader = new FontLoader();
// You might need to load a font file here if you want text to render. 
// For now, we'll assume a default font or handle it differently if needed.
// Example: const font = loader.parse(fontData);

function App() {
  const size = useMatrixStore((state) => state.size)
  const grid = useMatrixStore((state) => state.grid) // Get the grid state
  const setSize = useMatrixStore((state) => state.setSize)
  const resetGrid = useMatrixStore((state) => state.resetGrid)
  
  const [calculationError, setCalculationError] = useState<string | null>(null)
  const [calculationResult, setCalculationResult] = useState<any>(null) // Store results for visualization
  const [font, setFont] = useState<THREE.Font | null>(null); // State for loaded font

  // Load font for text geometry
  useEffect(() => {
    loader.load('/path/to/your/font.json', (loadedFont) => { // Replace with actual font path
      setFont(loadedFont);
    }, undefined, (err) => {
      console.error('Error loading font:', err);
    });
  }, []);


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
      resetGrid() // Reset grid values when size changes
    }
  }

  const handleDoneClick = () => {
    setCalculationError(null) // Clear previous errors
    try {
      const matrixArray: number[][] = []
      for (let i = 0; i < size; i++) {
        const row = grid.slice(i * size, (i + 1) * size).map(val => Number(val) || 0) as number[]
        matrixArray.push(row)
      }
      const matrix = math.matrix(matrixArray)

      console.log('Matrix Input:', matrix.toArray())

      // For now, we'll just use the matrix itself for visualization
      // This assumes the matrix is suitable for vector representation (e.g., 3x3)
      setCalculationResult(matrix) 

    } catch (error: any) {
      console.error('Error preparing matrix for calculation:', error)
      setCalculationError(`Error: ${error.message || 'An unknown error occurred'}`)
    }
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

      <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-center">
        <MatrixGrid />

        <div className="w-full lg:w-2/3 h-[500px] bg-gray-800 rounded-lg overflow-hidden">
          {calculationError ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              {calculationError}
            </div>
          ) : calculationResult ? (
            <VisualizationCanvas font={font} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Enter matrix values and click "Done" to visualize.
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for History Panel */}
      <div className="mt-8 w-full max-w-4xl h-32 bg-gray-800 rounded-lg flex items-center justify-center">
        <span>History Panel (Last 10 Calculations)</span>
      </div>

      <p className="text-sm text-gray-400 mt-12">
        Matrix input is ready. Use arrow keys, Space, and Enter to navigate. Click 'Done' to calculate and visualize.
      </p>
    </div>
  )
}

export default App
