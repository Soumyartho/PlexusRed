import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * BGGrid — cybernetic fragment-shader grid.
 * Fixed, full-viewport, z-index -1, pointer-events:none so the cursor
 * position still feeds the shader warp while scroll/clicks pass through to
 * the HTML underneath (PRD §4.2).
 */
export default function BGGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Background shader: cap at 1x pixel ratio — it's a full-screen fragment
    // shader, so rendering at native HiDPI is wasted frame budget that starves
    // the scroll animation loop.
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;

        float t         = iTime * 0.2;
        float mouseDist = length(uv - mouse);

        // warp effect around mouse
        float warp = sin(mouseDist * 20.0 - t * 4.0) * 0.1;
        warp *= smoothstep(0.4, 0.0, mouseDist);
        uv += warp;

        // grid lines
        vec2 gridUv = abs(fract(uv * 10.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 50.0);

        // base grid color pulsing (deep crimson)
        vec3 gridColor = vec3(0.7, 0.05, 0.05);
        vec3 color     = gridColor * line * (0.5 + sin(t * 2.0) * 0.2);

        // energetic gold pulses along grid
        float energy = sin(uv.x * 20.0 + t * 5.0) * sin(uv.y * 20.0 + t * 3.0);
        energy = smoothstep(0.8, 1.0, energy);
        color += vec3(1.0, 0.87, 0.26) * energy * line;

        // glow around mouse
        float glow = smoothstep(0.1, 0.0, mouseDist);
        color += vec3(1.0, 0.9, 0.6) * glow * 0.5;

        // subtle noise
        color += random(uv + t * 0.1) * 0.05;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: {
        value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
      },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener('resize', onResize);
    onResize();

    const onMouseMove = (e) => {
      uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);

    renderer.setAnimationLoop(() => {
      if (document.hidden) return; // don't burn frames on a hidden tab
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="shader-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.55,
      }}
      aria-hidden="true"
    />
  );
}
