import { create } from 'zustand'
import { produce } from 'immer'

type MatrixOperation = 'determinant' | 'inverse' | 'transpose' | 'eigenvalues'; 

interface MatrixState {
  size: number
  grid: (number | string)[]
  currentCalculation: { operation: MatrixOperation | null, result: any } | null
  setSize: (newSize: number) => void
  setCellValue: (index: number, value: number | string) => void
  resetGrid: () => void
  setCalculationResult: (operation: MatrixOperation, result: any) => void
}

export const useMatrixStore = create<MatrixState>()((set) => ({
  size: 3, // Default 3x3 matrix
  grid: Array(9).fill(0), // Default grid filled with 0s
  currentCalculation: null,

  setSize: (newSize) => set(produce((state) => {
    state.size = newSize
    state.grid = Array(newSize * newSize).fill(0)
    state.currentCalculation = null // Clear calculation on size change
  })),

  setCellValue: (index, value) => set(produce((state) => {
    state.grid[index] = value
  })),

  resetGrid: () => set(produce((state) => {
    state.grid = Array(state.size * state.size).fill(0)
    state.currentCalculation = null // Clear calculation on reset
  })),

  setCalculationResult: (operation, result) => set(produce((state) => {
    state.currentCalculation = { operation, result }
  })),
}))
