import React, { useRef, useEffect } from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { cn } from '@/lib/utils' // Helper for conditional classes (will create next)

export const MatrixCell = ({ index }: { index: number }) => {
  // ATOMIC SELECTOR: This component only re-renders if its specific value changes.
  const { value, setCellValue, size } = useMatrixStore((state) => ({
    value: state.grid[index],
    setCellValue: state.setCellValue,
    size: state.size,
  }))

  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const numValue = parseFloat(rawValue)
    // Allow empty string for clearing, otherwise store the number
    setCellValue(index, isNaN(numValue) && rawValue !== '' ? rawValue : isNaN(numValue) ? '' : numValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let nextIndex = -1
    if (e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = (index + 1) % (size * size)
    } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + size) % (size * size)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = (index - 1 + size * size) % (size * size)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - size + size * size) % (size * size)
    }
    
    if (nextIndex !== -1) {
      const nextInput = document.querySelector(`[data-index='${nextIndex}']`) as HTMLInputElement
      nextInput?.focus()
      nextInput?.select()
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      data-index={index}
      className={cn(
        "w-16 h-16 bg-gray-800 border-2 border-gray-700 rounded text-white text-center text-xl font-mono",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "transition-colors duration-200"
      )}
    />
  )
}
