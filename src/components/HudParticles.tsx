/*
 * ============================================================================
 * SF HUD Style Particle Component - Ultra Performance Optimized
 * ============================================================================
 */

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Correct import path for loadSlim
import type { Container, Engine, IOptions, RecursivePartial } from "@tsparticles/engine";

// ============================================================================
// ULTRA PERFORMANCE CONFIG
// ============================================================================
const CONFIG = {
  // --- General ---
  BACKGROUND_COLOR: "#0A0F1C",
  MAX_PARTICLES: 200, // Further reduced from 500
  FPS_LIMIT: 20,
  
  // --- Enable performance mode ---
  PERFORMANCE_MODE: true,
  LOW_QUALITY_MODE: true, // New setting

  // --- Color Palette (simplified) ---
  COLORS: {
    NEON_CYAN: "#73FDEA",
    NEON_LIGHT_BLUE: "#55C3FF",
    NEON_VIOLET: "#B17CFF",
    TEXT: "rgba(255, 255, 255, 0.7)",
  },

  // --- Minimal particle settings ---
  SPARKLES: {
    COUNT: 30, // Reduced from 50
    SPEED_MIN: 0.01,
    SPEED_MAX: 0.03,
    SIZE_MIN: 0.5,
    SIZE_MAX: 1.0,
  },

  // --- Core settings (simplified) ---
  CORE: {
    DIAMETER_PCT: 0.20,
    PULSE_PERIOD_S: 4.0, // Slower
    PULSE_QUANTITY: 1, // Minimal
  },

  // --- Minimal rings ---
  RINGS: {
    PARTICLE_COUNT: 8, // Drastically reduced
    ROTATION_SPEED: 0.05,
    OPACITY: 0.3,
  },

  // --- Background (minimal) ---
  STARFIELD: {
    COUNT: 50, // Reduced from 100
    SIZE: 0.4,
    SPEED: 0.005, // Very slow
  },

  // --- Motion ---
  REDUCED_MOTION_FACTOR: 0.8,
};

const HudParticles = () => {
  const [init, setInit] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Visibility toggle

  const foregroundCanvasRef = useRef<Container | null>(null);

  // Use loadSlim instead of loadFull for better performance
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine); // Much faster loading
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Visibility API to pause when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Throttled resize handler
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const updateDimensions = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 100); // Debounce resize
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(resizeTimer);
    };
  }, []);

  const motionFactor = useMemo(() => 
    (isReducedMotion ? CONFIG.REDUCED_MOTION_FACTOR : 1) * (isVisible ? 1 : 0.1)
  , [isReducedMotion, isVisible]);

  const positions = useMemo(() => {
    const { width, height } = dimensions;
    return {
      width,
      height,
      core: { x: 50, y: 50 },
    };
  }, [dimensions]);

  const particlesInit = useCallback(async (container: Container | undefined) => {
    if (!container) return;
    if (container.canvas.element?.id === "foreground") {
      foregroundCanvasRef.current = container;
    }
  }, []);

  const handleScreenshot = useCallback(() => {
    const container = foregroundCanvasRef.current;
    if (container && container.canvas.element) {
      const image = container.canvas.element.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `hud_screenshot_${Date.now()}.png`;
      link.href = image;
      link.click();
    }
  }, []);

  // Ultra-minimal shared options
  const sharedOptions: RecursivePartial<IOptions> = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: CONFIG.FPS_LIMIT,
    particles: {
      number: {
        density: {
          enable: true,
          area: 2000, // Larger area = fewer particles
        },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
        resize: false, // Disable resize events for performance
      },
    },
    detectRetina: false, // Disable for better performance
    smooth: false, // Disable smooth rendering
    pauseOnBlur: true, // Pause when window loses focus
    pauseOnOutsideViewport: true, // Pause when out of viewport
  }), []);

  // Minimal background stars only
  const backgroundOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    background: {
      color: CONFIG.BACKGROUND_COLOR,
    },
    particles: {
      number: { value: CONFIG.STARFIELD.COUNT },
      color: { value: CONFIG.COLORS.NEON_LIGHT_BLUE },
      shape: { type: "circle" },
      opacity: {
        value: 0.4,
        animation: {
          enable: true,
          speed: 0.1 * motionFactor,
          sync: false,
        },
      },
      size: { value: CONFIG.STARFIELD.SIZE },
      move: {
        enable: true,
        speed: CONFIG.STARFIELD.SPEED * motionFactor,
        direction: "none",
        random: true,
        straight: true,
        outModes: "out",
      },
    },
  }), [sharedOptions, motionFactor]);

  // Simple central pulse
  const coreOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    emitters: [{
      position: positions.core,
      rate: {
        quantity: CONFIG.CORE.PULSE_QUANTITY,
        delay: CONFIG.CORE.PULSE_PERIOD_S * motionFactor,
      },
      particles: {
        color: { value: CONFIG.COLORS.NEON_CYAN },
        size: { value: 1.5 },
        move: {
          speed: 0.2,
          direction: "outside",
          straight: false,
        },
        life: {
          duration: CONFIG.CORE.PULSE_PERIOD_S * motionFactor,
          count: 1,
        },
        opacity: {
          value: { min: 0.2, max: 0.6 },
        },
      },
    }],
  }), [sharedOptions, positions, motionFactor]);

  // Minimal ring particles
  const ringOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: { value: CONFIG.RINGS.PARTICLE_COUNT },
      color: { value: CONFIG.COLORS.NEON_LIGHT_BLUE },
      shape: { type: "circle" },
      opacity: { value: CONFIG.RINGS.OPACITY },
      size: { value: 1 },
      move: {
        enable: true,
        speed: CONFIG.RINGS.ROTATION_SPEED * motionFactor,
        direction: "none",
        random: false,
        outModes: "bounce",
      },
    },
  }), [sharedOptions, motionFactor]);

  // Minimal foreground sparkles
  const sparklesOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: { value: CONFIG.SPARKLES.COUNT },
      color: { value: [CONFIG.COLORS.NEON_CYAN, CONFIG.COLORS.NEON_VIOLET] },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.3 * motionFactor,
          sync: false,
        },
      },
      size: {
        value: { min: CONFIG.SPARKLES.SIZE_MIN, max: CONFIG.SPARKLES.SIZE_MAX },
      },
      move: {
        enable: true,
        speed: { min: CONFIG.SPARKLES.SPEED_MIN, max: CONFIG.SPARKLES.SPEED_MAX },
        direction: "none",
        random: true,
        outModes: "out",
      },
    },
  }), [sharedOptions, motionFactor]);

  if (!init) {
    return null;
  }

  const particleContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  };

  return (
    <div
      className="hud-root"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: CONFIG.BACKGROUND_COLOR,
        overflow: "hidden",
      }}
    >
      {/* Only 4 minimal layers for maximum performance */}
      <Particles id="background" style={particleContainerStyle} options={backgroundOptions} />
      {isVisible && (
        <>
          <Particles id="core" style={particleContainerStyle} options={coreOptions} />
          <Particles id="ring" style={particleContainerStyle} options={ringOptions} />
          <Particles 
            id="foreground" 
            style={particleContainerStyle} 
            init={particlesInit}
            options={sparklesOptions} 
          />
        </>
      )}

      {/* Ultra-simplified HTML overlay */}
      <div
        className="hud-overlay"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontFamily: "'Roboto Mono', 'monospace'",
          color: CONFIG.COLORS.TEXT,
        }}
      >
        {/* Simple central crosshair - static HTML only */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${positions.width * CONFIG.CORE.DIAMETER_PCT}px`,
          height: `${positions.width * CONFIG.CORE.DIAMETER_PCT}px`,
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(85, 195, 255, 0.2)',
          borderRadius: '50%',
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            width: '100%', 
            height: '1px', 
            background: 'rgba(85, 195, 255, 0.2)', 
            transform: 'translateY(-50%)' 
          }} />
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            top: 0, 
            height: '100%', 
            width: '1px', 
            background: 'rgba(85, 195, 255, 0.2)', 
            transform: 'translateX(-50%)' 
          }} />
        </div>

        {/* Minimal status text */}
        <div style={{ 
          position: 'absolute', 
          top: '2%', 
          left: '2%', 
          padding: '6px', 
          background: `${CONFIG.BACKGROUND_COLOR}cc`,
          fontSize: '11px',
        }}>
          PERFORMANCE MODE: ACTIVE
        </div>

        {/* Bottom-Right Text */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2%', 
          right: '2%', 
          fontSize: '14px', 
          letterSpacing: '1px' 
        }}>
          GALAX 監視中
        </div>

        {/* Screenshot Button */}
        <button
          onClick={handleScreenshot}
          style={{
            position: 'absolute',
            bottom: '2%',
            left: '2%',
            pointerEvents: 'all',
            padding: '6px 10px',
            fontFamily: "'Roboto Mono', 'monospace'",
            background: 'rgba(10, 15, 28, 0.8)',
            border: `1px solid ${CONFIG.COLORS.NEON_LIGHT_BLUE}`,
            color: CONFIG.COLORS.NEON_LIGHT_BLUE,
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          SAVE PNG
        </button>
      </div>
    </div>
  );
};

export default HudParticles;
