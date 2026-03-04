import React, { useState } from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { Delete, MoveLeft, MoveRight, ChevronDown, Play } from 'lucide-react'

export const MathKeyboard = () => {
  const isKeyboardOpen = useMatrixStore(state => state.isKeyboardOpen);
  const toggleKeyboard = useMatrixStore(state => state.toggleKeyboard);
  const resetGrids = useMatrixStore(state => state.resetGrids);
  const executeOperation = useMatrixStore(state => state.executeOperation);
  
  const [activeTab, setActiveTab] = useState<'123' | 'fx' | 'abc'>('123');

  if (!isKeyboardOpen) return null;

  const handleCalculate = () => {
    executeOperation('det_A');
  }

  const Key = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className={`bg-[#1a1a1a] border border-[#2a2a2a] text-[#e0e0e0] font-mono text-sm h-10 flex items-center justify-center transition-all active:bg-[#2c2c2c] active:scale-[0.97] hover:bg-[#262626] rounded-sm ${className}`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-col h-full w-full bg-[#121212]">
      {/* Tab Controls Bar */}
      <div className="h-10 flex items-center justify-between px-6 border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="flex gap-1.5 h-full items-center">
          {['123', 'f(x)', 'abc'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.replace('(', '').replace(')', '') as '123' | 'fx' | 'abc')}
              className={`px-5 h-7 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${activeTab === tab.replace('(', '').replace(')', '') ? 'bg-[#2a2a2a] text-white border border-[#3f3f46]' : 'text-[#71717a] hover:text-[#eaeaea]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button 
          onClick={toggleKeyboard}
          className="p-1.5 hover:bg-[#262626] rounded text-[#71717a] hover:text-white"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Scientific Math Grid */}
      <div className="grid grid-cols-10 gap-1 p-3 flex-1">
        <Key>7</Key><Key>8</Key><Key>9</Key><Key className="bg-[#1f1f1f]">÷</Key><Key>x</Key><Key>y</Key><Key>z</Key><Key>π</Key><Key>e</Key>
        <Key className="text-red-900/60 border-red-900/10" onClick={resetGrids}><Delete className="w-4 h-4" /></Key>

        <Key>4</Key><Key>5</Key><Key>6</Key><Key className="bg-[#1f1f1f]">×</Key><Key>(</Key><Key>)</Key><Key>√</Key><Key>^</Key><Key>|</Key>
        <Key><MoveLeft className="w-4 h-4" /></Key>

        <Key>1</Key><Key>2</Key><Key>3</Key><Key className="bg-[#1f1f1f]">−</Key><Key>sin</Key><Key>cos</Key><Key>tan</Key><Key>log</Key><Key>ln</Key>
        <Key><MoveRight className="w-4 h-4" /></Key>

        <Key>0</Key><Key>.</Key><Key>,</Key><Key className="bg-[#1f1f1f]">+</Key>
        <Key className="col-span-2 text-[#71717a] font-black italic text-[10px]">ANS</Key>
        <Key 
          className="col-span-4 bg-[#1f1f1f] text-[#ffffff] font-black flex gap-2 border border-[#2a2a2a] hover:bg-[#262626] active:bg-[#2c2c2c]"
          onClick={handleCalculate}
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-black">Calculate</span>
        </Key>
      </div>
    </div>
  )
}
