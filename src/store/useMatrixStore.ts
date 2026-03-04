import { create } from 'zustand'
import { produce } from 'immer'
import * as math from 'mathjs'

export type MatrixOperation = 
  | 'det_A' | 'inv_A' | 'trans_A' | 'eig_A' | 'rank_A' | 'trace_A' | 'rref_A'
  | 'det_B' | 'inv_B' | 'trans_B' | 'eig_B' | 'rank_B' | 'trace_B' | 'rref_B'
  | 'det_C' | 'inv_C' | 'trans_C' | 'eig_C' | 'rank_C' | 'trace_C' | 'rref_C'
  | 'add_AB' | 'sub_AB' | 'mul_AB'
  | 'add_BC' | 'sub_BC' | 'mul_BC'
  | 'add_AC' | 'sub_AC' | 'mul_AC'
  | 'mul_BA' | 'mul_CB' | 'mul_CA';

export interface HistoryItem {
  id: string;
  timestamp: number;
  operation: string;
  result: unknown;
}

interface MatrixStateSnapshot {
  gridA: (number | string)[];
  gridB: (number | string)[];
  gridC: (number | string)[];
  rowsA: number;
  colsA: number;
  rowsB: number;
  colsB: number;
  rowsC: number;
  colsC: number;
}

interface MatrixState {
  rowsA: number;
  colsA: number;
  rowsB: number;
  colsB: number;
  rowsC: number;
  colsC: number;
  gridA: (number | string)[];
  gridB: (number | string)[];
  gridC: (number | string)[];
  currentCalculation: { operation: string | null, result: unknown } | null;
  history: HistoryItem[];
  isSidebarOpen: boolean;
  isKeyboardOpen: boolean;
  labHeight: number;
  rotationAngle: number;
  undoStack: MatrixStateSnapshot[];
  redoStack: MatrixStateSnapshot[];
  
  setDimensions: (matrix: 'A' | 'B', rows: number, cols: number) => void;
  setCellValue: (matrix: 'A' | 'B' | 'C', index: number, value: number | string) => void;
  resetGrids: () => void;
  executeOperation: (op: MatrixOperation) => void;
  toggleKeyboard: () => void;
  setLabHeight: (height: number) => void;
  setRotationAngle: (angle: number | ((prev: number) => number)) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export const useMatrixStore = create<MatrixState>()((set, get) => ({
  rowsA: 3, colsA: 3,
  rowsB: 3, colsB: 3,
  rowsC: 3, colsC: 3,
  gridA: Array(9).fill(0),
  gridB: Array(9).fill(0),
  gridC: Array(9).fill(0),
  currentCalculation: null,
  history: [],
  isSidebarOpen: true,
  isKeyboardOpen: true,
  labHeight: 320,
  rotationAngle: 0,
  undoStack: [],
  redoStack: [],

  setDimensions: (matrix, rows, cols) => set(produce((state: MatrixState) => {
    state.undoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    if (state.undoStack.length > 50) state.undoStack.shift();
    state.redoStack = [];
    
    if (matrix === 'A') {
      state.rowsA = rows;
      state.colsA = cols;
      state.gridA = Array(rows * cols).fill(0);
    } else {
      state.rowsB = rows;
      state.colsB = cols;
      state.gridB = Array(rows * cols).fill(0);
    }
    state.currentCalculation = null;
  })),

  setCellValue: (matrix, index, value) => {
    const s = get();
    set(produce((state: MatrixState) => {
      state.undoStack.push({
        gridA: [...s.gridA], gridB: [...s.gridB], gridC: [...s.gridC],
        rowsA: s.rowsA, colsA: s.colsA,
        rowsB: s.rowsB, colsB: s.colsB,
        rowsC: s.rowsC, colsC: s.colsC
      });
      if (state.undoStack.length > 50) state.undoStack.shift();
      state.redoStack = [];

      if (matrix === 'A') state.gridA[index] = value;
      else if (matrix === 'B') state.gridB[index] = value;
      else state.gridC[index] = value;
    }));
  },

  toggleKeyboard: () => set((state) => ({ isKeyboardOpen: !state.isKeyboardOpen })),
  setLabHeight: (height) => set({ labHeight: Math.max(120, Math.min(height, window.innerHeight * 0.8)) }),
  setRotationAngle: (angle) => set((state) => ({ 
    rotationAngle: typeof angle === 'function' ? angle(state.rotationAngle) : angle 
  })),

  resetGrids: () => set(produce((state: MatrixState) => {
    state.undoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    if (state.undoStack.length > 50) state.undoStack.shift();
    state.redoStack = [];

    state.gridA = Array(state.rowsA * state.colsA).fill(0);
    state.gridB = Array(state.rowsB * state.colsB).fill(0);
    state.gridC = Array(state.rowsC * state.colsC).fill(0);
    state.currentCalculation = null;
  })),

  undo: () => set(produce((state: MatrixState) => {
    if (state.undoStack.length === 0) return;
    const prevState = state.undoStack.pop()!;
    state.redoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    
    state.gridA = prevState.gridA;
    state.gridB = prevState.gridB;
    state.gridC = prevState.gridC;
    state.rowsA = prevState.rowsA;
    state.colsA = prevState.colsA;
    state.rowsB = prevState.rowsB;
    state.colsB = prevState.colsB;
    state.rowsC = prevState.rowsC;
    state.colsC = prevState.colsC;
  })),

  redo: () => set(produce((state: MatrixState) => {
    if (state.redoStack.length === 0) return;
    const nextState = state.redoStack.pop()!;
    state.undoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    
    state.gridA = nextState.gridA;
    state.gridB = nextState.gridB;
    state.gridC = nextState.gridC;
    state.rowsA = nextState.rowsA;
    state.colsA = nextState.colsA;
    state.rowsB = nextState.rowsB;
    state.colsB = nextState.colsB;
    state.rowsC = nextState.rowsC;
    state.colsC = nextState.colsC;
  })),

  executeOperation: (op) => {
    const { gridA, rowsA, colsA, gridB, rowsB, colsB, gridC, rowsC, colsC } = get();
    
    try {
      const toMathMatrix = (g: (number | string)[], r: number, c: number) => {
        const arr: number[][] = [];
        for (let i = 0; i < r; i++) {
          arr.push(g.slice(i * c, (i + 1) * c).map(v => Number(v) || 0));
        }
        return math.matrix(arr);
      };

      const matA = toMathMatrix(gridA, rowsA, colsA);
      const matB = toMathMatrix(gridB, rowsB, colsB);
      // matC not used in unary ops but available for binary matC logic if needed

      const getRREF = (m: math.Matrix) => {
        const A = m.toArray() as number[][];
        let pivot = 0;
        const rowCount = A.length;
        const colCount = A[0].length;
        for (let r = 0; r < rowCount; r++) {
          if (colCount <= pivot) break;
          let i = r;
          while (Math.abs(A[i][pivot]) < 1e-10) {
            i++;
            if (rowCount === i) {
              i = r;
              pivot++;
              if (colCount === pivot) return math.matrix(A);
            }
          }
          const temp = A[i]; A[i] = A[r]; A[r] = temp;
          const pivotVal = A[r][pivot];
          for (let j = 0; j < colCount; j++) A[r][j] /= pivotVal;
          for (let k = 0; k < rowCount; k++) {
            if (k !== r) {
              const factor = A[k][pivot];
              for (let j = 0; j < colCount; j++) A[k][j] -= factor * A[r][j];
            }
          }
          pivot++;
        }
        return math.matrix(A);
      };

      const getRank = (m: math.Matrix) => {
        const rf = getRREF(m).toArray() as number[][];
        let rank = 0;
        for (const row of rf) {
          if (row.some(v => Math.abs(v) > 1e-10)) rank++;
        }
        return rank;
      };
      
      let result: unknown;
      const label = op.toUpperCase();

      switch (op) {
        case 'det_A': if (rowsA !== colsA) throw new Error("A must be square"); result = math.det(matA); break;
        case 'inv_A': if (rowsA !== colsA) throw new Error("A must be square"); result = math.inv(matA); break;
        case 'trans_A': result = math.transpose(matA); break;
        case 'rank_A': result = getRank(matA); break;
        case 'trace_A': if (rowsA !== colsA) throw new Error("A must be square"); result = math.trace(matA); break;
        case 'rref_A': result = getRREF(matA); break;

        case 'det_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.det(matB); break;
        case 'inv_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.inv(matB); break;
        case 'trans_B': result = math.transpose(matB); break;
        case 'rank_B': result = getRank(matB); break;
        case 'trace_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.trace(matB); break;
        case 'rref_B': result = getRREF(matB); break;

        case 'det_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          if (rowsC !== colsC) throw new Error("C must be square"); result = math.det(matC_local); break;
        }
        case 'inv_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          if (rowsC !== colsC) throw new Error("C must be square"); result = math.inv(matC_local); break;
        }
        case 'trans_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          result = math.transpose(matC_local); break;
        }
        case 'rank_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          result = getRank(matC_local); break;
        }
        case 'trace_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          if (rowsC !== colsC) throw new Error("C must be square"); result = math.trace(matC_local); break;
        }
        case 'rref_C': {
          const matC_local = toMathMatrix(gridC, rowsC, colsC);
          result = getRREF(matC_local); break;
        }

        case 'add_AB': if (rowsA !== rowsB || colsA !== colsB) throw new Error("A & B dimensions must match"); result = math.add(matA, matB); break;
        case 'sub_AB': if (rowsA !== rowsB || colsA !== colsB) throw new Error("A & B dimensions must match"); result = math.subtract(matA, matB); break;
        case 'mul_AB': if (colsA !== rowsB) throw new Error("Inner dimensions (A cols & B rows) must match"); result = math.multiply(matA, matB); break;
        case 'mul_BA': if (colsB !== rowsA) throw new Error("Inner dimensions (B cols & A rows) must match"); result = math.multiply(matB, matA); break;

        default: throw new Error(`Operation ${op} not implemented`);
      }

      set(produce((state: MatrixState) => {
        state.undoStack.push({
          gridA: [...gridA], gridB: [...gridB], gridC: [...gridC],
          rowsA, colsA, rowsB, colsB, rowsC, colsC
        });
        if (state.undoStack.length > 50) state.undoStack.shift();
        state.redoStack = [];

        state.currentCalculation = { operation: label, result };
        
        if (math.isMatrix(result) || Array.isArray(result)) {
          const resArray = math.isMatrix(result) ? result.toArray() : (result as unknown[]);
          state.rowsC = resArray.length;
          state.colsC = Array.isArray(resArray[0]) ? resArray[0].length : 1;
          state.gridC = resArray.flat().map((v: unknown) => typeof v === 'number' ? Number(v.toFixed(4)) : v) as (number | string)[];
        }

        state.history.unshift({ id: crypto.randomUUID(), timestamp: Date.now(), operation: label, result });
        if (state.history.length > 15) state.history.pop();
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`MATRIX ERROR: ${message}`);
      set({ currentCalculation: { operation: op, result: `ERR: ${message}` } });
    }
  },

  clearHistory: () => set({ history: [] }),
}))
