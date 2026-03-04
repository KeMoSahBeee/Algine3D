import React, { CSSProperties } from 'react'
import { TopBar } from './components/layout/TopBar'
import { AlgebraSidebar } from './components/layout/AlgebraSidebar'
import { MatrixLab } from './components/layout/MatrixLab'
import { VisualizationCanvas } from './components/visualization/VisualizationCanvas'
import { useMatrixStore } from './store/useMatrixStore'
import * as math from 'mathjs' 
import { Info, ChevronDown, RotateCcw } from 'lucide-react'

function App() {
  const isKeyboardOpen = useMatrixStore(state => state.isKeyboardOpen)
  const toggleKeyboard = useMatrixStore(state => state.toggleKeyboard)
  const labHeight = useMatrixStore(state => state.labHeight)
  const currentCalculation = useMatrixStore((state) => state.currentCalculation)

  const appShellStyle: CSSProperties = {
    display: 'grid',
    height: '100vh',
    width: '100vw',
    gridTemplateAreas: `
      "topbar topbar"
      "sidebar main"
      "sidebar keyboard"
    `,
    gridTemplateRows: `56px 1fr ${isKeyboardOpen ? `${labHeight}px` : '0px'}`,
    gridTemplateColumns: '320px 1fr',
    backgroundColor: '#0f0f0f',
    overflow: 'hidden'
  };

  return (
    <div style={appShellStyle}>
      
      <div style={{ gridArea: 'topbar' }}>
        <TopBar />
      </div>

      <div style={{ gridArea: 'sidebar' }} className="overflow-hidden border-r border-[#2a2a2a] bg-[#121212]">
        <AlgebraSidebar />
      </div>

      <main style={{ gridArea: 'main' }} className="relative bg-[#0f0f0f] overflow-hidden border-b border-[#2a2a2a]">
        <div className="w-full h-full">
          <VisualizationCanvas />
        </div>

        {!isKeyboardOpen && (
          <div className="absolute bottom-6 right-6 z-50">
            <button 
              onClick={toggleKeyboard}
              className="bg-[#181818] border border-[#333] px-10 h-16 flex items-center justify-center gap-4 shadow-2xl hover:bg-[#222] transition-all active:scale-95 text-white rounded-md font-black uppercase tracking-[0.4em] text-xs border-b-4 border-b-gray-800"
            >
              KEYBOARD ON
              <ChevronDown size={20} className="rotate-180" />
            </button>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div style={{ color: '#ffffff', opacity: 1 }} className="bg-[#121212]/80 border border-[#2a2a2a] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
            Cartesian_Space_Engine
          </div>
        </div>

        {currentCalculation && (
          <div className="absolute bottom-6 left-6 z-10 max-w-lg pointer-events-auto group">
            <div className="bg-[#121212] border border-[#2a2a2a] p-6 shadow-2xl border-l-4 border-l-red-600 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#71717a]">
                  <Info size={14} className="text-red-500" />
                  <span style={{ color: '#ffffff', opacity: 1 }} className="text-[10px] font-black uppercase tracking-widest text-[#ffffff]">
                    System_Result: {currentCalculation.operation}
                  </span>
                </div>
                <button 
                  onClick={() => useMatrixStore.getState().undo()}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                  title="Undo last change"
                >
                  <RotateCcw size={12} className="text-white/40" />
                </button>
              </div>
              
              <div style={{ color: '#ffffff', opacity: 1 }} className="text-3xl font-black tracking-tighter font-mono leading-tight">
                {(() => {
                  const res = currentCalculation.result;
                  if (typeof res === 'number') return res.toLocaleString(undefined, { maximumFractionDigits: 6 });
                  if (typeof res === 'string') return res;
                  
                  if (math.isMatrix(res)) {
                    const size = res.size();
                    return (
                      <div className="space-y-2">
                        <div className="text-[10px] text-gray-500 mb-1">Matrix [{size.join('x')}] Output:</div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size[1]}, minmax(0, 1fr))` }}>
                          {(res.toArray() as number[][]).flat().map((v, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-2 text-center text-sm rounded">
                              {typeof v === 'number' ? v.toFixed(3) : String(v)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (Array.isArray(res)) {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {res.map((v, i) => (
                          <div key={i} className="bg-red-600/10 border border-red-600/20 px-3 py-1 rounded text-lg">
                            {typeof v === 'number' ? v.toFixed(4) : v.toString()}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return String(res);
                })()}
              </div>
            </div>
          </div>
        )}
      </main>

      <div style={{ gridArea: 'keyboard' }} className="overflow-hidden border-t border-[#2a2a2a] bg-[#121212]">
        <MatrixLab />
      </div>

    </div>
  )
}

export default App
