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

  const OpButton = ({ op, label, icon: Icon, className }: { op: MatrixOperation, label: string, icon?: React.ComponentType<{ className?: string }>, className?: string }) => (
    <button 
      onClick={() => executeOperation(op)}
      className={`group relative overflow-hidden bg-[var(--button-bg)] border border-[var(--border-color)] h-[52px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 hover:bg-[var(--button-bg-hover)] rounded-xl ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {Icon && <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-red-500 transition-colors" />}
      <span className="text-[14px] font-black uppercase tracking-tight text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-colors">{label}</span>
    </button>
  )

  return (
    <footer className="w-full h-full flex flex-col bg-transparent select-none relative">
      
      {/* HEADER / DRAG HANDLE */}
      <div 
        onMouseDown={startResizing}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="h-12 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-8 border-b border-[var(--border-color)] bg-[var(--button-bg)] cursor-row-resize active:bg-[var(--button-bg-hover)] transition-colors relative"
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="w-10 h-1 bg-[var(--text-secondary)] opacity-20 rounded-full mb-1 sm:hidden"></div>
        
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-80">Command Cockpit</span>
        </div>
        <button 
          onClick={toggleKeyboard} 
          className="absolute right-4 sm:relative sm:right-0 p-2 hover:bg-[var(--button-bg-hover)] rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto custom-scrollbar">
        <div className="flex flex-wrap gap-4 max-w-full mx-auto min-h-full items-start">
          
          {/* UNARY FUNCTIONS */}
          <div className="flex flex-col gap-4 flex-grow min-w-full sm:min-w-[400px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Unary Functions</span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 h-full">
              {[
                { label: 'Matrix A', accent: 'border-red-500', ops: ['det_A', 'inv_A', 'trans_A', 'rank_A', 'trace_A', 'rref_A'] },
                { label: 'Matrix B', accent: 'border-blue-500', ops: ['det_B', 'inv_B', 'trans_B', 'rank_B', 'trace_B', 'rref_B'] },
                { label: 'Matrix C', accent: 'border-purple-500', ops: ['det_C', 'inv_C', 'trans_C', 'rank_C', 'trace_C', 'rref_C'] }
              ].map((group) => (
                <div key={group.label} className="space-y-3">
                  <span className={`text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 border-l-2 ${group.accent} pl-2 ml-1`}>
                    {group.label}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.ops.map(op => (
                      <OpButton key={op} op={op as MatrixOperation} label={op.split('_')[0].toUpperCase()} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARITHMETIC FUNCTIONS */}
          <div className="flex flex-col gap-4 flex-grow min-w-full sm:min-w-[300px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Binary Arithmetic</span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'A & B', ops: [{ op: 'add_AB', l: '+' }, { op: 'sub_AB', l: '-' }, { op: 'mul_AB', l: 'A×B' }, { op: 'mul_BA', l: 'B×A' }] },
                { label: 'B & C', ops: [{ op: 'add_BC', l: '+' }, { op: 'sub_BC', l: '-' }, { op: 'mul_BC', l: 'B×C' }, { op: 'mul_CB', l: 'C×B' }] },
                { label: 'A & C', ops: [{ op: 'add_AC', l: '+' }, { op: 'sub_AC', l: '-' }, { op: 'mul_AC', l: 'A×C' }, { op: 'mul_CA', l: 'C×A' }] }
              ].map((group) => (
                <div key={group.label} className="space-y-3">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 ml-1">{group.label}</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.ops.map(o => (
                      <OpButton key={o.op} op={o.op as MatrixOperation} label={o.l} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MATRIX C (RESULT) */}
          <div className="flex flex-col gap-4 min-w-full sm:min-w-[440px]">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Result Storage C</span>
            </div>
            <div className="bg-[var(--grid-bg)] border border-[var(--border-color)] p-4 flex justify-center rounded-xl shadow-inner overflow-auto">
              <MatrixGrid matrix="C" />
            </div>
          </div>

          {/* MASTER CONTROL - Modern Tactical Version */}
          <div className="flex flex-col gap-4 min-w-full sm:min-w-[160px]">
            <div className="flex items-center gap-2 border-b border-transparent pb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-transparent select-none">Spacer</span>
            </div>
            <button 
              onClick={resetGrids}
              className="group relative flex-1 bg-[var(--button-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all hover:bg-red-500/10 active:scale-[0.98] border-b-4 border-b-[var(--border-color)] active:border-b-0 active:translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col items-center justify-center p-6 gap-4">
                <div className="p-4 rounded-full bg-[var(--button-bg)] group-hover:bg-red-500/20 transition-all">
                  <Power className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-red-500 transition-colors" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--text-primary)] opacity-80 text-[16px] font-black uppercase tracking-tighter group-hover:opacity-100 transition-colors">Master Clear</span>
                  <span className="text-[var(--text-secondary)] text-[8px] font-bold uppercase mt-1 tracking-[0.3em]">Reset All Systems</span>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
