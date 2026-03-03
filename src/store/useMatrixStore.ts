import { create } from 'zustand'
import { produce } from 'immer'

interface MatrixState {
  size: number
  grid: (number | string)[]
  setSize: (newSize: number) => void
  setCellValue: (index: number, value: number | string) => void
  resetGrid: () => void
}

export const useMatrixStore = create<MatrixState>()((set) => ({
  size: 3, // Default 3x3 matrix
  grid: Array(9).fill(0), // Default grid filled with 0s

  setSize: (newSize) => set(produce((state) => {
    state.size = newSize
    state.grid = Array(newSize * newSize).fill(0)
  })),

  setCellValue: (index, value) => set(produce((state) => {
    state.grid[index] = value
  })),

  resetGrid: () => set(produce((state) => {
    state.grid = Array(state.size * state.size).fill(0)
  })),
}))
