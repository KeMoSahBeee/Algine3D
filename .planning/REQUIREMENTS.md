# Requirements

**Project:** LinearBase (3D Matrix Calculator)
**v1 Scope:** Comprehensive Feature Set

## v1 Requirements

### UI & Interaction
- [x] **UI-01**: User can input matrix values in a dynamic NxN bracket-style grid.
- [x] **UI-02**: User can navigate to the next cell with Space and the next row with Enter.
- [x] **UI-03**: User can complete matrix entry by clicking a "Done" button or equivalent shortcut.
- [x] **UI-04**: Responsive design for both the matrix input and the 3D visualization area.

### Calculation Engine (Math.js)
- [x] **CALC-01**: Perform basic matrix operations (determinant, inverse, transpose, multiplication).
- [x] **CALC-02**: Support for advanced matrix operations like Eigenvalues/Eigenvectors (via Math.js).
- [x] **CALC-03**: Real-time recalculation when matrix values are updated and confirmed.

### 3D Visualization (Three.js/R3F)
- [x] **VIZ-01**: Render vectors as 3D arrows originating from the origin (0,0,0) based on matrix columns.
- [x] **VIZ-02**: Implement Orbit Controls for mouse interaction (rotate, zoom, pan).
- [x] **VIZ-03**: Display labeled coordinate axes (X, Y, Z) and grid lines for context.
- [x] **VIZ-04**: Use color coding for different vectors to distinguish between them.

### Advanced Visualization & History
- [x] **ADV-01**: Project 4D+ matrix columns into 3D space using perspective projection (W-divide).
- [x] **HIST-01**: Store and display the last 10 calculations in a session history panel.
- [x] **HIST-02**: User can click a history item to re-load its values into the matrix input.

## v2 Requirements (Deferred)
- [ ] **EXP-01**: Export calculation results to CSV or JSON.
- [ ] **EXP-02**: Export 3D visualization as a high-quality PNG.
- [ ] **SYNC-01**: Cloud storage for calculations (requires user accounts).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| UI-04 | Phase 4 | Complete |
| CALC-01 | Phase 2 | Complete |
| CALC-02 | Phase 5 | Complete |
| CALC-03 | Phase 2 | Complete |
| VIZ-01 | Phase 3 | Complete |
| VIZ-02 | Phase 4 | Complete |
| VIZ-03 | Phase 3 | Complete |
| VIZ-04 | Phase 3 | Complete |
| ADV-01 | Phase 5 | Complete |
| HIST-01 | Phase 6 | Complete |
| HIST-02 | Phase 6 | Complete |

## Out of Scope
- **4D Animation:** Complex 4D rotations (tumbling) beyond simple static projections.
- **Complex UI Components:** No multi-tab system or complex dashboard beyond the main calculator/visualizer.

---
*Last updated: March 3, 2026 after roadmap creation*
