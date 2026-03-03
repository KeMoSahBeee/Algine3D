# Features Research

**Project:** LinearBase (3D Matrix Calculator)
**Researched:** March 2026 (for 2025 Standard)

## Table Stakes (Must Have)
| Feature | Priority | Complexity | Rationale |
|---------|----------|------------|-----------|
| NxN Matrix Input | High | Medium | Basic functionality for matrix calculation. |
| Basic Operations | High | Low | Determinant, inverse, transpose, etc. (Math.js handles these). |
| 3D Visualization | High | Medium | Vector representation in a 3D coordinate system. |
| Orbit Controls | High | Low | Essential for interacting with a 3D scene (zoom, pan, rotate). |
| Coordinate Labels | High | Low | Visualizing axes and vector magnitudes. |

## Differentiators (Competitive Advantage)
| Feature | Priority | Complexity | Rationale |
|---------|----------|------------|-----------|
| 4D+ Visualization | Medium | High | Unique ability to visualize higher-dimensional data through projections (e.g., tesseract-style). |
| Dynamic Key Input | High | Medium | Custom matrix-style interaction (Space for next element, Enter for next row). |
| Calculation History | Medium | Low | Local session history of the last 10 operations for quick reference. |
| Animated Transitions | Medium | Medium | Smoothly animating changes in matrix values for better visual understanding. |

## Anti-Features (Deliberately NOT Building)
| Feature | Why |
|---------|-----|
| User Accounts | Overkill for a quick, interactive tool. |
| Cloud Storage | Keep it private and fast with local session only. |
| 2D Data Plotting | Focus on matrix/vector visualization in 3D/4D space. |

## Feature Dependencies
- **Calculation History** depends on **MathEngine** results.
- **3D Visualization** depends on **NxN Matrix Input** state.
- **4D+ Visualization** depends on specific projection algorithms in **MathEngine**.
