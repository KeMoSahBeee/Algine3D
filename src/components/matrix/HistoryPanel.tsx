import React from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { RotateCcw } from 'lucide-react'

export const HistoryPanel = () => {
  const history = useMatrixStore((state) => state.history)
  const restoreHistoryItem = useMatrixStore((state) => state.restoreHistoryItem)

  if (history.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center border-2 border-[var(--border-color)] border-dotted opacity-40 py-10 rounded-xl">
      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">Log Empty</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => restoreHistoryItem(item.id)}
            className="group p-4 bg-[var(--button-bg)] border border-[var(--border-color)] hover:bg-[var(--button-bg-hover)] hover:border-red-500/30 transition-all cursor-pointer relative rounded-xl"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase text-[var(--text-primary)] opacity-80 tracking-widest">
                {item.operation.replace(/_/g, ' ')}
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] font-mono opacity-50">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-[14px] font-black font-mono text-[var(--text-primary)] opacity-90 truncate">
              {typeof item.result === 'number' ? item.result.toLocaleString() : `[Object Matrix]`}
            </div>
            <RotateCcw className="absolute right-3 bottom-3 w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  )
}
