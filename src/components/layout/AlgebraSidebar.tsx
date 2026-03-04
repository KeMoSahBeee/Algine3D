import React, { useRef } from 'react'
import { useMatrixStore } from '@/store/useMatrixStore'
import { MatrixGrid } from '../matrix/MatrixGrid'
import { HistoryPanel } from '../matrix/HistoryPanel'
import { Calculator, Plus, RotateCcw } from 'lucide-react'

export const AlgebraSidebar = () => {
  const { rowsA, colsA, rowsB, colsB, setDimensions } = useMatrixStore();
  const diskRotation = useMatrixStore(state => state.rotationAngle);
  const setDiskRotation = useMatrixStore(state => state.setRotationAngle);

  const isDragging = useRef(false);
  const diskRef = useRef<SVGSVGElement>(null);

  const lastAngle = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    
    // Initial angle calculation
    if (diskRef.current) {
      const rect = diskRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      lastAngle.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !diskRef.current) return;

    const rect = diskRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    // Calculate delta and handle wrap-around
    let delta = currentAngle - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setDiskRotation((prev) => (prev + delta + 360) % 360);
    lastAngle.current = currentAngle;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const labelStyle = { color: '#ffffff', opacity: 1, fontWeight: '900', fontSize: '18px', textTransform: 'uppercase' as const };
  const iconStyle = { color: '#ffffff', opacity: 1 };

  return (
    <aside className="w-full flex flex-col h-full bg-[#121212]">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-10">
        
        {/* Matrix Workbench Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <Calculator size={20} style={iconStyle} />
            <h3 className="text-[18px] font-black uppercase tracking-widest text-[#ffffff] opacity-100">Matrix Workbench</h3>
          </div>

          {/* Matrix A Group */}
          <div className="flex flex-col gap-4">
            <span className="text-[12px] text-[#ffffff] font-black uppercase tracking-[0.2em] ml-1 opacity-100 border-l-2 border-red-500 pl-2">Primary Matrix A</span>
            
            {/* Matrix A Dimensions */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-md space-y-3">
              <div className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <span className="uppercase tracking-[0.2em]" style={{ color: '#ffffff', opacity: 1, fontWeight: '900', fontSize: '10px', display: 'inline-block' }}>Rows</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button 
                        key={r}
                        onClick={() => setDimensions('A', r, colsA)}
                        className={`flex-1 h-8 text-[12px] font-black border transition-all rounded-md ${rowsA === r ? 'bg-red-600 text-white border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-[#2a2a2a] text-white/60 hover:bg-[#262626]'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="uppercase tracking-[0.2em]" style={{ color: '#ffffff', opacity: 1, fontWeight: '900', fontSize: '10px', display: 'inline-block' }}>Columns</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(c => (
                      <button 
                        key={c}
                        onClick={() => setDimensions('A', rowsA, c)}
                        className={`flex-1 h-8 text-[12px] font-black border transition-all rounded-md ${colsA === c ? 'bg-red-600 text-white border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'border-[#2a2a2a] text-white/60 hover:bg-[#262626]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border-2 border-[#2a2a2a] py-16 px-8 flex justify-center rounded-md shadow-inner">
              <MatrixGrid matrix="A" />
            </div>
          </div>

          {/* Matrix B Group */}
          <div className="flex flex-col gap-4">
            <span className="text-[12px] text-[#ffffff] font-black uppercase tracking-[0.2em] ml-1 opacity-100 border-l-2 border-blue-500 pl-2">Matrix B</span>
            
            {/* Matrix B Dimensions */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-md space-y-3">
              <div className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <span className="uppercase tracking-[0.2em]" style={{ color: '#ffffff', opacity: 1, fontWeight: '900', fontSize: '10px', display: 'inline-block' }}>Rows</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button 
                        key={r}
                        onClick={() => setDimensions('B', r, colsB)}
                        className={`flex-1 h-8 text-[12px] font-black border transition-all rounded-md ${rowsB === r ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-[#2a2a2a] text-white/60 hover:bg-[#262626]'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="uppercase tracking-[0.2em]" style={{ color: '#ffffff', opacity: 1, fontWeight: '900', fontSize: '10px', display: 'inline-block' }}>Columns</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(c => (
                      <button 
                        key={c}
                        onClick={() => setDimensions('B', rowsB, c)}
                        className={`flex-1 h-8 text-[12px] font-black border transition-all rounded-md ${colsB === c ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-[#2a2a2a] text-white/60 hover:bg-[#262626]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border-2 border-[#2a2a2a] py-16 px-8 flex justify-center rounded-md shadow-inner">
              <MatrixGrid matrix="B" />
            </div>
          </div>
        </section>
        
        {/* History */}
        <section className="space-y-4 min-h-[300px]">
          <div className="flex items-center gap-3 border-b border-[#2a2a2a] pb-2">
            <Plus size={20} style={iconStyle} />
            <h3 style={labelStyle}>Recent Calculations</h3>
          </div>
          <HistoryPanel />
        </section>

        {/* Axis Rotation Disk Control */}
        <section className="space-y-4 pb-10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <RotateCcw size={20} style={iconStyle} />
            <h3 className="text-[18px] font-black uppercase tracking-widest text-[#ffffff]">Rotation Control</h3>
          </div>
          
          <div className="flex justify-center p-0 overflow-hidden">
            {/* Scaled the entire disk area down to 300px width to fit sidebar perfectly */}
            <div 
              className="flex items-center justify-center w-[300px] h-[300px] bg-[#0f0f0f] cursor-grab active:cursor-grabbing scale-[1] origin-center"
              onMouseDown={handleMouseDown}
            >
              <svg 
                ref={diskRef}
                width="300" 
                height="300" 
                viewBox="0 0 1600 1600" 
                className="select-none transition-transform duration-75"
                style={{ transform: `rotate(${diskRotation}deg)` }}
              >
                {/* Background */}
                <circle cx="800" cy="800" r="700" fill="#F5F5F5" />
                
                {/* Disk Frame (Outer Border) */}
                <circle 
                  cx="800" 
                  cy="800" 
                  r="700" 
                  fill="none" 
                  stroke="#333333" 
                  strokeWidth="16" 
                />
                
                {/* Inner Fill */}
                <circle 
                  cx="800" 
                  cy="800" 
                  r="692" 
                  fill="#E0E0E0" 
                />

                {/* Degree Marks (Ticks) */}
                {Array.from({ length: 72 }).map((_, i) => {
                  const deg = i * 5;
                  const isMajor = deg % 10 === 0;
                  const length = isMajor ? 80 : 40;
                  const stroke = isMajor ? "#000000" : "#777777";
                  const strokeWidth = isMajor ? 8 : 4;
                  
                  return (
                    <line
                      key={deg}
                      x1="800"
                      y1={800 - 700}
                      x2="800"
                      y2={800 - 700 + length}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      transform={`rotate(${deg}, 800, 800)`}
                    />
                  );
                })}

                {/* Numbers (0, 10, ... 360) */}
                {Array.from({ length: 37 }).map((_, i) => {
                  const deg = i * 10;
                  const rad = (deg - 90) * (Math.PI / 180);
                  const x = 800 + 740 * Math.cos(rad);
                  const y = 800 + 740 * Math.sin(rad);
                  
                  return (
                    <text
                      key={deg}
                      x={x}
                      y={y}
                      fill="#ffffff"
                      fontSize="36"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="Inter, sans-serif"
                      opacity="1"
                    >
                      {deg === 360 ? 0 : deg}
                    </text>
                  );
                })}

                {/* Center Mark */}
                <circle cx="800" cy="800" r="10" fill="#000000" />
              </svg>
            </div>
          </div>
        </section>

      </div>
    </aside>
  )
}


