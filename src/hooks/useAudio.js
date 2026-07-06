import { useCallback, useRef } from 'react';

// UI feedback sound map (Kenney interface sounds).
// See PRD Section 6 — Sound Effects (SFX) Trigger System.
const SFX_MAP = {
  hover: '/models/kenney_interface-sounds/Audio/click_004.ogg',
  click: '/models/kenney_interface-sounds/Audio/select_001.ogg',
  confirm: '/models/kenney_interface-sounds/Audio/confirmation_002.ogg',
  error: '/models/kenney_interface-sounds/Audio/error_003.ogg',
  scan: '/models/kenney_interface-sounds/Audio/scroll_001.ogg',
  close: '/models/kenney_interface-sounds/Audio/close_002.ogg',
};

/**
 * useAudio — returns a `playSound(type, volume?)` callback.
 * Audio elements are lazily instantiated and cached on first use so the
 * initial document weight stays minimal (PRD §7.2).
 */
export const useAudio = () => {
  const audioCache = useRef({});

  const playSound = useCallback((type, volume = 0.3) => {
    if (typeof window === 'undefined') return;

    const src = SFX_MAP[type];
    if (!src) return;

    // Reuse audio elements to prevent garbage collection overhead.
    if (!audioCache.current[src]) {
      audioCache.current[src] = new Audio(src);
    }

    const audio = audioCache.current[src];
    audio.volume = volume;
    audio.currentTime = 0; // Reset playback
    audio.play().catch(() => {
      // Handle browser autoplay policy exceptions silently.
    });
  }, []);

  return playSound;
};

export default useAudio;
