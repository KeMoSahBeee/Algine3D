import React from 'react'
import { Undo2, Redo2, Box } from 'lucide-react'
import { useMatrixStore } from '@/store/useMatrixStore'

export const TopBar = () => {
  const undo = useMatrixStore(state => state.undo);
  const redo = useMatrixStore(state => state.redo);
  const canUndo = useMatrixStore(state => state.undoStack.length > 0);
  const canRedo = useMatrixStore(state => state.redoStack.length > 0);

  const iconStyle = { color: '#ffffff', opacity: 1 };
  const textStyle = { color: '#ffffff', opacity: 1, fontWeight: '900' };

  return (
    <header className="h-[56px] border-b border-[#2a2a2a] bg-[#181818] px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <Box size={28} style={iconStyle} strokeWidth={3.5} className="text-white shrink-0" />
        <div className="flex items-baseline gap-12 ml-1">
          <h1 style={{ ...textStyle, fontSize: '24px', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: '1' }}>
            LINEARBASE
          </h1>
          <span style={{ 
            color: '#ffffff', 
            opacity: 0.4, 
            fontWeight: '500', 
            fontSize: '12px', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            3D Matrix Calculator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-md transition-all ${canUndo ? 'hover:bg-[#262626] active:scale-90 text-white opacity-100' : 'text-gray-600 opacity-30 cursor-not-allowed'}`}
        >
          <Undo2 size={20} strokeWidth={canUndo ? 3 : 2} />
        </button>
        <button 
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-md transition-all ${canRedo ? 'hover:bg-[#262626] active:scale-90 text-white opacity-100' : 'text-gray-600 opacity-30 cursor-not-allowed'}`}
        >
          <Redo2 size={20} strokeWidth={canRedo ? 3 : 2} />
        </button>
      </div>
    </header>
  )
}
