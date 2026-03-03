# Roadmap: LinearBase (3D Matrix Calculator)

This roadmap outlines the phased development of LinearBase, moving from core input and math logic to interactive 3D visualization and advanced features.

## Phases

- [ ] **Phase 1: Matrix Input Engine** - Create the specialized NxN grid for efficient data entry.
- [ ] **Phase 2: Math Engine & Basic Operations** - Integrate Math.js for core linear algebra calculations.
- [ ] **Phase 3: Core 3D Visualization** - Render matrix vectors in a labeled 3D coordinate space.
- [ ] **Phase 4: Interactive Viewport & Responsiveness** - Enable camera controls and responsive UI layout.
- [ ] **Phase 5: Advanced Math & 4D Projection** - Implement eigenvalues and higher-dimensional projections.
- [ ] **Phase 6: Session History** - Track and reload previous calculations within the local session.

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Matrix Input Engine | 0/0 | Not started | - |
| 2. Math Engine & Basic Operations | 0/0 | Not started | - |
| 3. Core 3D Visualization | 0/0 | Not started | - |
| 4. Interactive Viewport & Responsiveness | 0/0 | Not started | - |
| 5. Advanced Math & 4D Projection | 0/0 | Not started | - |
| 6. Session History | 0/0 | Not started | - |

## Phase Details

### Phase 1: Matrix Input Engine
**Goal**: Enable users to input NxN matrix values quickly and intuitively.
**Depends on**: Initial Project Setup
**Requirements**: UI-01, UI-02, UI-03
**Success Criteria**:
1. User can input numbers into a dynamic NxN bracket-style grid.
2. User can navigate cells using Space and rows using Enter.
3. User can confirm the matrix entry to trigger downstream logic.
**Plans**: TBD

### Phase 2: Math Engine & Basic Operations
**Goal**: Perform robust linear algebra calculations on user input.
**Depends on**: Phase 1
**Requirements**: CALC-01, CALC-03
**Success Criteria**:
1. User sees calculated determinant, inverse, transpose, and product immediately after confirming input.
2. Calculations update in real-time when matrix values are modified.
**Plans**: TBD

### Phase 3: Core 3D Visualization
**Goal**: Provide a visual representation of matrix columns as vectors.
**Depends on**: Phase 2
**Requirements**: VIZ-01, VIZ-03, VIZ-04
**Success Criteria**:
1. User sees 3D arrows originating from (0,0,0) based on matrix column values.
2. Coordinate axes (X, Y, Z) are clearly labeled.
3. Different vectors are distinguishable via unique colors.
**Plans**: TBD

### Phase 4: Interactive Viewport & Responsiveness
**Goal**: Allow users to explore the 3D space and use the app on various devices.
**Depends on**: Phase 3
**Requirements**: VIZ-02, UI-04
**Success Criteria**:
1. User can rotate, zoom, and pan the 3D scene using mouse/touch.
2. The UI layout adjusts gracefully to different screen aspect ratios.
**Plans**: TBD

### Phase 5: Advanced Math & 4D Projection
**Goal**: Support complex linear algebra and higher-dimensional data.
**Depends on**: Phase 4
**Requirements**: CALC-02, ADV-01
**Success Criteria**:
1. User can see Eigenvalues and Eigenvectors for the current matrix.
2. 4D matrix columns are projected into 3D space using perspective projection.
**Plans**: TBD

### Phase 6: Session History
**Goal**: Provide a convenient way to revisit recent work.
**Depends on**: Phase 2
**Requirements**: HIST-01, HIST-02
**Success Criteria**:
1. User can view a list of the last 10 calculations performed in the current session.
2. Clicking a history item restores that specific matrix to the input grid.
**Plans**: TBD
