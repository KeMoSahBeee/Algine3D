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

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => (
        <MatrixCell key={`${matrix}-${index}`} matrix={matrix} index={index} />
      ))}
    </div>
  )
}
