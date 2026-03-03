# Research Summary: LinearBase (3D Matrix Calculator)

**Date:** March 2026
**Status:** Synthesis Complete

## Executive Summary

LinearBase is a high-performance 3D/4D matrix calculator designed for browser-based mathematical visualization. Experts in this domain typically leverage **React** for the user interface, **Three.js** (via **@react-three/fiber**) for high-fidelity 3D rendering, and **Math.js** for robust linear algebra operations. The product aims to provide an intuitive interface for NxN matrix manipulation coupled with real-time visual feedback in a 3D coordinate system.

The recommended approach prioritizes performance and scalability. By using **Zustand** for atomic state management and **InstancedMesh** for vector rendering, the application avoids common bottlenecks like UI input lag ("re-render storms") and rendering degradation ("draw call overhead"). This ensures that even as matrix dimensions grow, the application remains responsive and the visualization fluid.

Key risks include garbage collection jitter from high-frequency math operations and potential mathematical inaccuracies in 4D projections. These are mitigated through a carefully selected tech stack (React 19, Tailwind 4) and specific implementation strategies (W-divide projections and manual memory management in hot loops).

---

## Key Findings

### Technology Stack (from STACK.md)
*   **Core Framework:** React 19.2 (UI) and TypeScript 5.7+ (Type safety).
*   **3D & Math:** Three.js r171+ with `@react-three/fiber` for declarative rendering; Math.js 15.1 for linear algebra.
*   **State & Styling:** Zustand 5.0 for lightweight, atomic state; Tailwind CSS 4.0 for high-performance styling.
*   **Rationale:** React 19's compiler and R3F's reconciler provide the best ecosystem for high-frequency updates, while Math.js offers the most comprehensive feature set for NxN operations.

### Feature Set (from FEATURES.md)
*   **Table Stakes:** NxN matrix input grid, basic operations (determinant, inverse, transpose), 3D vector visualization with Orbit Controls.
*   **Differentiators:** 4D+ visualization via projections, dynamic key handling (Space/Enter navigation), and local calculation history.
*   **Anti-Features:** No user accounts or cloud storage; the focus is on a fast, private, tool-first experience.

### Architecture Patterns (from ARCHITECTURE.md)
*   **Decoupled Engines:** Separate Matrix UI (React), Math Engine (Math.js wrapper), and Visualization Engine (R3F).
*   **Atomic Data Flow:** User input updates a Zustand `MatrixStore`, which triggers isolated re-renders in the grid and calculations in the math processor, finally updating the 3D scene.
*   **Performance First:** Use of `InstancedMesh` for vector components to minimize draw calls.

### Critical Pitfalls (from PITFALLS.md)
*   **The "ArrowHelper" Trap:** Avoid built-in Three.js helpers for large matrices; use instancing to maintain 60 FPS.
*   **Re-render Storms:** Storing the matrix as a single nested array in `useState` causes input lag; use `React.memo` and atomic state updates instead.
*   **4D Projection Errors:** Ensure the perspective divide ($w$) and all 6 rotation planes are correctly implemented for a true 4D experience.

---

## Implications for Roadmap

### Suggested Phase Structure

1.  **Phase 1: Foundation & Core Logic**
    *   **Rationale:** Establish the mathematical and state foundation before layering on 3D complexity.
    *   **Delivers:** Functional NxN grid, Math.js integration, and basic UI.
    *   **Pitfalls to Avoid:** React Re-render Storm; GC Jitter from high-frequency math objects.

2.  **Phase 2: 3D Visualization**
    *   **Rationale:** Visualize the core data structure once the math is validated.
    *   **Delivers:** Three.js canvas, coordinate axes, and instanced vector rendering.
    *   **Pitfalls to Avoid:** "ArrowHelper" performance trap; Coordinate space misalignment.

3.  **Phase 3: Advanced Projections & Polish**
    *   **Rationale:** Add high-value differentiators on top of a stable 3D base.
    *   **Delivers:** 4D projections, animated transitions, and calculation history.
    *   **Pitfalls to Avoid:** W-Divide errors; Floating point matrix drift during continuous rotation.

### Research Flags
*   **Needs Research:** Phase 3 (4D Projections) requires precise validation of projection formulas and rotation planes.
*   **Standard Patterns:** Phase 1 (React/Zustand) and Phase 2 (Basic Three.js) follow well-documented patterns and can likely skip deep research.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Standard modern ecosystem (React 19 + R3F + Math.js). |
| Features | HIGH | Well-defined scope with clear differentiators. |
| Architecture | HIGH | Standard decoupled pattern for data-driven 3D apps. |
| Pitfalls | HIGH | Performance traps in Three.js and React are well-documented. |

### Gaps to Address
*   **Clipboard Support:** Precise technical implementation for parsing Excel/CSV into the grid remains to be detailed.
*   **Shader Optimization:** If 4D visualizations scale beyond hundreds of vectors, custom shaders may be needed for the W-divide, which hasn't been researched yet.

---

## Sources
*   [React 19 & Three.js Release Notes](https://react.dev/blog/2024/12/05/react-19)
*   [Poimandres (R3F/Drei) Documentation](https://docs.pmnd.rs/react-three-fiber/)
*   [Math.js Performance Guide](https://mathjs.org/docs/datatypes/matrices.html#performance)
*   [Three.js Performance Tips (InstancedMesh)](https://threejs.org/docs/#api/en/objects/InstancedMesh)
*   [4D Projection Mathematical Reference](https://en.wikipedia.org/wiki/Rotations_in_4-dimensional_Euclidean_space)
