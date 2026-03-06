import React from 'react'
import { TopBar } from './components/layout/TopBar'
import { AlgebraSidebar } from './components/layout/AlgebraSidebar'
import { MatrixLab } from './components/layout/MatrixLab'
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas'
import { useMatrixStore } from './store/useMatrixStore'
import * as math from 'mathjs' 
import { Info, RotateCcw, ChevronLeft, ChevronRight, MonitorPlay, X, LayoutPanelTop, ChevronDown } from 'lucide-react'

function App() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const touchStartY = React.useRef<number | null>(null);

  const isKeyboardOpen = useMatrixStore(state => state.isKeyboardOpen)
  const isSidebarOpen = useMatrixStore(state => state.isSidebarOpen)
  const isResultVisible = useMatrixStore(state => state.isResultVisible)
  const rotationAngle = useMatrixStore(state => state.rotationAngle)
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

  const isMobile = windowWidth < 640;
  const isResultHUDActive = isResultVisible && !!currentCalculation;
  const isAnyPanelOpen = isSidebarOpen || isKeyboardOpen || isResultHUDActive;
  
  // Blur logic only for Mobile
  const shouldBlur = isMobile && isAnyPanelOpen;

  return (
    <div className="h-[100dvh] w-screen bg-[var(--bg-main)] overflow-hidden font-sans relative transition-colors duration-300">
      
      {/* 1. LAYER: 3D Visualization (Always Fullscreen Background) */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${shouldBlur ? 'blur-sm scale-[1.02]' : ''}`}>
        <VisualizationCanvas />
      </div>

      {/* 2. LAYER: UI Elements (Overlays) */}
      
      {/* GLOBAL BACKDROP: Blurs background buttons only on mobile */}
      <div 
        className={`fixed inset-0 z-30 bg-black/5 backdrop-blur-[2px] transition-all duration-500 pointer-events-none ${
          shouldBlur ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* TOPBAR: Glassmorphism Floating Style */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-7xl transition-all duration-500 ${shouldBlur ? 'blur-md opacity-40 pointer-events-none scale-95' : 'z-[60]'}`}>
        <div className="glass-panel px-4 sm:px-6 h-14 flex items-center justify-between rounded-xl shadow-2xl border border-[var(--border-color)]">
          <TopBar />
        </div>
      </div>

      {/* SIDEBAR: Tactical Left Panel */}
      <div 
        className={`absolute top-24 left-4 bottom-20 sm:bottom-10 z-50 transition-[transform,opacity] duration-500 ease-out flex gap-2 ${
          isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[calc(100%+20px)] opacity-0 pointer-events-none'
        }`}
        style={{ width: `min(${sidebarWidth}px, 85vw)` }}
      >
        <div className="flex-1 glass-panel rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col relative">
          <AlgebraSidebar />
          
          {/* Internal Toggle Button (Visual only when open) */}
          {isSidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="absolute top-0 right-0 h-14 w-14 flex items-center justify-center hover:bg-[var(--button-bg-hover)] text-[var(--text-secondary)] hover:text-red-500 transition-colors z-50"
            >
              <ChevronLeft size={24} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* COCKPIT: Bottom Tactical Console */}
      <div 
        className={`absolute bottom-10 sm:bottom-4 z-50 transition-[transform,opacity,left] duration-500 ease-out ${
          isKeyboardOpen ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%+20px)] opacity-0 pointer-events-none'
        }`}
        style={{ 
          height: `${labHeight}px`,
          left: isSidebarOpen ? (isMobile ? '16px' : `${sidebarWidth + 32}px`) : '16px',
          right: '16px'
        }}
      >
        <div className="glass-panel w-full h-full rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
          <MatrixLab />
        </div>
      </div>

      {/* RE-OPEN BUTTONS (Floating & Minimal) */}
      {!isSidebarOpen && (
        <div className={`absolute top-24 left-6 z-40 transition-all duration-500 ${isMobile && (isKeyboardOpen || isResultHUDActive) ? 'blur-md opacity-20 pointer-events-none' : ''}`}>
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
        <>
          {/* MOBILE ONLY NAVIGATION DOCK */}
          <div className="contents sm:hidden">
            {/* Reset Button (Left-aligned) */}
            <div className={`fixed bottom-24 left-6 z-40 transition-all duration-500 ${isSidebarOpen || isResultHUDActive ? 'blur-md opacity-20 pointer-events-none' : ''}`}>
              <div className="glass-panel h-11 w-11 rounded-full border border-[var(--border-color)] flex items-center justify-center active-glow-red">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    useMatrixStore.getState().setRotationAngle(0);
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-full transition-colors active:scale-90"
                >
                  <RotateCcw size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Centered Dial Module */}
            <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-36 transition-all duration-500 ${isSidebarOpen || isResultHUDActive ? 'blur-md opacity-20 pointer-events-none' : ''}`}>
              <div className="glass-panel h-11 w-full rounded-full border border-[var(--border-color)] flex items-center px-3 gap-2 overflow-hidden relative touch-none select-none active:border-red-500/50 transition-colors">
                <div 
                  className="absolute inset-0 flex items-center px-2 pointer-events-auto h-full"
                  onPointerDown={(e) => {
                    const startX = e.clientX;
                    const startAngle = rotationAngle;
                    const handlePointerMove = (moveEvent: PointerEvent) => {
                      const deltaX = moveEvent.clientX - startX;
                      useMatrixStore.getState().setRotationAngle((startAngle + deltaX * 1.5 + 720) % 360);
                    };
                    const handlePointerUp = () => {
                      window.removeEventListener('pointermove', handlePointerMove);
                      window.removeEventListener('pointerup', handlePointerUp);
                    };
                    window.addEventListener('pointermove', handlePointerMove);
                    window.addEventListener('pointerup', handlePointerUp);
                  }}
                >
                  <div className="flex-1 h-full flex items-center relative overflow-hidden">
                    <div 
                      className="absolute inset-0 flex items-center gap-4 transition-transform duration-75 ease-out whitespace-nowrap"
                      style={{ 
                        transform: `translateX(${(rotationAngle * 1.2) % 100}px)`,
                        left: '-100px',
                        width: '400%'
                      }}
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={`w-[1px] shrink-0 ${i % 5 === 0 ? 'h-4 bg-red-500/60' : 'h-2 bg-[var(--text-primary)] opacity-20'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-10 text-right pr-1 shrink-0">
                    <span className="text-[11px] font-black font-mono text-red-500">
                      {Math.round(rotationAngle)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Mobile Toggle */}
            <div className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ${isSidebarOpen || isResultHUDActive ? 'blur-md opacity-20 pointer-events-none' : ''}`}>
              <button 
                onClick={toggleKeyboard}
                className="group glass-panel w-12 h-12 flex items-center justify-center shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
              >
                <MonitorPlay size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* PC ONLY COCKPIT TOGGLE (Original Style) */}
          <div className={`fixed bottom-4 right-6 z-40 hidden sm:block transition-all duration-500`}>
            <button 
              onClick={toggleKeyboard}
              className="group glass-panel px-8 h-12 flex items-center justify-center gap-4 shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
            >
              <MonitorPlay size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black tracking-[0.4em] text-[var(--text-primary)] opacity-60 uppercase">Cockpit On</span>
              <ChevronDown size={18} className="rotate-180 text-[var(--text-secondary)] opacity-50" />
            </button>
          </div>
        </>
      )}

      {/* RESULT OVERLAY TOGGLE (When Hidden) */}
      {!isResultVisible && currentCalculation && (
        <div className={`absolute right-20 sm:right-24 z-40 transition-all duration-500 ${windowWidth < 640 ? 'top-24' : 'top-24 sm:top-24'} ${isMobile && (isSidebarOpen || isKeyboardOpen) ? 'blur-md opacity-20 pointer-events-none' : ''}`}>
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
        <div className={`absolute right-4 sm:right-6 z-50 w-[280px] sm:max-w-[320px] pointer-events-auto transition-all ${isSidebarOpen && windowWidth < 640 ? 'top-1/2 -translate-y-1/2' : 'top-24 sm:top-24'}`}>
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
