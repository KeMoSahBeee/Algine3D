# Project Context: LinearBase (3D Matrix Calculator)

A high-performance web application for calculating and visualizing NxN matrices in 3D (and 4D+ projection) using Three.js and Math.js. The goal is to provide a seamless, interactive experience for entering matrix values and viewing their vector representations in a 3D coordinate system, similar to tools like Geogebra.

## Core Value
To provide an intuitive, visual, and powerful interface for performing complex matrix operations and immediately visualizing the results in a 3D/4D space.

## Stated Constraints
- **Tech Stack:** React (TypeScript), Three.js, Math.js.
- **Budget/Timeline:** Not specified, but prioritize modularity and performance.
- **Visuals:** Orbit controls, color coding, labels, and animations for vectors.
- **Input:** Custom matrix-style input with specific key interactions (Space for next element, Enter for next row).

## Requirements

### Validated
(None yet - starting from scratch)

### Active
- [ ] **UI-01:** Matrix-style input grid with dynamic bracket visualization.
- [ ] **UI-02:** Key handling (Space/Enter) for efficient matrix data entry.
- [ ] **CALC-01:** Full suite of matrix operations (determinant, inverse, multiplication, etc.) via Math.js.
- [ ] **VIZ-01:** 3D vector visualization with Three.js (axes, labels, colors).
- [ ] **VIZ-02:** Orbit controls for free camera movement (similar to Geogebra).
- [ ] **VIZ-03:** 4D+ matrix visualization using projections or slicing.
- [ ] **HIST-01:** Storage of the last 10 calculations in session history.

### Out of Scope
- **Exporting:** No export (PNG/PDF/Data) in v1.
- **Persistent Storage:** No database or account system (local session only).

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React (TypeScript) | User preference for modern, type-safe UI development. | — Pending |
| Three.js | Required for high-quality 3D rendering and Geogebra-like interaction. | — Pending |
| Math.js | Comprehensive library for all matrix calculations. | — Pending |
| 4D+ Projection | Support for higher-dimensional data through 3D visualization techniques. | — Pending |

---
*Last updated: March 3, 2026 after initialization*
