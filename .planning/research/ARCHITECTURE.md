# Architecture Research

**Project:** LinearBase (3D Matrix Calculator)
**Researched:** March 2026 (for 2025 Standard)

## Component Boundaries

### 1. Matrix UI (Frontend)
- **MatrixGrid:** Custom React component for the matrix-style input (dynamic brackets, key handling).
- **HistoryPanel:** Sidebar for viewing the last 10 calculations.
- **ControlPanel:** UI for selecting operations (determinant, inverse, etc.) and visualization modes (3D vs 4D).

### 2. Math Engine (Core)
- **MathProcessor:** Wrapper for Math.js to handle all calculations.
- **ProjectionEngine:** Custom logic for 4D to 3D projection/slicing.

### 3. Visualization Engine (Three.js/R3F)
- **VectorScene:** Main canvas container for 3D/4D rendering.
- **VectorModel:** Instanced meshes for shafts and heads (performance-focused).
- **CoordinateSystem:** Axes, grids, and labels for spatial context.

### 4. State Management (Zustand)
- **MatrixStore:** Atomic state for the current matrix, operation history, and visualization settings.

## Data Flow
1. **User Input:** Data entered in **MatrixGrid** via custom key handlers.
2. **State Update:** **MatrixStore** is updated with the new matrix values.
3. **Calculation:** **MathProcessor** calculates the result (e.g., inverse, determinant).
4. **Rendering:** **VectorScene** and its child components re-render based on the calculated result and visualization mode.
5. **History:** Successful calculations are pushed to the **HistoryPanel**.

## Suggested Build Order
1. **Foundation:** Setup React, Three.js, and Zustand boilerplate.
2. **Core Logic:** Implement the matrix input grid and Math.js integration.
3. **3D Scene:** Create the basic 3D coordinate system and simple vector rendering.
4. **Optimization:** Implement InstancedMesh for performance and polish animations.
5. **Advanced Features:** Add 4D+ projection and history management.
