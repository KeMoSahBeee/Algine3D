import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, AxesHelper, GridHelper } from '@react-three/drei'
import { useMatrixStore } from '@/store/useMatrixStore'
import * as math from 'mathjs' 
import * as THREE from 'three'; 
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Ensure THREE is available globally
(window as any).THREE = THREE;

// --- Vector Component with Label ---
const Vector = ({ vector, index, font }: { vector: math.Matrix | math.MathArray, index: number, font: THREE.Font | null }) => {
  const vecArray = math.flatten(vector).toArray() as number[]
  if (vecArray.length !== 3) return null 

  const position: [number, number, number] = [vecArray[0], vecArray[1], vecArray[2]]
  const length = math.norm(position) as number || 0.001; // Avoid 0 length error
  const direction = new THREE.Vector3(...position).normalize();
  
  // Color based on index (Golden ratio conjugate for distinct colors)
  const hue = (index * 137.508) % 360; 
  const color = `hsl(${hue}, 70%, 50%)`;

  if (isNaN(position[0]) || isNaN(position[1]) || isNaN(position[2])) return null;

  return (
    <group>
      <arrowHelper args={[
        direction,
        new THREE.Vector3(0, 0, 0),
        length,
        color,
        Math.min(length * 0.2, 0.5), // Head length relative to vector, max 0.5
        Math.min(length * 0.1, 0.3)  // Head width
      ]} />
      
      {font && (
        <mesh position={[position[0] * 1.1, position[1] * 1.1, position[2] * 1.1]}>
           <textGeometry args={[`v${index+1}`, { font: font, size: 0.3, height: 0.05 }]} />
           <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  )
}

// --- Main Scene ---
const VisualizationScene = ({ font }: { font: THREE.Font | null }) => {
  const currentCalculation = useMatrixStore((state) => state.currentCalculation); 

  // Helpers
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <axesHelper args={[10]} /> 
      <gridHelper args={[20, 20, 0x444444, 0x222222]} rotation={[Math.PI / 2, 0, 0]} /> {/* XZ Plane grid, rotated to match standard math orientation often used */}
      
      {/* Dynamic Content */}
      {currentCalculation && (() => {
          if (typeof currentCalculation.result === 'string') return null; // Don't render text errors in 3D yet
          if (typeof currentCalculation.result === 'number') return null; // Scalars handled in overlay

          if (math.isMatrix(currentCalculation.result)) {
            const mat = currentCalculation.result as math.Matrix;
            const size = math.size(mat);
            
            // Logic to visualize columns as vectors (for 3xN matrices)
            if (size.length === 2 && size[0] === 3) {
                const cols = size[1];
                return Array.from({ length: cols }).map((_, i) => (
                    <Vector 
                        key={i} 
                        vector={mat.subset(math.index(math.range(0, 3), i))} 
                        index={i} 
                        font={font}
                    />
                ));
            }
            // Logic for vector result (e.g. from matrix-vector multiplication)
            else if (size.length === 1 && size[0] === 3) {
                 return <Vector vector={mat} index={0} font={font} />;
            }
          }
          return null;
      })()}

      <OrbitControls makeDefault />
    </>
  )
}

export const VisualizationCanvas = () => {
  const [font, setFont] = useState<THREE.Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    // Try to load a font. In a real app, ensure this file exists in /public/fonts/
    loader.load('/fonts/helvetiker_regular.typeface.json', 
      (loadedFont) => setFont(loadedFont),
      undefined, 
      (err) => console.warn("Font missing, 3D text will be disabled.", err)
    );
  }, []);

  return (
    <Canvas camera={{ position: [4, 4, 6], fov: 60 }} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#111827']} /> {/* Tailwind gray-900 */}
      <VisualizationScene font={font} />
    </Canvas>
  )
}
