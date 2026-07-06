# PlexusRed - Landing Page PRD & Integration Plan (V5-Ready)

This document serves as the comprehensive **Product Requirement Document (PRD)** and **Technical Integration Blueprint** for the PlexusRed landing page. It contains all the directory paths, library configurations, Draco decoder paths, audio mapping hooks, and file assemblies required for **Claude Fable 5** to autonomously generate and compile the landing page.

---

## 1. Executive Summary & Page Goals

PlexusRed is a modern cybersecurity platform focused on continuous autonomous threat emulation, penetration testing, and target security scoring. The landing page must feel state-of-the-art, drawing inspiration from high-tech console interfaces, cybernetic grids, and reactive animations.

### Core Conversion Goals
1. **Request Emulation Access**: Lead-generation for security directors and CISOs.
2. **Launch On-Demand Scan**: An interactive dashboard simulator allowing users to enter a target domain and run a mock scanner to visualize vulnerability outputs.
3. **Portal Portal Entrance**: Authentication gateway for existing clients.

---

## 2. Technical Stack & Configuration Files

To merge both the **React components** (`BG_Grid`, `ModernHero`, `med_card.react`) and **HTML/CSS components** (`Navbar`, `Footer`, `Loaders`, `Buttons`, `Input`, `Cards`), the following configuration must be set up.

### 2.1 Dependencies Installation
```bash
npm install three @types/three @react-three/fiber @react-three/drei framer-motion @studio-freight/lenis react-icons @xyflow/react d3
```
*Note: `@xyflow/react` is the modern package for React Flow, and `d3` is utilized for force-directed attack path layout generation.*

### 2.2 Security Compliance Pinned Versions
To prevent severe code execution vulnerabilities (such as CVE-2026-29089), all backend and deployment containers must adhere to:
* **TimescaleDB**: Version strictly pinned to **`>= 2.25.2`** (mitigates untrusted search path vulnerability in extension upgrades).

### 2.3 Vite Configuration (`vite.config.js`)
Ensure Vite serves static assets correctly from the `public` directory:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
  },
});
```

### 2.4 Tailwind Configuration (`tailwind.config.js`)
Configure `tailwind.config.js` exactly as follows:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/UI_Components/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFDE42",      // Bright Yellow / Gold
        secondary: "#4C5C2D",    // Muted Olive Green
        tertiary: "#313E17",     // Dark Forest Green
        background: "#1B0C0C",   // Deep Dark Espresso / Near Black
      },
      fontFamily: {
        headings: ["'Array-Regular'", "sans-serif"],
        body: ["'Sentient-Medium'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

### 2.5 CSS Variable Bridge (`src/index.css`)
Ensure global variables match the theme configuration:
```css
@import "../public/design/theme/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: var(--color-background);
  color: #e4e4e4;
  font-family: var(--font-body), sans-serif;
  overflow-x: hidden;
  margin: 0;
}
```

---

## 3. Directory & Asset Audit Map

All assets are located in the public/ workspace directory. Below is the mapping of where they are and where they will be loaded:

| Asset Category | File / Folder | Purpose in Landing Page |
| :--- | :--- | :--- |
| **HDR Environmental Maps** | satara_night_1k.hdr | Provides realistic, moody environmental lighting and reflection maps for the main WebGL 3D canvas (Space/Cyber-Drone). |
| **HDR Reflection Maps** | studio_small_08_1k.hdr | Loaded in the product showcase section for realistic metallic/gloss reflections on the Mecha Warrior model. |
| **Optimized 3D Models** | bot_mecha_warrior_3d_by_oscar_creativo.glb (3.49MB) | Displayed in the central product showcase section (interactive rotating mesh responding to scroll progress). |
| **Optimized 3D Models** | d.s.e.v._drone.glb (1.80MB) | Appears as a floating asset in the "Platform Emulation" section, rotating dynamically. |
| **Optimized 3D Models** | sci-_fi_surveillance_drone.glb (763KB) | Renders in the "Target Intelligence Scanner" view, scanning targets with laser projections. |
| **Modular Assets** | `GLB1`, `GLB2`, `GLB3`, `GLB4` folders | Low-poly assets (primitives, pipes, panels, walls, structures) loaded dynamically to construct a custom WebGL terminal background or loading overlay scene. |
| **WebP Texture Maps** | `public/textures/` folder (32 `.webp` files) | Mapped as PBR materials (Normal, Metalness, Roughness, Opacity) on the 3D meshes. |
| **UI Audio (Sound Effects)** | `public/models/kenney_interface-sounds/Audio/` | Playback triggers for hover states, confirmation clicks, errors, and authentication scans. |
| **Background Videos** | Hero_video.mp4 | Masked parallax video loop playing inside the center-fold scroll-reveal block. |
| **Background Videos** | 0101_v2.mp4 | Blended binary rain video playing at the bottom of the page in the footer background. |
| **Branding Videos** | Text_bg.mp4 | Blended text video loop playing behind the main giant logo in the middle banner. |

---

## 4. UI Component Conversion & React Placement

For Fable 5 to build the React application, organize components under `/src/components/` following these exact structure mappings:

### 4.1 Sticky Navigation Header (`src/components/Navbar/Navbar.jsx`)
* **Source Files**: HTML navbar.html, CSS navbar.css
* **Implementation Details**:
  * Copy `navbar.css` content into `src/components/Navbar/Navbar.css` and import it inside `Navbar.jsx`.
  * Translate the HTML markup to JSX. Use React Router `Link` tags or standard scroll anchors.
  * Use the logo-icon structures (`logo-icon span`) which render the gold logo mark.

### 4.2 Background Grid Canvas (`src/components/BGGrid/BGGrid.jsx`)
* **Source Files**: React TSX BG_Grid/Component.tsx
* **Implementation Details**:
  * Rename to `BGGrid.jsx`. Install `@react-three/fiber` and `@react-three/drei`.
  * Position set to `fixed`, covering `100vw` and `100vh` at `z-index: -1` with `pointer-events: none` so that cursor coordinates pass to Three.js but scroll events pass to HTML underneath.

### 4.3 Modern Hero Parallax Fold (`src/components/ModernHero/ModernHero.jsx`)
* **Source Files**: React TSX ModernHero/Component.tsx
* **Implementation Details**:
  * Ensure the video source points to `/videos/Hero_video.mp4`.
  * Confirm that Framer Motion `scrollY` hooks animate the polygon mask clip-path successfully.
  * Import the `FiShield` and `FiMapPin` icons from `react-icons/fi`.

### 4.4 Dashboard Simulator & Interactive Input (`src/components/Scanner/Scanner.jsx`)
* **Source Files**: HTML search.html, CSS search.css, Button HTML button.html, Button CSS button.css
* **Implementation Details**:
  * Merge input search and glitch button into a single interactive block.
  * When `// Scan target` is clicked, trigger a simulated progress scanner. Integrate `sci-_fi_surveillance_drone.glb` loaded in a mini-viewport alongside scanning logs.

### 4.5 React Flow Attack Path & Threat Theater
To represent findings not as isolated alerts but as visual attack chains (as per PDF Section UX/Architecture):
* **Component File**: `/src/components/AttackPath/AttackPath.jsx`
* **Implementation**:
  * Uses React Flow (`@xyflow/react`) to construct node-based attack path layouts.
  * Custom node designs representing target vulnerabilities: `"Exposed RDS Database"`, `"Stolen JWT Token"`, `"Active Directory Misconfig"`.
  * Nodes connected by stylized curve edges utilizing CatmullRomCurve3 parameters.
  * Interactive clicking on a node slides open a side drawer containing: **Raw HTTP Request**, **Interactsh OOB Proof**, and **LLM Remediation Advice**.

### 4.6 High-Tech Video Middle Banner (`src/components/BrandingBanner/BrandingBanner.jsx`)
* **Background Video**: Loop `/videos/Text_bg.mp4` on autoplay/muted/playsInline.
* **Branding Foreground**: Displays a giant centered `"PLEXUS RED"` logo in `'Array-Regular', sans-serif` (`var(--font-headings)`) with gold colors (`#FFDE42`) and a glowing text-shadow.

### 4.7 Statistics Grid & 3D Tilt Cards (`src/components/Reports/Reports.jsx`)
* **Source Files**: HTML mini_card.html / mini_card.css, 3D Card HTML modal1.html / modal1.css
* **Implementation Details**:
  * Align the `mini_card` metrics (e.g., "Threats Blocked: 12,480", "Active Scans: 89/100") inside a Flex grid.
  * Mount two instances of the `modal1` 3D tilt card (titled "Pentest Report: JULY 06" and "Vulnerability Audit: JUNE 29").
  * Use CSS 3D perspective transforms to create the hover tilt behavior.

### 4.8 Pricing Tiers (`src/components/Pricing/Pricing.jsx`)
* **Source Files**: React file Cards/med_card.react
* **Implementation Details**:
  * Set up three subscription plans strictly mapped to the competitive matrix in the PDF:
    1. **Essential Tier** (~$1,200/year): Weekly autonomous scans, standard React Flow reporting, basic compliance tracking. Target audience: Series A SaaS, Lean DevSecOps.
    2. **Professional Tier** (~$300/month/app): Continuous scans, zero-false-positive Out-of-Band (OOB) validation, deep API integrations (Jira, Slack, SARIF exports). Target audience: Mid-market SaaS, FinTech, HealthTech.
    3. **Enterprise Tier** (Custom Quoted): Full Swarm access, R3F Threat Theater (3D particle topology scene), 180-day compliance logs, dedicated Human-in-the-Loop (HITL) approval panels. Target audience: Large Enterprises.

### 4.9 High-Tech Video Footer (`src/components/Footer/Footer.jsx`)
* **Source Files**: HTML footer.html, CSS footer.css
* **Implementation Details**:
  * Ensure the video source points to `/videos/0101_v2.mp4`.
  * Ensure that the `.video-overlay` gradient mask properties are defined exactly to avoid contrast issues with sitemap text overlays.

---

## 5. WebGL 3D Model & HDRI Rendering Blueprint

To render the 3D models with proper PBR material attributes and reflection maps, Fable 5 must configure the R3F Canvas according to these specifications.

### 5.1 Local Draco Decoder Setup
Since the models (`bot_mecha_warrior`) are optimized with Draco compression, Fable 5 must copy Draco decoder binaries from `node_modules/three/examples/jsm/libs/draco` to the `public/draco/` folder, and configure the loader:
```javascript
import { useGLTF } from '@react-three/drei';

// Configure the GLTF loader decoder path globally:
useGLTF.setDecoderPath('/draco/');
```

### 5.2 Product Showcase Component (`src/components/WebGLShowcase.jsx`)
Renders the `bot_mecha_warrior_3d_by_oscar_creativo.glb` model with metal plates mapping:
```jsx
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, useTexture } from '@react-three/drei';

useGLTF.setDecoderPath('/draco/');

const MechaMesh = () => {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('/models/bot_mecha_warrior_3d_by_oscar_creativo.glb');
  
  // Load optimized WebP texture maps
  const textureMap = useTexture({
    roughness: '/textures/MetalPlates005_1K-JPG_Roughness.webp',
    normal: '/textures/MetalPlates005_1K-JPG_NormalGL.webp',
    metalness: '/textures/MetalPlates005_1K-JPG_Metalness.webp',
  });

  // Apply PBR texture parameters
  React.useLayoutEffect(() => {
    if (materials.ArmorPlate) {
      materials.ArmorPlate.roughnessMap = textureMap.roughness;
      materials.ArmorPlate.normalMap = textureMap.normal;
      materials.ArmorPlate.metalnessMap = textureMap.metalness;
      materials.ArmorPlate.roughness = 0.45;
      materials.ArmorPlate.metalness = 0.95;
    }
  }, [materials, textureMap]);

  // Rotate on scroll
  useFrame(() => {
    if (meshRef.current) {
      const scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      meshRef.current.rotation.y = scrollPercent * Math.PI * 2;
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={nodes.Scene} 
      scale={2.2} 
      position={[0, -1.5, 0]} 
    />
  );
};

export const WebGLShowcase = () => {
  return (
    <div className="h-[600px] w-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <MechaMesh />
          {/* Loaded environmental lighting reflection */}
          <Environment files="/hdri/studio_small_08_1k.hdr" />
        </Suspense>
      </Canvas>
    </div>
  );
};
```

---

## 6. Sound Effects (SFX) Trigger System

Create a custom React Hook (`src/hooks/useAudio.js`) to handle UI feedback loops:

```javascript
import { useCallback, useRef } from 'react';

const SFX_MAP = {
  hover: '/models/kenney_interface-sounds/Audio/click_004.ogg',
  click: '/models/kenney_interface-sounds/Audio/select_001.ogg',
  confirm: '/models/kenney_interface-sounds/Audio/confirmation_002.ogg',
  error: '/models/kenney_interface-sounds/Audio/error_003.ogg',
  scan: '/models/kenney_interface-sounds/Audio/scroll_001.ogg',
  close: '/models/kenney_interface-sounds/Audio/close_002.ogg'
};

export const useAudio = () => {
  const audioCache = useRef({});

  const playSound = useCallback((type, volume = 0.3) => {
    const src = SFX_MAP[type];
    if (!src) return;

    // Reuse audio elements to prevent garbage collection overhead
    if (!audioCache.current[src]) {
      audioCache.current[src] = new Audio(src);
    }

    const audio = audioCache.current[src];
    audio.volume = volume;
    audio.currentTime = 0; // Reset playback
    audio.play().catch(() => {
      // Handle browser autoplay policy exceptions silently
    });
  }, []);

  return playSound;
};
```

---

## 7. Performance & Optimization Checklist

Ensure the final build meets the following production performance standards:

1. **Static Pre-fetching**: Add `<link rel="prefetch" href="/videos/Hero_video.mp4">` to `index.html` within the pre-loader.
2. **Audio Preload**: All audio tags inside `useAudio` should dynamically instantiate only when needed to maintain initial document weight.
3. **Draco Local Path**: The Draco decoder binaries must reside on the same server at `/draco/` to avoid remote CDN roundtrip latencies during WebGL startup.
4. **Target Metrics**:
   * Initial page weight (HTML/CSS/JS bundle): **< 1.8 MB**
   * Total media assets (Drones, Mecha, HDRI): **< 8.0 MB**
   * Time to Interactive (TTI): **< 1.2s**
