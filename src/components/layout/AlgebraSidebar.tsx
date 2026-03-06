import React, { useRef, useEffect } from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { MatrixGrid } from '../matrix/MatrixGrid'
import { HistoryPanel } from '../matrix/HistoryPanel'
import { Plus, RotateCcw, Layers, Target, Trash2 } from 'lucide-react'

export const AlgebraSidebar = () => {
  const { 
    rowsA, colsA, rowsB, colsB, setDimensions, sidebarWidth, setSidebarWidth, 
    resetMatrixA, resetMatrixB 
  } = useMatrixStore();
  const diskRotation = useMatrixStore(state => state.rotationAngle);
  const setDiskRotation = useMatrixStore(state => state.setRotationAngle);

  const isDraggingDisk = useRef(false);
  const isResizing = useRef(false);
  const diskRef = useRef<SVGSVGElement>(null);

  const lastX = useRef(0);

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isResizing.current) {
        setSidebarWidth(e.clientX - 16);
      }
      if (isDraggingDisk.current && diskRef.current) {
        const deltaX = e.clientX - lastX.current;
        setDiskRotation((prev) => (prev + deltaX + 360) % 360);
        lastX.current = e.clientX;
      }
    };

    const handleTouchMoveGlobal = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (isResizing.current) {
        setSidebarWidth(touch.clientX - 16);
      }
      if (isDraggingDisk.current && diskRef.current) {
        const deltaX = touch.clientX - lastX.current;
        // Horizontal delta based rotation for better control on mobile
        setDiskRotation((prev) => (prev + deltaX + 360) % 360);
        lastX.current = touch.clientX;
      }
    };

    const handleMouseUpGlobal = () => {
      isResizing.current = false;
      isDraggingDisk.current = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    window.addEventListener('touchend', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('touchmove', handleTouchMoveGlobal);
      window.removeEventListener('touchend', handleMouseUpGlobal);
    };
  }, [setSidebarWidth, setDiskRotation]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const startResizingTouch = () => {
    isResizing.current = true;
  };

  const handleDiskMouseDown = (e: React.MouseEvent) => {
    isDraggingDisk.current = true;
    lastX.current = e.clientX;
  };

  const handleDiskTouchStart = (e: React.TouchEvent) => {
    isDraggingDisk.current = true;
    lastX.current = e.touches[0].clientX;
  };

  return (
    <aside className="w-full h-full flex flex-col bg-transparent select-none relative">
      
      {/* HEADER / DRAG HANDLE */}
      <div 
        onMouseDown={startResizing}
        onTouchStart={startResizingTouch}
        className="h-14 flex items-center px-6 border-b border-[var(--border-color)] bg-[var(--button-bg)] cursor-col-resize active:bg-[var(--button-bg-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-80">Input Module</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 flex flex-col gap-12">
        
        {/* WORKBENCH SECTION */}
        <div className="space-y-10">
          
          {/* MATRIX A GROUP */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-60">Source A</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[9px] font-mono text-[var(--text-secondary)]">Primary Input</div>
                <button 
                  onClick={resetMatrixA}
                  className="p-1.5 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 rounded transition-all active:scale-90"
                  title="Clear Matrix A"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Dimension Selection - More tactical look */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 ml-1">Rows</span>
                <div className="flex bg-[var(--button-bg)] p-1 rounded-lg border border-[var(--border-color)]">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button 
                      key={r}
                      onClick={() => setDimensions('A', r, colsA)}
                      className={`flex-1 h-7 text-[10px] font-black transition-all rounded-md ${rowsA === r ? 'bg-red-500 text-white shadow-lg' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-30 ml-1">Cols</span>
                <div className="flex bg-[var(--button-bg)] p-1 rounded-lg border border-[var(--border-color)]">
                  {[1, 2, 3, 4, 5].map(c => (
                    <button 
                      key={c}
                      onClick={() => setDimensions('A', rowsA, c)}
                      className={`flex-1 h-7 text-[10px] font-black transition-all rounded-md ${colsA === c ? 'bg-red-500 text-white shadow-lg' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--grid-bg)] border border-[var(--border-color)] p-6 flex justify-center rounded-xl shadow-inner overflow-auto group">
              <MatrixGrid matrix="A" />
            </div>
          </div>

          {/* MATRIX B GROUP */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-60">Source B</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[9px] font-mono text-[var(--text-secondary)]">Secondary Input</div>
                <button 
                  onClick={resetMatrixB}
                  className="p-1.5 hover:bg-blue-500/10 text-[var(--text-secondary)] hover:text-blue-500 rounded transition-all active:scale-90"
                  title="Clear Matrix B"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex bg-[var(--button-bg)] p-1 rounded-lg border border-[var(--border-color)]">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button 
                      key={r}
                      onClick={() => setDimensions('B', r, colsB)}
                      className={`flex-1 h-7 text-[10px] font-black transition-all rounded-md ${rowsB === r ? 'bg-blue-500 text-white shadow-lg' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex bg-[var(--button-bg)] p-1 rounded-lg border border-[var(--border-color)]">
                  {[1, 2, 3, 4, 5].map(c => (
                    <button 
                      key={c}
                      onClick={() => setDimensions('B', rowsB, c)}
                      className={`flex-1 h-7 text-[10px] font-black transition-all rounded-md ${colsB === c ? 'bg-blue-500 text-white shadow-lg' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--grid-bg)] border border-[var(--border-color)] p-6 flex justify-center rounded-xl shadow-inner overflow-auto">
              <MatrixGrid matrix="B" />
            </div>
          </div>
        </div>

        {/* ROTATION DISK - More minimal tactical look */}
        <div className="hidden md:block space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <div className="flex items-center gap-2">
              <RotateCcw size={14} className="text-[var(--text-secondary)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-60">Orbital Orientation</span>
            </div>
            <button 
              onClick={() => useMatrixStore.getState().setRotationAngle(0)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--button-bg)] hover:bg-red-500/20 border border-[var(--border-color)] rounded-md transition-all active:scale-95 group"
            >
              <RotateCcw size={10} className="text-[var(--text-secondary)] group-hover:text-red-500 transition-colors" />
              <span className="text-[9px] font-black text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] uppercase tracking-tighter">Reset Axis</span>
            </button>
          </div>
          
          <div className="flex justify-center p-4">
            <div 
              className="flex items-center justify-center bg-[var(--grid-bg)] rounded-full border border-[var(--border-color)] cursor-grab active:cursor-grabbing relative group"
              style={{ 
                width: `${Math.max(100, Math.min(260, sidebarWidth - 60))}px`, 
                height: `${Math.max(100, Math.min(260, sidebarWidth - 60))}px` 
              }}
              onMouseDown={handleDiskMouseDown}
              onTouchStart={handleDiskTouchStart}
            >
              <svg 
                ref={diskRef}
                width="90%" height="90%" viewBox="0 0 1600 1600" 
                className="select-none transition-transform duration-75"
                style={{ transform: `rotate(${diskRotation}deg)` }}
              >
                <circle cx="800" cy="800" r="750" fill="none" stroke="currentColor" className="text-[var(--text-primary)] opacity-20" strokeWidth="2" />
                <circle cx="800" cy="800" r="700" fill="none" stroke="currentColor" className="text-[var(--text-primary)] opacity-40" strokeWidth="4" />
                
                {/* Minimalist Ticks */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const deg = i * 10;
                  const isMain = deg % 90 === 0;
                  return (
                    <line
                      key={deg}
                      x1="800" y1={800 - 700} x2="800" y2={800 - 700 + (isMain ? 40 : 20)}
                      stroke={isMain ? "var(--accent-red)" : "currentColor"}
                      className={!isMain ? "text-[var(--text-primary)] opacity-60" : ""}
                      strokeWidth={isMain ? 8 : 2}
                      transform={`rotate(${deg}, 800, 800)`}
                    />
                  );
                })}
                
                <circle cx="800" cy="800" r="15" fill="var(--accent-red)" className="animate-pulse" />
              </svg>
              
              {/* Center Angle Display */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[24px] font-black font-mono text-[var(--text-primary)] opacity-80">
                  {Math.round(diskRotation)}°
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="space-y-6 pb-12">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
            <Plus size={14} className="text-[var(--text-secondary)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-60">Log History</span>
          </div>
          <HistoryPanel />
        </div>
      </div>

      {/* RESIZE HANDLE - Visual indicator */}
      <div 
        onMouseDown={startResizing}
        onTouchStart={startResizingTouch}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-red-500/20 transition-colors z-50 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100"
      >
        <div className="w-[2px] h-2 bg-[var(--text-secondary)] opacity-40"></div>
        <div className="w-[2px] h-2 bg-[var(--text-secondary)] opacity-40"></div>
        <div className="w-[2px] h-2 bg-[var(--text-secondary)] opacity-40"></div>
      </div>
    </aside>
  );
};
