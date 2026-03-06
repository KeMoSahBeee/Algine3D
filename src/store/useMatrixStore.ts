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
  isResultVisible: boolean;
  labHeight: number;
  sidebarWidth: number;
  rotationAngle: number;
  theme: 'dark' | 'light';
  undoStack: MatrixStateSnapshot[];
  redoStack: MatrixStateSnapshot[];
  
  setDimensions: (matrix: 'A' | 'B', rows: number, cols: number) => void;
  setCellValue: (matrix: 'A' | 'B' | 'C', index: number, value: number | string) => void;
  resetGrids: () => void;
  resetMatrixA: () => void;
  resetMatrixB: () => void;
  executeOperation: (op: MatrixOperation) => void;
  toggleKeyboard: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  toggleResultVisibility: () => void;
  setLabHeight: (height: number) => void;
  setSidebarWidth: (width: number) => void;
  setRotationAngle: (angle: number | ((prev: number) => number)) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  restoreHistoryItem: (id: string) => void;
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
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 640 : true,
  isKeyboardOpen: false,
  isResultVisible: false,
  labHeight: 380,
  sidebarWidth: 380,
  rotationAngle: 0,
  theme: 'dark',
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
    
    // Auto-resize sidebar based on cols with strict minimum for 5x5
    const maxCols = Math.max(state.colsA, state.colsB);
    state.sidebarWidth = Math.max(state.sidebarWidth, maxCols * 72 + 80);
    if (maxCols === 5) state.sidebarWidth = Math.max(state.sidebarWidth, 420);
    
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

  toggleKeyboard: () => set((state) => {
    const isMobile = window.innerWidth < 640;
    const nextValue = !state.isKeyboardOpen;
    return { 
      isKeyboardOpen: nextValue,
      ...(isMobile && nextValue ? { isSidebarOpen: false, isResultVisible: false } : {})
    };
  }),
  toggleSidebar: () => set((state) => {
    const isMobile = window.innerWidth < 640;
    const nextValue = !state.isSidebarOpen;
    return { 
      isSidebarOpen: nextValue,
      ...(isMobile && nextValue ? { isKeyboardOpen: false, isResultVisible: false } : {})
    };
  }),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),
  toggleResultVisibility: () => set((state) => {
    const isMobile = window.innerWidth < 640;
    const nextValue = !state.isResultVisible;
    return { 
      isResultVisible: nextValue,
      ...(isMobile && nextValue ? { isSidebarOpen: false, isKeyboardOpen: false } : {})
    };
  }),
  setLabHeight: (height) => set(state => {
    const minH = state.rowsC === 5 ? 420 : 320;
    const maxH = window.innerHeight * 0.9;
    return { labHeight: Math.max(Math.min(minH, maxH), Math.min(height, maxH)) };
  }),
  setSidebarWidth: (width) => set(state => {
    const isMobile = window.innerWidth < 640;
    const minW = Math.max(state.colsA, state.colsB) === 5 ? 420 : 340;
    const maxW = isMobile ? window.innerWidth * 0.95 : window.innerWidth * 0.6;
    return { sidebarWidth: Math.max(Math.min(minW, maxW), Math.min(width, maxW)) };
  }),
  setRotationAngle: (angle) => set((state) => ({ 
    rotationAngle: typeof angle === 'function' ? angle(state.rotationAngle) : angle 
  })),

  resetMatrixA: () => set(produce((state: MatrixState) => {
    state.undoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    if (state.undoStack.length > 50) state.undoStack.shift();
    state.redoStack = [];
    state.gridA = Array(state.rowsA * state.colsA).fill(0);
  })),

  resetMatrixB: () => set(produce((state: MatrixState) => {
    state.undoStack.push({
      gridA: [...state.gridA], gridB: [...state.gridB], gridC: [...state.gridC],
      rowsA: state.rowsA, colsA: state.colsA,
      rowsB: state.rowsB, colsB: state.colsB,
      rowsC: state.rowsC, colsC: state.colsC
    });
    if (state.undoStack.length > 50) state.undoStack.shift();
    state.redoStack = [];
    state.gridB = Array(state.rowsB * state.colsB).fill(0);
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
      const matC = toMathMatrix(gridC, rowsC, colsC);

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

      const getEigens = (m: math.Matrix) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { eigenvectors } = math.eigs(m) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return math.matrix(eigenvectors.map((e: any) => e.vector));
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
        case 'eig_A': if (rowsA !== colsA) throw new Error("A must be square"); result = getEigens(matA); break;

        case 'det_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.det(matB); break;
        case 'inv_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.inv(matB); break;
        case 'trans_B': result = math.transpose(matB); break;
        case 'rank_B': result = getRank(matB); break;
        case 'trace_B': if (rowsB !== colsB) throw new Error("B must be square"); result = math.trace(matB); break;
        case 'rref_B': result = getRREF(matB); break;
        case 'eig_B': if (rowsB !== colsB) throw new Error("B must be square"); result = getEigens(matB); break;

        case 'det_C': if (rowsC !== colsC) throw new Error("C must be square"); result = math.det(matC); break;
        case 'inv_C': if (rowsC !== colsC) throw new Error("C must be square"); result = math.inv(matC); break;
        case 'trans_C': result = math.transpose(matC); break;
        case 'rank_C': result = getRank(matC); break;
        case 'trace_C': if (rowsC !== colsC) throw new Error("C must be square"); result = math.trace(matC); break;
        case 'rref_C': result = getRREF(matC); break;
        case 'eig_C': if (rowsC !== colsC) throw new Error("C must be square"); result = getEigens(matC); break;

        case 'add_AB': if (rowsA !== rowsB || colsA !== colsB) throw new Error("A & B dimensions must match"); result = math.add(matA, matB); break;
        case 'sub_AB': if (rowsA !== rowsB || colsA !== colsB) throw new Error("A & B dimensions must match"); result = math.subtract(matA, matB); break;
        case 'mul_AB': if (colsA !== rowsB) throw new Error("Inner dimensions (A cols & B rows) must match"); result = math.multiply(matA, matB); break;
        case 'mul_BA': if (colsB !== rowsA) throw new Error("Inner dimensions (B cols & A rows) must match"); result = math.multiply(matB, matA); break;

        case 'add_BC': if (rowsB !== rowsC || colsB !== colsC) throw new Error("B & C dimensions must match"); result = math.add(matB, matC); break;
        case 'sub_BC': if (rowsB !== rowsC || colsB !== colsC) throw new Error("B & C dimensions must match"); result = math.subtract(matB, matC); break;
        case 'mul_BC': if (colsB !== rowsC) throw new Error("Inner dimensions (B cols & C rows) must match"); result = math.multiply(matB, matC); break;
        case 'mul_CB': if (colsC !== rowsB) throw new Error("Inner dimensions (C cols & B rows) must match"); result = math.multiply(matC, matB); break;

        case 'add_AC': if (rowsA !== rowsC || colsA !== colsC) throw new Error("A & C dimensions must match"); result = math.add(matA, matC); break;
        case 'sub_AC': if (rowsA !== rowsC || colsA !== colsC) throw new Error("A & C dimensions must match"); result = math.subtract(matA, matC); break;
        case 'mul_AC': if (colsA !== rowsC) throw new Error("Inner dimensions (A cols & C rows) must match"); result = math.multiply(matA, matC); break;
        case 'mul_CA': if (colsC !== rowsA) throw new Error("Inner dimensions (C cols & A rows) must match"); result = math.multiply(matC, matA); break;

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
        state.isResultVisible = true; // Auto-show result on calculation

        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          state.isSidebarOpen = false;
          state.isKeyboardOpen = false;
        }
        
        if (math.isMatrix(result) || Array.isArray(result)) {
          const resArray = math.isMatrix(result) ? result.toArray() : (result as unknown[]);
          state.rowsC = resArray.length;
          state.colsC = Array.isArray(resArray[0]) ? resArray[0].length : 1;
          state.gridC = resArray.flat().map((v: unknown) => typeof v === 'number' ? Number(v.toFixed(4)) : v) as (number | string)[];
          
          state.labHeight = Math.max(state.rowsC === 5 ? 420 : 320, state.rowsC * 60 + 120);
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

  restoreHistoryItem: (id) => {
    const { history } = get();
    const item = history.find(h => h.id === id);
    if (!item || !item.result) return;

    set(produce((state: MatrixState) => {
      if (math.isMatrix(item.result) || Array.isArray(item.result)) {
        const resArray = math.isMatrix(item.result) ? item.result.toArray() : (item.result as unknown[]);
        state.rowsC = resArray.length;
        state.colsC = Array.isArray(resArray[0]) ? resArray[0].length : 1;
        state.gridC = resArray.flat().map((v: unknown) => typeof v === 'number' ? Number(v.toFixed(4)) : v) as (number | string)[];
        state.currentCalculation = { operation: item.operation, result: item.result };
        state.isResultVisible = true;

        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          state.isSidebarOpen = false;
          state.isKeyboardOpen = false;
        }
      }
    }));
  },
}))
