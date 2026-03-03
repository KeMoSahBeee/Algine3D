import React from 'react'
import { useMatrixStore, HistoryItem } from '@/store/useMatrixStore'
import { cn } from '@/lib/utils'
import { History, RotateCcw, Trash2 } from 'lucide-react'
import * as math from 'mathjs'

export const HistoryPanel = () => {
  const history = useMatrixStore((state) => state.history)
  const clearHistory = useMatrixStore((state) => state.clearHistory)
  const setGrid = useMatrixStore((state) => state.setGrid)

  const formatResult = (result: any) => {
    if (typeof result === 'number') return result.toFixed(4)
    if (typeof result === 'string') return result
    if (math.isMatrix(result)) {
        return `Matrix (${math.size(result).join('x')})`
    }
    return 'Complex result'
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 italic p-4 border-2 border-dashed border-gray-800 rounded-lg">
        <History className="w-8 h-8 mb-2 opacity-20" />
        <p>No history yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 font-bold text-gray-300">
          <History className="w-4 h-4" />
          <span>History (Last 10)</span>
        </div>
        <button 
          onClick={clearHistory}
          className="p-1 hover:bg-gray-700 rounded text-red-400 transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/50 rounded transition-all duration-200 cursor-pointer relative"
            onClick={() => setGrid(item.inputGrid, item.inputSize)}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">{item.operation}</span>
              <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="text-sm font-medium text-gray-200 truncate">
              {formatResult(item.result)}
            </div>
            
            <div className="text-[10px] text-gray-500 mt-1">
              {item.inputSize}x{item.inputSize} Matrix
            </div>

            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <RotateCcw className="w-3 h-3 text-blue-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
