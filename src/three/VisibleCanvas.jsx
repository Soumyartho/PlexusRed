import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * VisibleCanvas — a React Three Fiber <Canvas> that only runs its render loop
 * while it is inside (or near) the viewport. Offscreen canvases switch to
 * frameloop="never" so they stop consuming GPU/CPU, freeing the animation
 * frame budget that Lenis relies on for smooth scrolling.
 */
export default function VisibleCanvas({ children, rootMargin = '150px', ...props }) {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <Canvas frameloop={visible ? 'always' : 'never'} {...props}>
        {children}
      </Canvas>
    </div>
  );
}
