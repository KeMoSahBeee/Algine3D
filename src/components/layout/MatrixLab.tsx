import React, { useRef, useEffect } from 'react'
import { useMatrixStore, MatrixOperation } from '@/store/useMatrixStore'
import { ChevronDown, Trash2, Plus, Minus } from 'lucide-react'
import { MatrixGrid } from '../matrix/MatrixGrid'

export const MatrixLab = () => {
  const labHeight = useMatrixStore(state => state.labHeight);
  const toggleKeyboard = useMatrixStore(state => state.toggleKeyboard);
  const setLabHeight = useMatrixStore(state => state.setLabHeight);
  const resetGrids = useMatrixStore(state => state.resetGrids);
  const executeOperation = useMatrixStore(state => state.executeOperation);

  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newHeight = window.innerHeight - e.clientY;
      setLabHeight(newHeight);
    };

    const stopResizing = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
      }
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

  const whiteStyle = { color: '#ffffff', opacity: 1, fontWeight: '900', textTransform: 'uppercase' as const };
  const labelStyle = { ...whiteStyle, fontSize: '14px', letterSpacing: '0.1em' };
  const OpButton = ({ op, label, icon: Icon, className }: { op: MatrixOperation, label: string, icon?: React.ComponentType<{ className?: string }>, className?: string }) => (
    <button 
      onClick={() => executeOperation(op)}
      className={`bg-[#450a0a] border border-[#7f1d1d] h-[56px] flex flex-col items-center justify-center gap-1 transition-all active:bg-[#7f1d1d] active:scale-[0.97] hover:bg-[#7f1d1d] rounded-md shadow-lg group ${className}`}
      style={{ color: '#ffffff' }}
    >
      {Icon && <Icon className="w-5 h-5 text-red-300 group-hover:text-white transition-colors" />}
      <span className="text-[18px] font-black uppercase tracking-tight">{label}</span>
    </button>
  )

  return (
    <footer 
      className="bg-[#121212] border-t-2 border-[#2a2a2a] flex flex-col z-40 w-full shadow-[0_-15px_30px_rgba(0,0,0,0.5)] relative"
      style={{ height: `${labHeight}px` }}
    >
      {/* Resize Handle Container */}
      <div 
        onMouseDown={startResizing}
        className="h-12 flex items-center justify-between px-6 border-b border-[#2a2a2a] bg-[#0f0f0f] cursor-row-resize select-none active:bg-[#1a1a1a] transition-colors"
      >
        <div className="flex items-center gap-4 pointer-events-none">
          <span style={{ ...labelStyle, fontSize: '11px', letterSpacing: '0.4em' }}>MATRIX OPERATIONS COCKPIT</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger resize when clicking toggle
            toggleKeyboard();
          }} 
          className="p-2 hover:bg-red-600/20 rounded-md cursor-pointer pointer-events-auto transition-colors group"
        >
          <ChevronDown size={22} className="text-red-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      <div className="flex-1 p-[20px] overflow-y-auto">
        <div className="flex flex-row gap-12 max-w-[1500px] mx-auto">
          
          {/* Unary Controls */}
          <div className="flex flex-col gap-6 flex-[1.8]">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[12px] text-[#ffffff] font-black uppercase tracking-[0.3em] opacity-100">UNARY MATRIX FUNCTIONS</span>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest border-l-2 border-red-500 pl-2 opacity-100">Matrix A</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="det_A" label="DET" />
                  <OpButton op="inv_A" label="INV" />
                  <OpButton op="trans_A" label="TRANS" />
                  <OpButton op="rank_A" label="RANK" />
                  <OpButton op="trace_A" label="TRACE" />
                  <OpButton op="rref_A" label="RREF" />
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest border-l-2 border-blue-500 pl-2 opacity-100">Matrix B</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="det_B" label="DET" />
                  <OpButton op="inv_B" label="INV" />
                  <OpButton op="trans_B" label="TRANS" />
                  <OpButton op="rank_B" label="RANK" />
                  <OpButton op="trace_B" label="TRACE" />
                  <OpButton op="rref_B" label="RREF" />
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest border-l-2 border-purple-500 pl-2 opacity-100">Matrix C</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="det_C" label="DET" />
                  <OpButton op="inv_C" label="INV" />
                  <OpButton op="trans_C" label="TRANS" />
                  <OpButton op="rank_C" label="RANK" />
                  <OpButton op="trace_C" label="TRACE" />
                  <OpButton op="rref_C" label="RREF" />
                </div>
              </div>
            </div>
          </div>

          {/* Arithmetic Controls */}
          <div className="flex flex-col gap-6 flex-[1.5]">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[12px] text-[#ffffff] font-black uppercase tracking-[0.3em] opacity-100">BINARY MATRIX ARITHMETIC</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest opacity-100">A & B</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="add_AB" label="+" icon={Plus} className="bg-red-900/40" />
                  <OpButton op="sub_AB" label="-" icon={Minus} className="bg-red-900/40" />
                  <OpButton op="mul_AB" label="A×B" className="bg-red-900/40" />
                  <OpButton op="mul_BA" label="B×A" className="bg-red-900/40" />
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest opacity-100">B & C</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="add_BC" label="+" icon={Plus} className="bg-blue-900/40" />
                  <OpButton op="sub_BC" label="-" icon={Minus} className="bg-blue-900/40" />
                  <OpButton op="mul_BC" label="B×C" className="bg-blue-900/40" />
                  <OpButton op="mul_CB" label="C×B" className="bg-blue-900/40" />
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] text-[#ffffff] font-black uppercase tracking-widest opacity-100">A & C</span>
                <div className="grid grid-cols-2 gap-2">
                  <OpButton op="add_AC" label="+" icon={Plus} className="bg-purple-900/40" />
                  <OpButton op="sub_AC" label="-" icon={Minus} className="bg-purple-900/40" />
                  <OpButton op="mul_AC" label="A×C" className="bg-purple-900/40" />
                  <OpButton op="mul_CA" label="C×A" className="bg-purple-900/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Matrix C Display */}
          <div className="flex flex-col gap-6 min-w-[200px]">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[12px] text-[#ffffff] font-black uppercase tracking-[0.3em] opacity-100">MATRIX C (RESULT)</span>
            </div>
            <div className="bg-[#0f0f0f] border-2 border-[#2a2a2a] p-8 flex justify-center rounded-md shadow-inner">
              <MatrixGrid matrix="C" />
            </div>
          </div>

          {/* System Control - Industrial Warning Sign Redesign */}
          <div className="flex flex-col gap-6 min-w-[180px]">
            <div className="border-b border-yellow-600/30 pb-2">
              <span className="text-[11px] text-yellow-500/70 font-black uppercase tracking-[0.3em]">System Safety</span>
            </div>
            <button 
              onClick={resetGrids}
              className="bg-[#facc15] border-[3px] border-black flex-1 flex flex-col rounded-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] group relative overflow-hidden"
            >
              {/* Top Hazard Strip Header */}
              <div className="w-full h-[18px] bg-[repeating-linear-gradient(45deg,#000,#000_15px,#facc15_15px,#facc15_30px)] border-b-[3px] border-black"></div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                {/* Warning Triangle Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-black scale-110 blur-[1px] opacity-20"></div>
                  <Trash2 className="w-10 h-10 text-black relative z-10" />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-black text-[18px] font-[900] uppercase leading-none tracking-tighter">Reset All</span>
                  <span className="text-black/60 text-[8px] font-bold uppercase mt-1 tracking-widest">Clear Workbench</span>
                </div>
              </div>

              {/* Bottom Hazard Strip */}
              <div className="w-full h-[18px] bg-[repeating-linear-gradient(45deg,#000,#000_15px,#facc15_15px,#facc15_30px)] border-t-[3px] border-black"></div>

              {/* Bolt/Screw details in corners for industrial look */}
              <div className="absolute top-[22px] left-1 w-1 h-1 rounded-full bg-black/20"></div>
              <div className="absolute top-[22px] right-1 w-1 h-1 rounded-full bg-black/20"></div>
              <div className="absolute bottom-[22px] left-1 w-1 h-1 rounded-full bg-black/20"></div>
              <div className="absolute bottom-[22px] right-1 w-1 h-1 rounded-full bg-black/20"></div>
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}

