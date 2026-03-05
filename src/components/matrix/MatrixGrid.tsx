import React from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { MatrixCell } from './MatrixCell'

export const MatrixGrid = ({ matrix }: { matrix: 'A' | 'B' | 'C' }) => {
  const rows = useMatrixStore((state) => 
    matrix === 'A' ? state.rowsA : matrix === 'B' ? state.rowsB : state.rowsC
  );
  const cols = useMatrixStore((state) => 
    matrix === 'A' ? state.colsA : matrix === 'B' ? state.colsB : state.colsC
  );

  const accentColor = matrix === 'A' ? 'border-red-500' : matrix === 'B' ? 'border-blue-500' : 'border-purple-500';

  return (
    <div className="relative p-2">
      {/* Tactical Brackets */}
      <div className={`absolute top-0 left-0 w-3 h-full border-l-2 border-t-2 border-b-2 rounded-l-md opacity-70 ${accentColor}`} />
      <div className={`absolute top-0 right-0 w-3 h-full border-r-2 border-t-2 border-b-2 rounded-r-md opacity-70 ${accentColor}`} />
      
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => (
          <MatrixCell key={`${matrix}-${index}`} matrix={matrix} index={index} />
        ))}
      </div>
    </div>
  )
}
