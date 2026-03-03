import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Axes } from '@react-three/drei'
import { useMatrixStore } from '@/store/useMatrixStore'
import * as math from 'mathjs'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Ensure THREE is available globally or passed appropriately
// For TextGeometry, we need a Font object. Load it once.

const DEFAULT_FONT_PATH = '/fonts/helvetiker_regular.typeface.json'; // Default font path, needs to be publicly accessible

const Vector = ({ vector, index, font }: { vector: math.Matrix | math.MathArray, index: number, font: THREE.Font | null }) => {
  const vecArray = math.flatten(vector).toArray() as number[]
  if (vecArray.length !== 3 || !font) return null // Only visualize 3D vectors and require font

  const position: [number, number, number] = [vecArray[0] as number, vecArray[1] as number, vecArray[2] as number]
  const color = `hsl(${(index * 60) % 360}, 80%, 60%)` // Assign a unique color
  const length = math.norm(position) || 1;
  const direction = new THREE.Vector3(...position).normalize();

  // Prevent rendering zero-length vectors or NaN positions
  if (length === 0 || isNaN(position[0]) || isNaN(position[1]) || isNaN(position[2])) return null;

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <arrowHelper args={[
          direction,
          new THREE.Vector3(0, 0, 0), // Origin
          length, // Length
          color,
          0.2, // Head length (adjust as needed)
          0.1 // Head width (adjust as needed)
        ]} />
      </mesh>
      {font && ( // Only render text if font is loaded
        <mesh position={[position[0] * 1.1, position[1] * 1.1, position[2] * 1.1]} >
          <textGeometry args={[`v${index}`, { font: font, size: 0.2, height: 0.01 }]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
    </>
  )
}

// Scene component to hold visualization logic
const VisualizationScene = ({ font }: { font: THREE.Font | null }) => {
  const size = useMatrixStore((state) => state.size)
  const grid = useMatrixStore((state) => state.grid)
  const calculationResult = useRef<math.Matrix | string | null>(null)

  useEffect(() => {
    try {
      const matrixArray: number[][] = []
      for (let i = 0; i < size; i++) {
        const row = grid.slice(i * size, (i + 1) * size).map(val => Number(val) || 0) as number[]
        matrixArray.push(row)
      }
      const matrix = math.matrix(matrixArray)

      // For visualization, we currently assume the matrix itself (or its columns) will be visualized as vectors.
      // This logic might change based on selected operations (inverse, determinant etc.) in future.
      // We'll attempt to visualize columns if it's a 3xN matrix.
      const matrixSize = math.size(matrix)
      if (matrixSize.length === 2 && matrixSize[0] === 3) { // Check if it's a 3xN matrix
        calculationResult.current = matrix
      } else {
        calculationResult.current = "Only 3xN matrices can be visualized as vectors currently."
      }

    } catch (error: any) {
      console.error('Error during visualization calculation:', error)
      calculationResult.current = `Error: ${error.message || 'Unknown error'}`
    }
  }, [grid, size]) // Recalculate if grid or size changes

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Axes scale={10} /> {/* Display XYZ axes */}

      {typeof calculationResult.current === 'object' && calculationResult.current !== null && (
        (() => {
          const mat = calculationResult.current as math.Matrix;
          const matSize = math.size(mat);
          
          if (matSize.length === 2 && matSize[0] === 3) { // If it's a 3xN matrix
              const numCols = matSize[1];
              return Array.from({ length: numCols }).map((_, i) => (
                  <Vector 
                      key={i} 
                      // Extract column i
                      vector={mat.subset(math.index(math.range(0, 3), i))} 
                      index={i} 
                      font={font}
                  />
              ));
          }
          return null; // Not a 3xN matrix
        })()
      )}
      
      {typeof calculationResult.current === 'string' && (
          <mesh position={[0, 0, 0]}>
              <textGeometry args={[calculationResult.current, { font: font, size: 0.3, height: 0.01 }]} />
              <meshStandardMaterial color="white" />
          </mesh>
      )}

      <OrbitControls />
    </>
  )
}

export const VisualizationCanvas = ({ font }: { font: THREE.Font | null }) => {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#1f2937']} /> {/* Dark background */}
      <VisualizationScene font={font} />
    </Canvas>
  )
}
