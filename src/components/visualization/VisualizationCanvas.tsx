import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Html } from '@react-three/drei'
import { useMatrixStore } from '@/store/useMatrixStore'
import * as math from 'mathjs' 
import * as THREE from 'three'; 
import { OrbitControls as OrbitControlsType } from 'three-stdlib';

// --- Precision Axis Component ---
const Axis = ({ direction, color, label }: { direction: [number, number, number], color: string, label: string }) => {
  const ticks = useMemo(() => Array.from({ length: 21 }).map((_, i) => i - 10), []);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...direction).normalize()), [direction]);

  return (
    <group>
      <mesh position={[0, 0, 0]} quaternion={quaternion}>
        <cylinderGeometry args={[0.02, 0.02, 20, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      {ticks.map((t) => (
        <group key={t} position={[direction[0] * t, direction[1] * t, direction[2] * t]}>
          <mesh><boxGeometry args={[0.08, 0.08, 0.08]} /><meshBasicMaterial color={color} opacity={0.7} transparent /></mesh>
          {t !== 0 && t % 2 === 0 && (
            <Text position={[direction[0] === 1 ? 0 : 0.3, direction[1] === 1 ? 0 : 0.3, direction[2] === 1 ? 0 : 0.3]} fontSize={0.2} color="#ffffff" fillOpacity={0.6} fontWeight="bold">{t}</Text>
          )}
        </group>
      ))}
      <Text position={[direction[0] * 10.8, direction[1] * 10.8, direction[2] * 10.8]} fontSize={0.5} color={color} fillOpacity={1} fontWeight="black">{label}</Text>
      <Text position={[direction[0] * -10.8, direction[1] * -10.8, direction[2] * -10.8]} fontSize={0.5} color={color} fillOpacity={1} fontWeight="black">-{label}</Text>
    </group>
  );
};

// --- High Visibility Vector Component ---
const Vector = ({ vector, color, label, isResult = false }: { vector: number[], color: string, label: string, isResult?: boolean }) => {
  const length = Math.sqrt(vector[0]**2 + vector[1]**2 + vector[2]**2) || 0.001;
  const dir = useMemo(() => new THREE.Vector3(...vector).normalize(), [vector]);
  const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir), [dir]);
  
  return (
    <group>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[isResult ? 0.05 : 0.03, isResult ? 0.05 : 0.03, length, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isResult ? 0.5 : 0.1} />
        </mesh>
        <mesh position={[0, length, 0]}>
          <coneGeometry args={[isResult ? 0.12 : 0.1, isResult ? 0.3 : 0.25, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isResult ? 0.5 : 0.1} />
        </mesh>
      </group>
      <Html 
        position={[vector[0], vector[1], vector[2]]} 
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div style={{ 
          backgroundColor: isResult ? '#ffffff' : '#000000', 
          color: isResult ? '#000000' : '#ffffff', 
          padding: '2px 8px', 
          border: '1px solid #ffffff', 
          borderRadius: '2px', 
          fontSize: '11px', 
          fontFamily: 'monospace', 
          fontWeight: '900', 
          pointerEvents: 'none', 
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          transform: 'translate(-50%, -150%)' // Offset label from the tip
        }}>
          {label}: [{vector.map(v => v.toFixed(1)).join(', ')}]
        </div>
      </Html>
    </group>
  );
};

// --- Transformed Object Component ---
const TransformedBox = ({ grid, rows, cols, color, isHighlighted = false }: { grid: (number | string)[], rows: number, cols: number, color: string, isHighlighted?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matrix = useMemo(() => {
    const m = new THREE.Matrix4();
    const g = grid.map(v => Number(v) || 0);
    
    // Default identity for safety
    m.identity();

    if (rows === 2 && cols === 2) {
      // 2x2 shown as 3x3 with Z=1
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
      // For other sizes, we try to fit what we can or just use identity if it's not a square "box" matrix
      // Usually, only 2x2 and 3x3 make sense as standard volume transformations of a unit cube
      // We'll fill the top-left 3x3 area
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

  return (
    <group>
      <mesh><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} /></mesh>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={isHighlighted ? "#facc15" : color} 
          transparent 
          opacity={isHighlighted ? 0.6 : 0.15} 
          depthWrite={false} 
          emissive={isHighlighted ? "#facc15" : "#000000"}
          emissiveIntensity={isHighlighted ? 0.4 : 0}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color={isHighlighted ? "#000000" : color} opacity={isHighlighted ? 1 : 0.5} transparent />
        </lineSegments>
      </mesh>
    </group>
  );
};

const VisualizationScene = () => {
  const controlsRef = useRef<OrbitControlsType>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const [activeSnapDir, setActiveSnapDir] = useState<THREE.Vector3 | null>(null);

  const { gridA, rowsA, colsA, gridB, rowsB, colsB, gridC, rowsC, colsC, currentCalculation, rotationAngle } = useMatrixStore();

  const snapDirections = useMemo(() => [
    new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
  ], []);

  useFrame((state) => {
    if (!controlsRef.current || !sceneGroupRef.current) return;
    const controls = controlsRef.current;
    const { camera } = state;
    const target = controls.target;

    // 1. ALWAYS detect nearest snap axis based on current view
    const currentDir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    let foundSnap = null;
    for (const dir of snapDirections) {
      if (currentDir.angleTo(dir) < 0.22) {
        foundSnap = dir;
        break;
      }
    }
    if (foundSnap !== activeSnapDir) setActiveSnapDir(foundSnap);

    // 2. If near an axis, pull camera to axis
    if (activeSnapDir) {
      const distance = camera.position.distanceTo(target);
      const targetPos = new THREE.Vector3().addVectors(target, activeSnapDir.clone().multiplyScalar(distance));
      camera.position.lerp(targetPos, 0.06);
      controls.update();
    }

    // 3. APPLY DISK ROTATION TO THE ENTIRE WORLD GROUP
    if (activeSnapDir) {
      const angleRad = (rotationAngle * Math.PI) / 180;
      sceneGroupRef.current.quaternion.setFromAxisAngle(activeSnapDir, angleRad);
    } else {
      sceneGroupRef.current.quaternion.slerp(new THREE.Quaternion(), 0.1);
    }
  });

  const getVectors = (grid: (number | string)[], r: number, c: number, labelPrefix: string, color: string) => {
    // We visualize up to 3 vectors (columns) for 3D
    return Array.from({ length: Math.min(c, 3) }).map((_, col) => {
      const x = Number(grid[col]) || 0;
      const y = r > 1 ? (Number(grid[col + c]) || 0) : 0;
      const z = r > 2 ? (Number(grid[col + c * 2]) || 0) : 0;
      return { data: [x, y, z], label: `${labelPrefix}${col + 1}`, color };
    });
  };

  const vectorsA = useMemo(() => getVectors(gridA, rowsA, colsA, 'A', '#ffffff'), [gridA, rowsA, colsA]);
  const vectorsB = useMemo(() => getVectors(gridB, rowsB, colsB, 'B', '#3b82f6'), [gridB, rowsB, colsB]);
  const vectorsC = useMemo(() => getVectors(gridC, rowsC, colsC, 'C', '#a855f7'), [gridC, rowsC, colsC]);

  const resultVectors = useMemo(() => {
    if (!currentCalculation || !math.isMatrix(currentCalculation.result)) return [];
    const mat = currentCalculation.result as math.Matrix;
    const matSize = (math.size(mat) as unknown as number[]);
    if (matSize.length === 2) {
      const r = matSize[0];
      const c = matSize[1];
      return Array.from({ length: Math.min(c, 3) }).map((_, i) => ({
        data: [
          Number(mat.get([0, i])) || 0,
          r > 1 ? (Number(mat.get([1, i])) || 0) : 0,
          r > 2 ? (Number(mat.get([2, i])) || 0) : 0
        ],
        label: `R${i + 1}`,
        color: '#22c55e'
      }));
    }
    return [];
  }, [currentCalculation]);

  // Determine if we should highlight a matrix for any unary operation
  const activeUnary = useMemo(() => {
    const op = currentCalculation?.operation;
    if (!op) return null;
    
    // Support all unary operations: DET, INV, TRANS, RANK, TRACE, RREF
    const types = ["DET", "INV", "TRANS", "RANK", "TRACE", "RREF"];
    const type = types.find(t => op.startsWith(t));
    if (!type) return null;

    // Handle formats like DET_A, INV_B, etc.
    let matrixLetter = null;
    if (op.includes("(")) matrixLetter = op.split("(")[1][0];
    else if (op.includes("_")) matrixLetter = op.split("_")[1];
    
    if (!matrixLetter) return null;
    
    return { type, matrix: matrixLetter };
  }, [currentCalculation]);

  return (
    <>
      <color attach="background" args={['#0f0f0f']} />
      <fog attach="fog" args={['#0f0f0f', 15, 45]} />
      <ambientLight intensity={1.2} />
      <pointLight position={[15, 15, 15]} intensity={6.0} color="#ffffff" />
      
      {/* EVERYTHING WRAPPED IN A CONTROLLABLE GROUP */}
      <group ref={sceneGroupRef}>
        <gridHelper args={[40, 40, '#2a2a2a', '#181818']} position={[0, 0, 0]} />
        <gridHelper args={[40, 40, '#2a2a2a', '#181818']} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
        <gridHelper args={[40, 40, '#2a2a2a', '#181818']} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        
        <Axis direction={[1, 0, 0]} color="#8B2E2E" label="X" />
        <Axis direction={[0, 1, 0]} color="#2E6B3A" label="Y" />
        <Axis direction={[0, 0, 1]} color="#2E4F8B" label="Z" />

        <TransformedBox grid={gridA} rows={rowsA} cols={colsA} color="#ffffff" isHighlighted={activeUnary?.matrix === 'A'} />
        <TransformedBox grid={gridB} rows={rowsB} cols={colsB} color="#3b82f6" isHighlighted={activeUnary?.matrix === 'B'} />
        <TransformedBox grid={gridC} rows={rowsC} cols={colsC} color="#a855f7" isHighlighted={activeUnary?.matrix === 'C'} />

        {/* Operation Result Text in 3D */}
        {activeUnary && (
          <Text
            position={[0, 5, 0]}
            fontSize={0.6}
            color="#facc15"
            fontWeight="black"
            anchorX="center"
            anchorY="middle"
          >
            {`${activeUnary.type}(${activeUnary.matrix}) = ${
              typeof currentCalculation?.result === 'number' 
                ? currentCalculation.result.toFixed(4) 
                : (math.isMatrix(currentCalculation?.result) || Array.isArray(currentCalculation?.result) ? "MATRIX RESULT" : currentCalculation?.result)
            }`}
          </Text>
        )}

        {vectorsA.map((v, i) => <Vector key={`a-${i}`} vector={v.data} color={v.color} label={v.label} />)}
        {vectorsB.map((v, i) => <Vector key={`b-${i}`} vector={v.data} color={v.color} label={v.label} />)}
        {vectorsC.map((v, i) => <Vector key={`c-${i}`} vector={v.data} color={v.color} label={v.label} />)}
        {resultVectors.map((v, i) => <Vector key={`r-${i}`} vector={v.data} color={v.color} label={v.label} isResult={true} />)}
      </group>

      <ContactShadows position={[0, -0.02, 0]} opacity={0.4} scale={30} blur={2} far={5} />
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.05} minDistance={1} maxDistance={100} />
    </>
  )
}

export const VisualizationCanvas = () => {
  const rotationAngle = useMatrixStore(state => state.rotationAngle);
  const setRotationAngle = useMatrixStore(state => state.setRotationAngle);

  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 360; i += 30) items.push(i);
    return items;
  }, []);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#0f0f0f' }}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} shadows>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} near={0.1} far={1000} />
        <VisualizationScene />
      </Canvas>

      <div className="absolute top-12 right-12 z-30 select-none">
        <div className="relative w-48 h-48 bg-[#0a0a0a] border-2 border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
          {ticks.map((deg) => (
            <div key={deg} className="absolute inset-0 flex items-start justify-center p-2" style={{ transform: `rotate(${deg}deg)` }}>
              <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-3 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                <span className="text-[10px] font-black text-white" style={{ transform: `rotate(-${deg}deg)` }}>{deg}</span>
              </div>
            </div>
          ))}
          <input type="range" min="0" max="360" value={rotationAngle} onChange={(e) => setRotationAngle(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
          <div className="absolute w-1 h-20 bg-red-600 origin-bottom bottom-1/2 transition-transform duration-75 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ transform: `rotate(${rotationAngle}deg)` }} />
          <div className="w-6 h-6 bg-[#000000] border-4 border-red-600 rounded-full z-10 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full animate-pulse" /></div>
          <div className="absolute -bottom-12 flex flex-col items-center gap-1">
            <div className="bg-[#121212] border-2 border-red-600 px-4 py-1.5 rounded-md shadow-2xl cursor-pointer active:scale-95" onClick={() => setRotationAngle(0)}>
              <span className="text-[16px] font-mono font-black text-white tracking-tighter">{String(Math.round(rotationAngle)).padStart(3, '0')}°</span>
            </div>
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mt-1">ROLL_AXIS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
