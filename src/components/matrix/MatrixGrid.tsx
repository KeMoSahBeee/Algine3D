import React from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { MatrixCell } from './MatrixCell'

export const MatrixGrid = () => {
  const size = useMatrixStore((state) => state.size)

  return (
    <div
      className="inline-grid p-4 border-l-4 border-r-4 border-gray-600 rounded-lg bg-gray-900"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gap: '0.5rem', // 8px
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => (
        <MatrixCell key={index} index={index} />
      ))}
    </div>
  )
}
