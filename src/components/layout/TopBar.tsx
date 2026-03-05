import React from 'react'
import { Undo2, Redo2, Box, Sun, Moon } from 'lucide-react'
import { useMatrixStore } from '@/store/useMatrixStore'

export const TopBar = () => {
  const undo = useMatrixStore(state => state.undo);
  const redo = useMatrixStore(state => state.redo);
  const theme = useMatrixStore(state => state.theme);
  const toggleTheme = useMatrixStore(state => state.toggleTheme);
  const canUndo = useMatrixStore(state => state.undoStack.length > 0);
  const canRedo = useMatrixStore(state => state.redoStack.length > 0);

  return (
    <header className="w-full h-full flex items-center justify-between z-50 px-1 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <Box size={24} strokeWidth={3.5} className="text-[var(--text-primary)] shrink-0 transition-colors" />
        <div className="flex items-baseline gap-4 sm:gap-12 ml-1">
          <h1 className="text-[18px] sm:text-[24px] font-black tracking-[0.1em] leading-none text-[var(--text-primary)] transition-colors whitespace-nowrap">
            ALgine3D
          </h1>
          <span className="hidden sm:block text-[12px] font-medium uppercase tracking-[0.2em] whitespace-nowrap text-[var(--text-secondary)] transition-colors">
            3D Matrix Calculator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-md transition-all ${canUndo ? 'hover:bg-white/10 active:scale-90 text-[var(--text-primary)] opacity-100' : 'text-[var(--text-secondary)] opacity-30 cursor-not-allowed'}`}
          >
            <Undo2 size={20} strokeWidth={canUndo ? 3 : 2} />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-md transition-all ${canRedo ? 'hover:bg-white/10 active:scale-90 text-[var(--text-primary)] opacity-100' : 'text-[var(--text-secondary)] opacity-30 cursor-not-allowed'}`}
          >
            <Redo2 size={20} strokeWidth={canRedo ? 3 : 2} />
          </button>
        </div>

        <div className="w-[1px] h-6 bg-[var(--border-color)] mx-1"></div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-white/10 active:scale-90 text-[var(--text-primary)] transition-all flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  )
}
