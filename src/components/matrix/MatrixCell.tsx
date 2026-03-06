import React from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { cn } from '@/lib/utils'

interface Props {
  matrix: 'A' | 'B' | 'C';
  index: number;
}

export const MatrixCell = ({ matrix, index }: Props) => {
  const value = useMatrixStore((state) => {
    if (matrix === 'A') return state.gridA[index];
    if (matrix === 'B') return state.gridB[index];
    return state.gridC[index];
  });
  
  const setCellValue = useMatrixStore((state) => state.setCellValue);
  const rows = useMatrixStore((state) => matrix === 'A' ? state.rowsA : matrix === 'B' ? state.rowsB : state.rowsC);
  const cols = useMatrixStore((state) => matrix === 'A' ? state.colsA : matrix === 'B' ? state.colsB : state.colsC);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (rawValue === '' || rawValue === '-' || !isNaN(Number(rawValue))) {
      setCellValue(matrix, index, rawValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let nextIndex = -1
    const totalCells = rows * cols

    if (e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = (index + 1) % totalCells
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = (index - 1 + totalCells) % totalCells
    } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + cols) % totalCells
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - cols + totalCells) % totalCells
    }
    
    if (nextIndex !== -1) {
      const nextInput = document.querySelector(`[data-matrix='${matrix}'][data-index='${nextIndex}']`) as HTMLInputElement
      nextInput?.focus()
      nextInput?.select()
    }
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      data-matrix={matrix}
      data-index={index}
      className={cn(
        "w-9 h-9 sm:w-12 sm:h-12 bg-[var(--button-bg)] border border-[var(--border-color)] text-center text-[12px] sm:text-[14px] font-black font-mono transition-all",
        "focus:bg-[var(--button-bg-hover)] focus:text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 rounded-lg",
        "placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]",
        "opacity-100 dark:opacity-90", // Solid in light, slightly soft in dark
        matrix === 'C' && "pointer-events-none opacity-60"
      )}
      placeholder="0"
    />
  )
}
