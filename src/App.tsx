import React from 'react'
import { TopBar } from './components/layout/TopBar'
import { AlgebraSidebar } from './components/layout/AlgebraSidebar'
import { MatrixLab } from './components/layout/MatrixLab'
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas'
import { useMatrixStore } from './store/useMatrixStore'
import * as math from 'mathjs' 
import { Info, ChevronDown, RotateCcw, ChevronLeft, ChevronRight, MonitorPlay, X, LayoutPanelTop } from 'lucide-react'

function App() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const touchStartY = React.useRef<number | null>(null);

  const isKeyboardOpen = useMatrixStore(state => state.isKeyboardOpen)
  const isSidebarOpen = useMatrixStore(state => state.isSidebarOpen)
  const isResultVisible = useMatrixStore(state => state.isResultVisible)
  const toggleKeyboard = useMatrixStore(state => state.toggleKeyboard)
  const toggleSidebar = useMatrixStore(state => state.toggleSidebar)
  const toggleResultVisibility = useMatrixStore(state => state.toggleResultVisibility)
  const labHeight = useMatrixStore(state => state.labHeight)
  const sidebarWidth = useMatrixStore(state => state.sidebarWidth)
  const currentCalculation = useMatrixStore((state) => state.currentCalculation)

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    // If swiped up more than 40px, open cockpit
    if (deltaY > 40 && !isKeyboardOpen) {
      toggleKeyboard();
    }
    touchStartY.current = null;
  };

  return (
    <div className="h-[100dvh] w-screen bg-[var(--bg-main)] overflow-hidden font-sans relative transition-colors duration-300">
      
      {/* 1. LAYER: 3D Visualization (Always Fullscreen Background) */}
      <div className="absolute inset-0 z-0">
        <VisualizationCanvas />
      </div>

      {/* 2. LAYER: UI Elements (Overlays) */}
      
      {/* TOPBAR: Glassmorphism Floating Style */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] w-[96%] max-w-7xl">
        <div className="glass-panel px-4 sm:px-6 h-14 flex items-center justify-between rounded-xl shadow-2xl border border-[var(--border-color)]">
          <TopBar />
        </div>
      </div>

      {/* SIDEBAR: Tactical Left Panel */}
      <div 
        className={`absolute top-24 left-4 bottom-20 sm:bottom-10 z-40 transition-[transform,opacity] duration-500 ease-out flex gap-2 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+20px)]'
        }`}
        style={{ width: `min(${sidebarWidth}px, 85vw)` }}
      >
        <div className="flex-1 glass-panel rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col relative">
          <AlgebraSidebar />
          
          {/* Internal Toggle Button (Visual only when open) */}
          {isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-4 sm:p-2 hover:bg-[var(--button-bg-hover)] rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
            >
              <ChevronLeft size={24} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* COCKPIT: Bottom Tactical Console */}
      <div 
        className={`absolute bottom-10 sm:bottom-4 z-50 transition-[transform,opacity,left] duration-500 ease-out ${
          isKeyboardOpen ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%+20px)] opacity-0'
        }`}
        style={{ 
          height: `${labHeight}px`,
          left: isSidebarOpen ? (windowWidth < 640 ? '16px' : `${sidebarWidth + 32}px`) : '16px',
          right: '16px'
        }}
      >
        <div className="glass-panel w-full h-full rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
          <MatrixLab />
        </div>
      </div>

      {/* RE-OPEN BUTTONS (Floating & Minimal) */}
      {!isSidebarOpen && (
        <div className="absolute top-24 left-6 z-50">
          <button 
            onClick={toggleSidebar}
            className="group glass-panel w-11 h-11 sm:w-14 sm:h-32 flex flex-col items-center justify-center gap-0 sm:gap-4 shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
          >
            <ChevronRight size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:block [writing-mode:vertical-lr] text-[9px] font-black tracking-[0.4em] text-[var(--text-primary)] opacity-60">Sidebar On</span>
          </button>
        </div>
      )}

      {!isKeyboardOpen && (
        <div className="absolute bottom-24 right-6 z-50">
          <button 
            onClick={toggleKeyboard}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group glass-panel w-11 h-11 sm:w-auto sm:px-8 sm:h-12 flex items-center justify-center sm:justify-center gap-0 sm:gap-4 shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
          >
            <MonitorPlay size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:block text-[10px] font-black tracking-[0.4em] text-[var(--text-primary)] opacity-60">Cockpit On</span>
            <ChevronDown size={18} className="hidden sm:block rotate-180 text-[var(--text-secondary)] opacity-50" />
          </button>
        </div>
      )}

      {/* RESULT OVERLAY TOGGLE (When Hidden) */}
      {!isResultVisible && currentCalculation && (
        <div className={`absolute right-6 z-50 transition-all ${windowWidth < 640 ? 'top-24' : 'top-24 sm:top-24'}`}>
          <button 
            onClick={toggleResultVisibility}
            className="group glass-panel w-11 h-11 sm:w-auto sm:px-4 sm:h-10 flex items-center justify-center gap-0 sm:gap-3 shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
          >
            <LayoutPanelTop size={20} className="text-red-500 group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
            <span className="hidden sm:block text-[9px] font-black tracking-[0.4em] text-[var(--text-primary)] opacity-60 uppercase">Show Result</span>
          </button>
        </div>
      )}



      {/* RESULT OVERLAY (Floating HUD) */}
      {currentCalculation && isResultVisible && (
        <div className={`absolute right-4 sm:right-6 z-30 w-[280px] sm:max-w-[320px] pointer-events-auto transition-all ${isSidebarOpen && windowWidth < 640 ? 'top-1/2 -translate-y-1/2' : 'top-24 sm:top-24'}`}>
          <div className="glass-panel p-4 sm:p-4 shadow-2xl rounded-2xl border-l-4 border-l-red-500 transition-all max-h-[50vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Info size={14} className="text-red-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                  Analysis Result: {currentCalculation.operation?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => useMatrixStore.getState().undo()}
                  className="p-1.5 hover:bg-[var(--button-bg-hover)] rounded-lg transition-all"
                  title="Undo last change"
                >
                  <RotateCcw size={12} className="text-[var(--text-secondary)]" />
                </button>
                <button 
                  onClick={toggleResultVisibility}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all text-[var(--text-secondary)] hover:text-red-500"
                  title="Close Result HUD"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="text-xl sm:text-2xl font-black tracking-tighter font-mono leading-tight text-[var(--text-primary)]">
              {(() => {
                const res = currentCalculation.result;
                if (typeof res === 'number') return res.toLocaleString(undefined, { maximumFractionDigits: 4 });
                if (typeof res === 'string') return res;
                
                if (math.isMatrix(res)) {
                  const size = res.size();
                  return (
                    <div className="space-y-3">
                      <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">Output Matrix [{size.join('x')}]</div>
                      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size[1]}, minmax(0, 1fr))` }}>
                        {(res.toArray() as number[][]).flat().map((v, i) => (
                          <div key={i} className="bg-[var(--button-bg)] border border-[var(--border-color)] p-2 text-center text-xs font-mono rounded-lg text-[var(--text-primary)]">
                            {typeof v === 'number' ? Number(v.toFixed(2)) : String(v)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return String(res);
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
