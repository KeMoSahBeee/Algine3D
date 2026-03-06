import React, { useRef, useEffect } from 'react'
import { useMatrixStore, MatrixOperation } from '@/store/useMatrixStore'
import { ChevronDown, Power, Zap } from 'lucide-react'
import { MatrixGrid } from '../matrix/MatrixGrid'

export const MatrixLab = () => {
  const toggleKeyboard = useMatrixStore(state => state.toggleKeyboard);
  const setLabHeight = useMatrixStore(state => state.setLabHeight);
  const resetGrids = useMatrixStore(state => state.resetGrids);
  const executeOperation = useMatrixStore(state => state.executeOperation);

  const isResizing = useRef(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newHeight = window.innerHeight - e.clientY;
      setLabHeight(newHeight);
    };

    const stopResizing = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [setLabHeight]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'row-resize';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    
    // If swiped down more than 40px, close cockpit
    if (deltaY > 40) {
      toggleKeyboard();
    }
    touchStartY.current = null;
  };

  const OpButton = ({ op, label, className }: { op: MatrixOperation, label: string, className?: string }) => (
    <button 
      onClick={() => executeOperation(op)}
      className={`group relative overflow-hidden bg-[var(--button-bg)] border border-[var(--border-color)] h-6 sm:h-10 px-1.5 sm:px-3 flex flex-col items-center justify-center transition-all active:scale-95 hover:bg-[var(--button-bg-hover)] rounded-md sm:rounded-lg ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span className="text-[8px] sm:text-[12px] font-black uppercase tracking-tight text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-colors">{label}</span>
    </button>
  )

  return (
    <footer className="w-full h-full flex flex-col bg-transparent select-none relative">
      
      {/* HEADER / DRAG HANDLE */}
      <div 
        onMouseDown={startResizing}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="h-8 sm:h-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-8 border-b border-[var(--border-color)] bg-[var(--button-bg)] cursor-row-resize active:bg-[var(--button-bg-hover)] transition-colors relative"
      >
        <div className="w-10 h-1 bg-[var(--text-secondary)] opacity-20 rounded-full mb-1 sm:hidden"></div>
        
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-80">Command Cockpit</span>
        </div>
        <button 
          onClick={toggleKeyboard} 
          className="absolute right-4 sm:relative sm:right-0 p-1 hover:bg-[var(--button-bg-hover)] rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-3 sm:p-4">
        
        {/* PC LAYOUT: Side-by-side (No wrapping to prevent jumping) */}
        <div className="hidden sm:flex flex-nowrap gap-3 items-start min-w-max">
          
          {/* UNARY FUNCTIONS */}
          <div className="flex flex-col gap-3 flex-grow min-w-[320px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Unary Functions</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'A', accent: 'border-red-500', ops: ['det_A', 'inv_A', 'trans_A', 'rank_A', 'trace_A', 'rref_A'] },
                { label: 'B', accent: 'border-blue-500', ops: ['det_B', 'inv_B', 'trans_B', 'rank_B', 'trace_B', 'rref_B'] },
                { label: 'C', accent: 'border-purple-500', ops: ['det_C', 'inv_C', 'trans_C', 'rank_C', 'trace_C', 'rref_C'] }
              ].map((group) => (
                <div key={group.label} className="space-y-2">
                  <span className={`text-[7px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 border-l-2 ${group.accent} pl-2 ml-1`}>
                    Mat {group.label}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {group.ops.map(op => (
                      <OpButton key={op} op={op as MatrixOperation} label={op.split('_')[0].toUpperCase()} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARITHMETIC FUNCTIONS */}
          <div className="flex flex-col gap-3 flex-grow min-w-[240px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Arithmetic</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'A & B', ops: [{ op: 'add_AB', l: '+' }, { op: 'sub_AB', l: '-' }, { op: 'mul_AB', l: 'A×B' }, { op: 'mul_BA', l: 'B×A' }] },
                { label: 'B & C', ops: [{ op: 'add_BC', l: '+' }, { op: 'sub_BC', l: '-' }, { op: 'mul_BC', l: 'B×C' }, { op: 'mul_CB', l: 'C×B' }] },
                { label: 'A & C', ops: [{ op: 'add_AC', l: '+' }, { op: 'sub_AC', l: '-' }, { op: 'mul_AC', l: 'A×C' }, { op: 'mul_CA', l: 'C×A' }] }
              ].map((group) => (
                <div key={group.label} className="space-y-2">
                  <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 ml-1">{group.label}</span>
                  <div className="grid grid-cols-2 gap-1">
                    {group.ops.map(o => (
                      <OpButton key={o.op} op={o.op as MatrixOperation} label={o.l} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MATRIX C (RESULT) */}
          <div className="flex flex-col gap-3 min-w-[340px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Storage C</span>
            </div>
            <div className="bg-[var(--grid-bg)] border border-[var(--border-color)] p-2 flex justify-center rounded-xl shadow-inner overflow-auto">
              <MatrixGrid matrix="C" />
            </div>
          </div>

          {/* MASTER CONTROL */}
          <div className="flex flex-col gap-3 min-w-[120px]">
            <div className="flex items-center gap-2 border-b border-transparent pb-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-transparent select-none">Spacer</span>
            </div>
            <button 
              onClick={resetGrids}
              className="group relative flex-1 bg-[var(--button-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all hover:bg-red-500/10 active:scale-[0.98] border-b-2 border-b-[var(--border-color)] active:border-b-0 active:translate-y-1 min-h-[120px]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col items-center justify-center p-4 gap-2">
                <div className="p-2 rounded-full bg-[var(--button-bg)] group-hover:bg-red-500/20 transition-all">
                  <Power className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-red-500 transition-colors" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--text-primary)] opacity-80 text-[12px] font-black uppercase tracking-tighter group-hover:opacity-100 transition-colors text-center">Master<br/>Clear</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE LAYOUT: Unified Vertical Keypad */}
        <div className="flex sm:hidden flex-col space-y-4">
          
          {/* MATRIX C */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Output Storage Matrix</span>
            </div>
            <div className="bg-[var(--grid-bg)] border border-[var(--border-color)] p-2 flex justify-center rounded-lg shadow-inner overflow-auto min-h-[80px]">
              <MatrixGrid matrix="C" />
            </div>
          </div>

          {/* UNIFIED BUTTONS GRID */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Calculations</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Unary Left */}
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: 'A', accent: 'border-red-500', ops: ['det_A', 'inv_A', 'trans_A', 'rank_A', 'trace_A', 'rref_A'] },
                    { label: 'B', accent: 'border-blue-500', ops: ['det_B', 'inv_B', 'trans_B', 'rank_B', 'trace_B', 'rref_B'] },
                    { label: 'C', accent: 'border-purple-500', ops: ['det_C', 'inv_C', 'trans_C', 'rank_C', 'trace_C', 'rref_C'] }
                  ].map((group) => (
                    <div key={group.label} className="flex flex-col gap-0.5">
                      <span className={`text-[7px] font-black uppercase text-[var(--text-primary)] opacity-30 border-l-2 ${group.accent} pl-1 mb-0.5`}>{group.label}</span>
                      {group.ops.map(op => <OpButton key={op} op={op as MatrixOperation} label={op.split('_')[0].toUpperCase()} />)}
                    </div>
                  ))}
                </div>

                {/* Binary Right */}
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: 'A&B', ops: [{ op: 'add_AB', l: '+' }, { op: 'sub_AB', l: '-' }, { op: 'mul_AB', l: 'A×B' }, { op: 'mul_BA', l: 'B×A' }] },
                    { label: 'B&C', ops: [{ op: 'add_BC', l: '+' }, { op: 'sub_BC', l: '-' }, { op: 'mul_BC', l: 'B×C' }, { op: 'mul_CB', l: 'C×B' }] },
                    { label: 'A&C', ops: [{ op: 'add_AC', l: '+' }, { op: 'sub_AC', l: '-' }, { op: 'mul_AC', l: 'A×C' }, { op: 'mul_CA', l: 'C×A' }] }
                  ].map((group) => (
                    <div key={group.label} className="flex flex-col gap-0.5">
                      <span className="text-[7px] font-black uppercase text-[var(--text-primary)] opacity-30 pl-1 mb-0.5">{group.label}</span>
                      {group.ops.map(o => <OpButton key={o.op} op={o.op as MatrixOperation} label={o.l} />)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MASTER CLEAR */}
          <div className="w-full pb-8">
            <button 
              onClick={resetGrids}
              className="group relative w-full bg-[var(--button-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden transition-all hover:bg-red-500/10 active:scale-[0.98] border-b-2 border-b-[var(--border-color)] active:border-b-0 active:translate-y-0.5 py-2.5 flex items-center justify-center gap-2"
            >
              <Power className="w-3 h-3 text-red-500" />
              <span className="text-[var(--text-primary)] opacity-80 text-[9px] font-black uppercase tracking-widest group-hover:opacity-100 transition-colors">Master Clear</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}
