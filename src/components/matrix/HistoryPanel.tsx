import React from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { Trash2, Clock, RotateCcw } from 'lucide-react'

export const HistoryPanel = () => {
  const history = useMatrixStore((state) => state.history)
  const clearHistory = useMatrixStore((state) => state.clearHistory)

  if (history.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center border-4 border-[#2a2a2a] border-dotted">
      <span className="text-[18px] font-black uppercase tracking-widest text-white">Empty_Log</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-hidden font-bold">
      <div className="flex items-center justify-between p-4 bg-black text-[#ffffff] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-[14px] font-black uppercase tracking-widest text-gray-300">History Log</span>
        </div>
        <button 
          onClick={clearHistory} 
          className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] border-t-red-600 border-t-2 rounded hover:bg-[#222] transition-all group active:scale-90"
          title="Clear History"
        >
          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group p-4 bg-[#1a1a1a] border-2 border-[#2a2a2a] hover:bg-black hover:border-white transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[18px] font-black uppercase text-[#ffffff] opacity-100 tracking-tighter">{item.operation}</span>
              <span className="text-[14px] text-[#ffffff] opacity-80">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-[18px] font-black font-mono text-[#ffffff] opacity-100 truncate">
              {typeof item.result === 'number' ? item.result.toFixed(4) : `RESULT_OBJECT`}
            </div>
            <RotateCcw className="absolute right-3 bottom-3 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  )
}
