import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Html } from '@react-three/drei'
import { useMatrixStore } from '@/store/useMatrixStore'
import { RotateCcw, Move, RotateCw } from 'lucide-react'
import * as math from 'mathjs' 
import * as THREE from 'three'; 
import { OrbitControls as OrbitControlsType } from 'three-stdlib';

// --- Precision Axis Component ---
const Axis = ({ direction, color, label, scale = 1 }: { direction: [number, number, number], color: string, label: string, scale?: number }) => {
  const theme = useMatrixStore(state => state.theme);
  const axisLength = 20 * scale;
  const ticks = useMemo(() => Array.from({ length: 21 }).map((_, i) => (i - 10) * scale), [scale]);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...direction).normalize()), [direction]);

  return (
    <group>
      <mesh position={[0, 0, 0]} quaternion={quaternion}>
        <cylinderGeometry args={[0.02 * scale, 0.02 * scale, axisLength, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {ticks.map((t) => (
        <group key={t} position={[direction[0] * t, direction[1] * t, direction[2] * t]}>
          <mesh><boxGeometry args={[0.08 * scale, 0.08 * scale, 0.08 * scale]} /><meshBasicMaterial color={color} opacity={0.5} transparent /></mesh>
          {t !== 0 && (
            <Text 
              position={[direction[0] === 1 ? 0 : 0.3 * scale, direction[1] === 1 ? 0 : 0.3 * scale, direction[2] === 1 ? 0 : 0.3 * scale]} 
              fontSize={0.2 * scale} 
              color={theme === 'dark' ? "#ffffff" : "#000000"} 
              fillOpacity={0.4} 
              fontWeight="bold"
            >
              {t.toFixed(0)}
            </Text>
          )}
        </group>
      ))}
      <Text position={[direction[0] * (axisLength/2 + 0.8), direction[1] * (axisLength/2 + 0.8), direction[2] * (axisLength/2 + 0.8)]} fontSize={0.5 * scale} color={color} fillOpacity={1} fontWeight="black">{label}</Text>
      <Text position={[direction[0] * (-axisLength/2 - 0.8), direction[1] * (-axisLength/2 - 0.8), direction[2] * (-axisLength/2 - 0.8)]} fontSize={0.5 * scale} color={color} fillOpacity={1} fontWeight="black">-{label}</Text>
    </group>
  );
};

// --- High Visibility Vector Component ---
const Vector = ({ vector, color, label, isResult = false, scale = 1 }: { vector: number[], color: string, label: string, isResult?: boolean, scale?: number }) => {
  const theme = useMatrixStore(state => state.theme);
  const length = Math.sqrt(vector[0]**2 + vector[1]**2 + vector[2]**2) || 0.001;
  const dir = useMemo(() => new THREE.Vector3(...vector).normalize(), [vector]);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir), [dir]);
  
  return (
    <group>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[isResult ? 0.05 * scale : 0.03 * scale, isResult ? 0.05 * scale : 0.03 * scale, length, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isResult ? 0.8 : 0.2} />
        </mesh>
        <mesh position={[0, length, 0]}>
          <coneGeometry args={[isResult ? 0.12 * scale : 0.1 * scale, isResult ? 0.3 * scale : 0.25 * scale, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isResult ? 0.8 : 0.2} />
        </mesh>
      </group>
      <Html 
        position={[vector[0], vector[1], vector[2]]} 
        distanceFactor={10 * scale}
        zIndexRange={[100, 0]}
      >
        <div style={{ 
          backgroundColor: isResult ? '#22c55e' : (theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'), 
          color: isResult ? '#ffffff' : (theme === 'dark' ? '#ffffff' : '#000000'), 
          padding: '2px 8px', 
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, 
          borderRadius: '4px', 
          fontSize: `${11}px`, 
          fontFamily: 'monospace', 
          fontWeight: '900', 
          pointerEvents: 'none', 
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transform: 'translate(-50%, -150%)'
        }}>
          {label}: [{vector.map(v => v.toFixed(1)).join(', ')}]
        </div>
      </Html>
    </group>
  );
};

// --- Transformed Object Component ---
const TransformedBox = ({ grid, rows, cols, color, isHighlighted = false, theme = 'dark' }: { grid: (number | string)[], rows: number, cols: number, color: string, isHighlighted?: boolean, scale?: number, theme?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matrix = useMemo(() => {
    const m = new THREE.Matrix4();
    const g = grid.map(v => Number(v) || 0);
    
    m.identity();

    if (rows === 2 && cols === 2) {
      m.set(
        g[0], g[1], 0, 0, 
        g[2], g[3], 0, 0, 
        0, 0, 1, 0, 
        0, 0, 0, 1
      );
    } else if (rows === 3 && cols === 3) {
      m.set(
        g[0], g[1], g[2], 0, 
        g[3], g[4], g[5], 0, 
        g[6], g[7], g[8], 0, 
        0, 0, 0, 1
      );
    } else {
      const values = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      for (let r = 0; r < Math.min(rows, 3); r++) {
        for (let c = 0; c < Math.min(cols, 3); c++) {
          values[r * 3 + c] = g[r * cols + c];
        }
      }
      m.set(
        values[0], values[1], values[2], 0,
        values[3], values[4], values[5], 0,
        values[6], values[7], values[8], 0,
        0, 0, 0, 1
      );
    }
    return m;
  }, [grid, rows, cols]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.matrix.copy(matrix);
      meshRef.current.matrixAutoUpdate = false;
    }
  }, [matrix]);

  const anchoredGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    geom.translate(0.5, 0.5, 0.5); 
    return geom;
  }, []);

  return (
    <group>
      <mesh geometry={anchoredGeometry}><meshBasicMaterial color={theme === 'dark' ? "#ffffff" : "#000000"} wireframe transparent opacity={0.03} /></mesh>
      <mesh ref={meshRef} geometry={anchoredGeometry}>
        <meshStandardMaterial 
          color={isHighlighted ? "#facc15" : color} 
          transparent 
          opacity={isHighlighted ? 0.4 : 0.15} 
          depthWrite={false} 
          emissive={isHighlighted ? "#facc15" : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
        />
        <lineSegments>
          <edgesGeometry args={[anchoredGeometry]} />
          <lineBasicMaterial color={isHighlighted ? (theme === 'dark' ? "#ffffff" : "#000000") : color} opacity={isHighlighted ? 0.9 : 0.7} transparent />
        </lineSegments>
      </mesh>
    </group>
  );
};

const VisualizationScene = ({ isPanningMode }: { isPanningMode: boolean }) => {
  const controlsRef = useRef<OrbitControlsType>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const [activeSnapDir, setActiveSnapDir] = useState<THREE.Vector3 | null>(null);

  const { gridA, rowsA, colsA, gridB, rowsB, colsB, gridC, rowsC, colsC, currentCalculation, rotationAngle, theme } = useMatrixStore();
  const bgColor = theme === 'dark' ? '#0a0a0a' : '#b8b8bc';

  useEffect(() => {
    const handleReset = () => {
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    };
    window.addEventListener('reset-camera', handleReset);
    return () => window.removeEventListener('reset-camera', handleReset);
  }, []);

  const snapDirections = useMemo(() => [
    new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
  ], []);

  const getVectors = (grid: (number | string)[], r: number, c: number, labelPrefix: string, color: string) => {
    return Array.from({ length: Math.min(c, 3) }).map((_, col) => {
      let x = Number(grid[col]) || 0;
      let y = r > 1 ? (Number(grid[col + c]) || 0) : 0;
      let z = r > 2 ? (Number(grid[col + c * 2]) || 0) : 0;
      if (r >= 4) {
        const w = Number(grid[col + c * 3]) || 1;
        if (Math.abs(w) > 0.0001) { x /= w; y /= w; z /= w; }
      }
      return { data: [x, y, z], label: `${labelPrefix}${col + 1}`, color };
    });
  };

  const vectorsA = useMemo(() => getVectors(gridA, rowsA, colsA, 'A', theme === 'dark' ? '#ffffff' : '#333333'), [gridA, rowsA, colsA, theme]);
  const vectorsB = useMemo(() => getVectors(gridB, rowsB, colsB, 'B', theme === 'dark' ? '#3b82f6' : '#1a73e8'), [gridB, rowsB, colsB, theme]);
  const vectorsC = useMemo(() => getVectors(gridC, rowsC, colsC, 'C', theme === 'dark' ? '#a855f7' : '#7b1fa2'), [gridC, rowsC, colsC, theme]);

  const resultVectors = useMemo(() => {
    if (!currentCalculation || !math.isMatrix(currentCalculation.result)) return [];
    const mat = currentCalculation.result as math.Matrix;
    const matSize = (math.size(mat) as unknown as number[]);
    if (matSize.length === 2) {
      const r = matSize[0];
      const c = matSize[1];
      return Array.from({ length: Math.min(c, 3) }).map((_, i) => {
        let x = Number(mat.get([0, i])) || 0;
        let y = r > 1 ? (Number(mat.get([1, i])) || 0) : 0;
        let z = r > 2 ? (Number(mat.get([2, i])) || 0) : 0;
        if (r >= 4) {
          const w = Number(mat.get([3, i])) || 1;
          if (Math.abs(w) > 0.0001) { x /= w; y /= w; z /= w; }
        }
        return { data: [x, y, z], label: `R${i + 1}`, color: '#22c55e' };
      });
    }
    return [];
  }, [currentCalculation]);

  // Dynamic Scaling Logic
  const sceneScale = useMemo(() => {
    const allVecs = [...vectorsA, ...vectorsB, ...vectorsC, ...resultVectors];
    if (allVecs.length === 0) return 1;
    const maxLen = Math.max(...allVecs.map(v => Math.sqrt(v.data[0]**2 + v.data[1]**2 + v.data[2]**2)));
    return Math.max(1, maxLen / 8); // Scale up if vectors are longer than 8 units
  }, [vectorsA, vectorsB, vectorsC, resultVectors]);

  useFrame((state) => {
    if (!controlsRef.current || !sceneGroupRef.current) return;
    const controls = controlsRef.current;
    const { camera } = state;
    const target = controls.target;

    const currentDir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    let foundSnap = null;
    for (const dir of snapDirections) {
      if (currentDir.angleTo(dir) < 0.22) { foundSnap = dir; break; }
    }
    if (foundSnap !== activeSnapDir) setActiveSnapDir(foundSnap);

    if (activeSnapDir) {
      const distance = camera.position.distanceTo(target);
      const targetPos = new THREE.Vector3().addVectors(target, activeSnapDir.clone().multiplyScalar(distance));
      camera.position.lerp(targetPos, 0.06);
      controls.update();
    }

    const rotationAxis = activeSnapDir || currentDir;
    const angleRad = (rotationAngle * Math.PI) / 180;
    sceneGroupRef.current.quaternion.setFromAxisAngle(rotationAxis, angleRad);
    
    // Auto-adjust fog based on scale
    state.scene.fog = new THREE.Fog(bgColor, 20 * sceneScale, 100 * sceneScale);
  });

  const activeUnary = useMemo(() => {
    const op = currentCalculation?.operation;
    if (!op) return null;
    const types = ["DET", "INV", "TRANS", "RANK", "TRACE", "RREF"];
    const type = types.find(t => op.startsWith(t));
    if (!type) return null;
    const matrixLetter = op.includes("(") ? op.split("(")[1][0] : (op.includes("_") ? op.split("_")[1] : null);
    if (!matrixLetter) return null;
    return { type, matrix: matrixLetter };
  }, [currentCalculation]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[20 * sceneScale, 20 * sceneScale, 20 * sceneScale]} intensity={10} color="#ffffff" />
      
      <group ref={sceneGroupRef}>
        <gridHelper args={[40 * sceneScale, 40, theme === 'dark' ? '#1a1a1a' : '#a0a0a4', theme === 'dark' ? '#0d0d0d' : '#b0b0b4']} position={[0, 0, 0]} />
        
        <Axis direction={[1, 0, 0]} color="#ef4444" label="X" scale={sceneScale} />
        <Axis direction={[0, 1, 0]} color="#22c55e" label="Y" scale={sceneScale} />
        <Axis direction={[0, 0, 1]} color="#3b82f6" label="Z" scale={sceneScale} />

        <TransformedBox grid={gridA} rows={rowsA} cols={colsA} theme={theme} color={theme === 'dark' ? "#ffffff" : "#333333"} isHighlighted={activeUnary?.matrix === 'A'} scale={sceneScale} />
        <TransformedBox grid={gridB} rows={rowsB} cols={colsB} theme={theme} color={theme === 'dark' ? "#3b82f6" : "#1a73e8"} isHighlighted={activeUnary?.matrix === 'B'} scale={sceneScale} />
        <TransformedBox grid={gridC} rows={rowsC} cols={colsC} theme={theme} color={theme === 'dark' ? "#a855f7" : "#7b1fa2"} isHighlighted={activeUnary?.matrix === 'C'} scale={sceneScale} />

        {activeUnary && (
          <Text position={[0, 6 * sceneScale, 0]} fontSize={0.6 * sceneScale} color={theme === 'dark' ? "#facc15" : "#eab308"} fontWeight="black" anchorX="center" anchorY="middle">
            {`${activeUnary.type}(${activeUnary.matrix}) = ${
              typeof currentCalculation?.result === 'number' 
                ? currentCalculation.result.toFixed(4) 
                : (math.isMatrix(currentCalculation?.result) || Array.isArray(currentCalculation?.result) ? "MATRIX" : currentCalculation?.result)
            }`}
          </Text>
        )}

        {vectorsA.map((v, i) => <Vector key={`a-${i}`} vector={v.data} color={v.color} label={v.label} scale={sceneScale} />)}
        {vectorsB.map((v, i) => <Vector key={`b-${i}`} vector={v.data} color={v.color} label={v.label} scale={sceneScale} />)}
        {vectorsC.map((v, i) => <Vector key={`c-${i}`} vector={v.data} color={v.color} label={v.label} scale={sceneScale} />)}
        {resultVectors.map((v, i) => <Vector key={`r-${i}`} vector={v.data} color={v.color} label={v.label} isResult={true} scale={sceneScale} />)}
      </group>

      <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={50 * sceneScale} blur={2} far={10 * sceneScale} />
      <OrbitControls 
        ref={controlsRef} 
        makeDefault 
        enableDamping 
        dampingFactor={0.05} 
        minDistance={0.1} 
        maxDistance={500 * sceneScale} 
        enablePan={true}
        screenSpacePanning={true}
        mouseButtons={{
          LEFT: isPanningMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: isPanningMode ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN
        }}
        touches={{
          ONE: isPanningMode ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
      />
    </>
  )
}

export const VisualizationCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanningMode, setIsPanningMode] = useState(false);

  const resetCamera = () => {
    setIsPanningMode(false);
    const event = new CustomEvent('reset-camera');
    window.dispatchEvent(event);
  };

  return (
    <div ref={canvasRef} className="w-full h-full relative" style={{ backgroundColor: '#0f0f0f' }}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} shadows>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} near={0.1} far={1000} />
        <VisualizationScene isPanningMode={isPanningMode} />
      </Canvas>

      {/* Floating Control Overlay */}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col gap-3">
        {/* Toggle Panning Mode */}
        <button 
          onClick={() => setIsPanningMode(!isPanningMode)}
          className={`group glass-panel w-12 h-12 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-90 rounded-full border ${
            isPanningMode 
              ? 'bg-red-500/20 border-red-500 text-red-500' 
              : 'text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--button-bg-hover)]'
          }`}
          title={isPanningMode ? "Switch to Orbit Mode" : "Switch to Pan Mode"}
        >
          {isPanningMode ? <Move size={20} /> : <RotateCw size={20} />}
          <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">
            {isPanningMode ? "Move" : "Orbit"}
          </span>
        </button>

        {/* Recenter Camera */}
        <button 
          onClick={resetCamera}
          className="group glass-panel w-12 h-12 flex flex-col items-center justify-center shadow-2xl hover:bg-[var(--button-bg-hover)] transition-all active:scale-90 text-[var(--text-primary)] rounded-full border border-[var(--border-color)] active-glow-red"
          title="Recenter Camera"
        >
          <RotateCcw size={20} className="text-red-500 group-hover:rotate-[-45deg] transition-transform" />
          <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">Reset</span>
        </button>
      </div>
    </div>
  )
}
