# Domain Pitfalls: 3D Matrix Calculation Web App

**Domain:** 3D/4D Mathematical Visualization
**Researched:** March 3, 2026
**Overall confidence:** HIGH

## Critical Pitfalls

Mistakes that cause rewrites or major performance bottlenecks.

### Pitfall 1: The "ArrowHelper" Performance Trap
**What goes wrong:** Using `THREE.ArrowHelper` for every vector in a visualization.
**Why it happens:** Each `ArrowHelper` is a group of multiple geometries/materials. Visualizing a 10x10 matrix (100 vectors) or larger leads to excessive draw calls.
**Consequences:** Frame rate drops significantly as the matrix size grows; UI becomes unresponsive.
**Prevention:** Use `InstancedMesh` for vector shafts and heads. This allows rendering thousands of vectors in a single draw call.
**Detection:** Low FPS (below 60) when matrix dimensions exceed 5x5.

### Pitfall 2: Math.js Garbage Collection (GC) Jitter
**What goes wrong:** High-frequency matrix operations (rotations/projections) cause "stuttering".
**Why it happens:** Math.js creates new `Matrix` objects for every operation. In an animation loop (60fps), this creates thousands of short-lived objects.
**Consequences:** The browser's garbage collector triggers frequently, causing noticeable micro-freezes.
**Prevention:** Use `math.config({matrix: 'Array'})` for better performance or use `Float64Array` TypedArrays for "hot" calculation loops, reserving Math.js for high-level setup.
**Detection:** Chrome DevTools "Performance" tab showing frequent "Major GC" events during animation.

### Pitfall 3: React "Matrix State" Re-render Storm
**What goes wrong:** Typing in one matrix cell causes the entire input grid (and potentially the 3D scene) to re-render.
**Why it happens:** Storing the entire matrix as a single nested array in a parent `useState` hook.
**Consequences:** Significant input lag (typing feels "heavy"); poor UX for larger matrices.
**Prevention:** Memoize cell components using `React.memo`. Use an atomic state management library (Zustand or Jotai) to update specific cells without triggering a full grid re-render.
**Detection:** React DevTools "Profiler" showing every cell re-rendering on a single keystroke.

### Pitfall 4: Incorrect 4D Projection (The W-Divide)
**What goes wrong:** 4D visualizations look "flat" or move like standard 3D objects.
**Why it happens:** Forgetting to perform the perspective divide by the 4th dimension ($w$) before the 3D projection, or implementing only 3 rotation planes instead of all 6.
**Consequences:** The "4D" feature feels like a gimmick rather than a true mathematical projection.
**Prevention:** Explicitly divide 4D coordinates by $(distance - w)$ before passing to Three.js. Implement all 6 rotation planes ($XY, XZ, XW, YZ, YW, ZW$).
**Detection:** The "tesseract" or 4D object doesn't appear to turn "inside-out" during rotation.

---

## Moderate Pitfalls

### Pitfall 1: Loss of Depth Perception
**What goes wrong:** Users cannot tell if a vector is pointing towards or away from the camera.
**Why it happens:** Using `MeshBasicMaterial` (no lighting) and lack of reference frames.
**Prevention:** Use `MeshStandardMaterial` with `DirectionalLight`. Always include a `GridHelper` and coordinate axes ($X, Y, Z$) as references.
**Detection:** 3D scene looks "flat" or ambiguous when the camera is stationary.

### Pitfall 2: Floating Point Matrix Drift
**What goes wrong:** Animated objects warp, scale, or disappear over time.
**Why it happens:** Repeatedly multiplying a rotation matrix by itself causes small floating-point errors to accumulate.
**Consequences:** The matrix is no longer "orthogonal" (lengths and angles are distorted).
**Prevention:** Periodically re-normalize the basis vectors of the transformation matrix or use quaternions for rotations.
**Detection:** An object slowly gets larger or smaller after minutes of continuous rotation.

### Pitfall 3: Keyboard Navigation & Copy-Paste Friction
**What goes wrong:** Users find it tedious to enter large amounts of matrix data.
**Why it happens:** Relying on mouse clicks for cell focus and missing `Ctrl+V` support.
**Prevention:** Implement `Space/Enter` key handling (as requested) and standard Arrow Key navigation. Add a clipboard listener to parse CSV/Excel data into the grid.
**Detection:** Users manually clicking every cell; negative feedback regarding "manual data entry".

---

## Minor Pitfalls

### Pitfall 1: Coordinate Space Misalignment
**What goes wrong:** Vectors point in the wrong direction despite correct math.
**Why it happens:** Three.js cylinders/cones are Y-aligned by default, but matrix math usually assumes Z-up or X-forward.
**Prevention:** Use `Object3D.lookAt()` or `Quaternion.setFromUnitVectors()` to align the mesh with the target vector.
**Detection:** A vector [1, 0, 0] points up instead of right.

### Pitfall 2: Distorted Arrowheads
**What goes wrong:** Long vectors have giant arrowheads; short vectors have tiny ones.
**Why it happens:** Scaling the entire vector mesh uniformly.
**Prevention:** Scale only the shaft length; keep the arrowhead at a constant scale or use a shader to handle dynamic scaling.
**Detection:** Visual inconsistency in arrow proportions across the scene.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 1: Input/Calc** | React Re-render Storm | Use `React.memo` for cells and Zustand for atomic updates. |
| **Phase 1: Input/Calc** | GC Jitter | Avoid `math.matrix()` in high-frequency loops; use raw Arrays. |
| **Phase 2: 3D Viz** | ArrowHelper Trap | Start with `InstancedMesh` from the beginning. |
| **Phase 2: 3D Viz** | Coordinate Alignment | Validate [1,0,0], [0,1,0], and [0,0,1] vectors immediately. |
| **Phase 3: 4D+ Viz** | W-Divide Error | Use a verified projection formula: $P_{3D} = P_{4D} / (dist - w)$. |
| **Phase 3: 4D+ Viz** | Matrix Drift | Implement a "Renormalization" step in the animation loop. |

## Sources

- [Three.js Performance Tips (InstancedMesh)](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [Math.js Performance Documentation](https://mathjs.org/docs/datatypes/matrices.html#performance)
- [React Grid Performance (A11y/UX)](https://handsontable.com/blog/react-grid-performance)
- [4D Rotation Planes & Projections (Mathematical Reference)](https://en.wikipedia.org/wiki/Rotations_in_4-dimensional_Euclidean_space)
