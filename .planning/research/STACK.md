# Technology Stack

**Project:** LinearBase (3D Matrix Calculator)
**Researched:** March 2026 (for 2025 Standard)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.2.x | UI Library | Industry standard, React 19 features like the compiler and improved concurrent rendering are ideal for high-frequency matrix updates. |
| TypeScript | 5.7+ | Language | Type safety for complex matrix shapes and vector operations is non-negotiable for stability. |

### 3D Rendering & Math
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Three.js | r171+ | 3D Engine | The engine for all 3D visualizations, axes, and vector rendering. |
| @react-three/fiber | 9.5.x | React Bridge | Declarative Three.js for React; integrates seamlessly with React 19's reconciler. |
| Math.js | 15.1.x | Math Engine | Comprehensive matrix operation support (inverse, determinant, multiplication) out of the box. |

### State Management & UI
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 5.0.x | State Management | Extremely lightweight and fast; perfect for managing the "current matrix" state across the grid and 3D scene. |
| Tailwind CSS | 4.0.x | Styling | Utility-first styling for the matrix input grid and UI overlays; v4 offers significantly better performance. |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-three/drei | 10.x | Helpers | Use for OrbitControls, Labels, and standardized Axes/Gizmos. |
| Lucide React | Latest | Icons | UI icons for actions like "clear", "calculate", and "history". |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| 3D Library | Three.js | Babylon.js | Babylon is powerful but has a heavier footprint and less vibrant React ecosystem compared to R3F. |
| Math | Math.js | GPU.js | GPU.js is great for massive parallel calculations, but NxN matrix operations for typical visualization (N<20) are better handled by Math.js's CPU-based precision. |
| State | Zustand | Redux Toolkit | Redux is overkill for this scope; Zustand provides the same benefits with 10% of the boilerplate. |

## Installation

```bash
# Core Dependencies
npm install react@19 react-dom@19 three @types/three @react-three/fiber@9 mathjs zustand lucide-react

# Supporting 3D Helpers
npm install @react-three/drei

# Dev Dependencies
npm install -D typescript tailwindcss @tailwindcss/postcss postcss
```

## Sources

- [Official React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Three.js r171+ Changelog](https://github.com/mrdoob/three.js/releases)
- [Poimandres (R3F/Drei) Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Math.js v15 Release Notes](https://mathjs.org/download.html)
