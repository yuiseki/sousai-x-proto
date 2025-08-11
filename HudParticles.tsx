/*
 * ============================================================================
 * SF HUD Style Particle Component for React
 * ============================================================================
 *
 * # Installation:
 * npm i react react-dom react-tsparticles tsparticles @tsparticles/engine @tsparticles/react
 *
 * # Note on @tsparticles/react:
 * The package `react-tsparticles` is now `@tsparticles/react`.
 * For `loadFull`, you need `@tsparticles/engine`.
 *
 * Command:
 * npm i @tsparticles/react @tsparticles/engine tsparticles
 *
 * This component generates a multi-layered sci-fi HUD visual using only
 * react-tsparticles and its engine, without any external images or shaders.
 * It is fully responsive and designed for performance.
 *
 */

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Container, Engine, IOptions, RecursivePartial } from "@tsparticles/engine";

// ============================================================================
// CONFIGURATION OBJECT
// Centralized control for all visual parameters.
// ============================================================================
const CONFIG = {
  // --- General ---
  BACKGROUND_COLOR: "#0A0F1C", // Deep space blue
  MAX_PARTICLES: 12000, // Hard limit for total particles
  FPS_LIMIT: 60, // Target FPS

  // --- Color Palette ---
  COLORS: {
    NEON_CYAN: "#73FDEA",
    NEON_LIGHT_BLUE: "#55C3FF",
    NEON_VIOLET: "#B17CFF",
    NEON_MAGENTA: "#FF7BD5",
    NEON_AMBER: "#FFE083",
    TEXT: "rgba(255, 255, 255, 0.7)",
    RED_PULSE: "#FF4444",
  },

  // --- Foreground Sparkles (Layer 1) ---
  SPARKLES: {
    COUNT: 400, // Average number of sparkles
    SPEED_MIN: 0.05,
    SPEED_MAX: 0.15,
    SIZE_MIN: 0.5,
    SIZE_MAX: 1.8,
  },

  // --- Central Core & Rings (Layer 2) ---
  CORE: {
    DIAMETER_PCT: 0.23, // Core diameter as a percentage of screen width
    PULSE_PERIOD_S: 2.0, // Pulse cycle time in seconds
    PULSE_QUANTITY: 5, // Particles per pulse
  },
  RINGS: {
    // Ring 1 (Solid)
    RING1_ROTATION_SPEED: 0.5,
    RING1_THICKNESS: 1.5,
    // Ring 2 (Dashed)
    RING2_ROTATION_SPEED: -0.4,
    RING2_OPACITY_MIN: 0.3,
    RING2_OPACITY_MAX: 0.5,
    RING2_PARTICLE_COUNT: 40, // Number of "dashes"
    // Ring 3 (Thin)
    RING3_ROTATION_SPEED: 1.2,
    RING3_THICKNESS: 0.5,
  },

  // --- Data Beams (Layer 3) ---
  BEAMS: {
    SPEED_MIN: 0.7,
    SPEED_MAX: 1.2,
    SIZE_MIN: 1,
    SIZE_MAX: 2,
    TRAIL_LENGTH: 5,
    PULSE_DELAY_MS: 100, // Delay between beam pulses
  },

  // --- Peripheral Spheres (Layer 4) ---
  SPHERES: {
    DIAMETER_PCT_SHORT_SIDE: 0.18, // Diameter as % of the shorter screen dimension
    // Top-Left: Network Graph
    NETWORK_NODES: 80,
    NETWORK_LINK_DISTANCE_PCT: 0.45, // Link distance as % of sphere diameter
    NETWORK_ROTATION_SPEED: 0.005,
    // Top-Right: Radar
    RADAR_PULSE_PERIOD_S: 2.0,
    // Bottom-Left: Data Streaks
    STREAK_COUNT: 15,
    STREAK_SPEED: 15,
    // Bottom-Right: Geometric Pattern
    GEO_NODES: 40,
    GEO_TRIANGLE_OPACITY: 0.15,
  },

  // --- Background Starfield & Scanlines (Layer 5) ---
  STARFIELD: {
    COUNT: 1000,
    SIZE_MIN: 0.3,
    SIZE_MAX: 0.8,
    SPEED: 0.05,
  },
  SCANLINES: {
    COUNT: 300, // Number of lines, adjusted by density
    SPEED: 0.02,
    THICKNESS: 1.5,
    OPACITY: 0.05,
  },

  // --- Motion ---
  REDUCED_MOTION_FACTOR: 0.2, // Speed multiplier when reduced motion is enabled
};

// ============================================================================
// The Main Component
// ============================================================================
const HudParticles = () => {
  const [init, setInit] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Ref for the top-level canvas to enable screenshot functionality
  const foregroundCanvasRef = useRef<Container | null>(null);

  // Initialize tsparticles engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Handle window resize and reduced motion preference
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const queryListener = (event: MediaQueryListEvent) => setIsReducedMotion(event.matches);

    window.addEventListener("resize", updateDimensions);
    mediaQuery.addEventListener("change", queryListener);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
      mediaQuery.removeEventListener("change", queryListener);
    };
  }, []);

  const motionFactor = useMemo(() => (isReducedMotion ? CONFIG.REDUCED_MOTION_FACTOR : 1), [isReducedMotion]);

  // Calculate dynamic positions for elements based on screen size
  const positions = useMemo(() => {
    const { width, height } = dimensions;
    const shortSide = Math.min(width, height);
    const sphereDiameter = shortSide * CONFIG.SPHERES.DIAMETER_PCT_SHORT_SIDE;

    return {
      width,
      height,
      shortSide,
      sphereDiameter,
      core: { x: 50, y: 50 },
      tl: { x: 18, y: 18 },
      tr: { x: 82, y: 18 },
      bl: { x: 18, y: 78 },
      br: { x: 82, y: 78 },
    };
  }, [dimensions]);

  const particlesInit = useCallback(async (container: Container | undefined) => {
    if (!container) return;
    if (container.canvas.element?.id === "tsparticles1") {
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
    } else {
      alert("Could not capture screenshot. The foreground canvas is not ready.");
    }
  }, []);

  // Memoize options for each particle layer to prevent re-renders
  const sharedOptions: RecursivePartial<IOptions> = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: CONFIG.FPS_LIMIT,
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
        resize: true,
      },
    },
    particles: {
      number: {
        density: {
          enable: true,
          area: 800,
        },
      },
    },
    detectRetina: true,
  }), []);

  // --- Layer 5: Background Starfield ---
  const starfieldOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    background: {
      color: CONFIG.BACKGROUND_COLOR,
    },
    particles: {
      number: { value: CONFIG.STARFIELD.COUNT },
      color: { value: CONFIG.COLORS.NEON_LIGHT_BLUE },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.1, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.5 * motionFactor,
          sync: false,
        },
      },
      size: {
        value: { min: CONFIG.STARFIELD.SIZE_MIN, max: CONFIG.STARFIELD.SIZE_MAX },
      },
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

  // --- Layer 5: Scanlines ---
  const scanlinesOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: {
        value: CONFIG.SCANLINES.COUNT,
        density: { enable: true, area: 1200 }
      },
      color: { value: CONFIG.COLORS.NEON_CYAN },
      shape: { type: "line" },
      opacity: { value: CONFIG.SCANLINES.OPACITY },
      size: {
        value: { min: dimensions.width, max: dimensions.width },
      },
      move: {
        enable: true,
        speed: CONFIG.SCANLINES.SPEED * motionFactor,
        direction: "top",
        straight: true,
        outModes: {
          default: "out",
          top: "in",
        },
      },
    },
  }), [sharedOptions, motionFactor, dimensions.width]);

  // --- Layer 4: Peripheral Spheres ---
  const createSphereOptions = (
    position: { x: number; y: number },
    particleOptions: RecursivePartial<IOptions["particles"]>
  ): RecursivePartial<IOptions> => ({
    ...sharedOptions,
    particles: {
      ...particleOptions,
      move: {
        ...particleOptions.move,
        attract: {
          enable: true,
          rotate: {
            x: 600,
            y: 1200,
          },
          ...(particleOptions.move?.attract || {}),
        },
      },
    },
    polygon: {
      enable: true,
      type: "inline",
      move: {
        radius: 10,
        type: "path",
      },
      scale: 1,
      url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${positions.sphereDiameter}' height='${positions.sphereDiameter}'><circle cx='${positions.sphereDiameter/2}' cy='${positions.sphereDiameter/2}' r='${positions.sphereDiameter/2}'/></svg>`,
      position: {
        x: position.x,
        y: position.y,
      },
    },
  });

  // TL: Network Graph
  const networkSphereOptions: RecursivePartial<IOptions> = useMemo(() => createSphereOptions(positions.tl, {
    number: { value: CONFIG.SPHERES.NETWORK_NODES },
    color: { value: CONFIG.COLORS.NEON_CYAN },
    size: { value: { min: 1, max: 2.5 } },
    links: {
      enable: true,
      color: CONFIG.COLORS.NEON_CYAN,
      distance: positions.sphereDiameter * CONFIG.SPHERES.NETWORK_LINK_DISTANCE_PCT,
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.3 * motionFactor,
      direction: "none",
      random: true,
      outModes: "bounce",
      attract: {
          enable: true,
          rotate: { x: 50, y: 50 }
      }
    },
  }), [sharedOptions, positions, motionFactor]);

  // TR: Radar/Geo-like
  const radarSphereOptions: RecursivePartial<IOptions> = useMemo(() => createSphereOptions(positions.tr, {
    number: { value: 150 },
    color: { value: CONFIG.COLORS.NEON_AMBER },
    size: { value: { min: 0.5, max: 1.5 } },
    move: {
      enable: true,
      speed: 0.2 * motionFactor,
      direction: "none",
      random: true,
      outModes: "bounce",
      attract: {
          enable: true,
          rotate: { x: 200, y: 200 }
      }
    },
  }), [sharedOptions, positions, motionFactor]);

  // Emitter for the red pulse in the radar
  const radarEmitterOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    emitters: [{
      position: { x: positions.tr.x, y: positions.tr.y },
      rate: {
        quantity: 1,
        delay: CONFIG.SPHERES.RADAR_PULSE_PERIOD_S * motionFactor,
      },
      particles: {
        color: { value: CONFIG.COLORS.RED_PULSE },
        size: { value: 5 },
        life: {
          duration: 0.5,
          count: 1,
        },
        move: {
          enable: false,
        },
        opacity: {
          value: { min: 0, max: 1 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
            destroy: "max",
            startValue: "max"
          }
        }
      }
    }]
  }), [sharedOptions, positions.tr, motionFactor]);

  // BL: Data Streaks
  const dataStreaksOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: { value: CONFIG.SPHERES.STREAK_COUNT },
      color: { value: CONFIG.COLORS.NEON_MAGENTA },
      shape: { type: "square" },
      size: {
        value: { min: 1, max: 3 },
        width: { min: 10, max: 20 },
        height: 1,
      },
      move: {
        enable: true,
        speed: { min: CONFIG.SPHERES.STREAK_SPEED * 0.8, max: CONFIG.SPHERES.STREAK_SPEED },
        direction: "right",
        straight: true,
        outModes: {
          left: "out",
          right: "out",
          top: "destroy",
          bottom: "destroy"
        },
      },
      shadow: {
        enable: true,
        blur: 5,
        color: CONFIG.COLORS.NEON_MAGENTA,
      },
    },
    polygon: {
      enable: true,
      type: "inline",
      draw: {
        enable: false,
      },
      scale: 1,
      url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${positions.sphereDiameter}' height='${positions.sphereDiameter}'><rect width='${positions.sphereDiameter}' height='${positions.sphereDiameter}'/></svg>`,
      position: {
        x: positions.bl.x,
        y: positions.bl.y,
      },
    }
  }), [sharedOptions, positions, motionFactor]);

  // BR: Geometric Pattern
  const geoSphereOptions: RecursivePartial<IOptions> = useMemo(() => createSphereOptions(positions.br, {
    number: { value: CONFIG.SPHERES.GEO_NODES },
    color: { value: CONFIG.COLORS.NEON_VIOLET },
    size: { value: { min: 1, max: 3 } },
    links: {
      enable: true,
      color: CONFIG.COLORS.NEON_VIOLET,
      distance: 100,
      opacity: 0.6,
      width: 1,
      triangles: {
        enable: true,
        color: CONFIG.COLORS.NEON_VIOLET,
        opacity: CONFIG.SPHERES.GEO_TRIANGLE_OPACITY,
      },
    },
    move: {
      enable: true,
      speed: 0.2 * motionFactor,
      direction: "none",
      random: true,
      outModes: "bounce",
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: { enable: true, speed: 0.5 * motionFactor, sync: false },
    },
  }), [sharedOptions, positions, motionFactor]);

  // --- Layer 3: Data Beams ---
  const createBeamEmitters = (from: {x:number, y:number}, to: {x:number, y:number}) => ({
    position: from,
    direction: Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI,
    rate: {
      quantity: 1,
      delay: CONFIG.BEAMS.PULSE_DELAY_MS / 1000 * motionFactor,
    },
    size: {
      width: 1,
      height: 1,
      mode: "percent"
    },
    particles: {
      color: {
        value: [CONFIG.COLORS.NEON_CYAN, CONFIG.COLORS.NEON_MAGENTA],
        animation: {
          h: {
            enable: true,
            speed: 60 * motionFactor,
            sync: false,
          },
        },
      },
      size: {
        value: { min: CONFIG.BEAMS.SIZE_MIN, max: CONFIG.BEAMS.SIZE_MAX },
      },
      move: {
        speed: { min: CONFIG.BEAMS.SPEED_MIN, max: CONFIG.BEAMS.SPEED_MAX },
        straight: false,
        path: {
          enable: true,
          delay: { value: 0 },
          options: {
            sides: 2,
            turnSteps: 10,
            angle: 15,
          },
        },
        trail: {
          enable: true,
          fill: { color: CONFIG.BACKGROUND_COLOR },
          length: CONFIG.BEAMS.TRAIL_LENGTH,
        },
      },
      life: {
        duration: 2,
        count: 1,
      },
    },
  });

  const beamOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    emitters: [
      createBeamEmitters(positions.core, positions.tl),
      createBeamEmitters(positions.core, positions.tr),
      createBeamEmitters(positions.core, positions.bl),
      createBeamEmitters(positions.core, positions.br),
    ],
  }), [sharedOptions, positions, motionFactor]);

  // --- Layer 2: Central Core and Rings ---
  const coreAndRingsOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    absorbers: [{
      position: positions.core,
      size: {
        value: (positions.width * CONFIG.CORE.DIAMETER_PCT) / 4, // Absorber radius
        limit: (positions.width * CONFIG.CORE.DIAMETER_PCT) / 3,
      },
      opacity: 0,
    }],
    emitters: [{
      position: positions.core,
      rate: {
        quantity: CONFIG.CORE.PULSE_QUANTITY,
        delay: CONFIG.CORE.PULSE_PERIOD_S / 2 * motionFactor,
      },
      particles: {
        color: { value: CONFIG.COLORS.NEON_LIGHT_BLUE },
        size: { value: { min: 1, max: 2 } },
        move: {
          speed: 0.5,
          direction: "outside",
          straight: false,
        },
        life: {
          duration: CONFIG.CORE.PULSE_PERIOD_S * motionFactor,
          count: 1,
        },
      },
    }],
    particles: {
      number: { value: 0 }, // Particles are generated by polygons and emitters
    },
    polygon: [
      // Ring 1: Solid, slow rotate
      {
        enable: true,
        type: "inline",
        draw: {
          enable: true,
          stroke: {
            width: CONFIG.RINGS.RING1_THICKNESS,
            color: CONFIG.COLORS.NEON_LIGHT_BLUE,
          },
        },
        position: positions.core,
        scale: 1,
        sides: 80,
        move: {
          radius: (positions.width * CONFIG.CORE.DIAMETER_PCT) / 2,
          type: "path",
        },
      },
      // Ring 3: Thin, fast rotate
      {
        enable: true,
        type: "inline",
        draw: {
          enable: true,
          stroke: {
            width: CONFIG.RINGS.RING3_THICKNESS,
            color: CONFIG.COLORS.NEON_AMBER,
          },
        },
        position: positions.core,
        scale: 1.15,
        sides: 80,
        move: {
          radius: (positions.width * CONFIG.CORE.DIAMETER_PCT) / 2,
          type: "path",
        },
      },
    ],
    // These particles form the rings themselves
    // Using this technique for rotation control
    // Ring 1
    "interactivity.modes.trail.particles.0": {
        move: { angle: { value: 360, offset: 0 }, speed: CONFIG.RINGS.RING1_ROTATION_SPEED * motionFactor }
    },
    // Ring 3
    "interactivity.modes.trail.particles.1": {
        move: { angle: { value: 360, offset: 0 }, speed: CONFIG.RINGS.RING3_ROTATION_SPEED * motionFactor * 2 }
    },
  }), [sharedOptions, positions, motionFactor]);

  // Dashed Ring (Layer 2.5) - implemented with particles for opacity control
  const dashedRingOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: { value: CONFIG.RINGS.RING2_PARTICLE_COUNT },
      color: { value: CONFIG.COLORS.NEON_LIGHT_BLUE },
      shape: { type: "circle" },
      opacity: {
        value: { min: CONFIG.RINGS.RING2_OPACITY_MIN, max: CONFIG.RINGS.RING2_OPACITY_MAX }
      },
      size: { value: 2 },
      move: {
        enable: true,
        speed: 0, // speed is controlled by rotation
        direction: 0,
        random: false,
        straight: false,
        outModes: "destroy",
        attract: {
          enable: true,
          rotate: { x: 0, y: 0 },
        },
        orbit: {
          enable: true,
          animation: {
            enable: true,
            speed: CONFIG.RINGS.RING2_ROTATION_SPEED * motionFactor,
            sync: false,
          },
          radius: (positions.width * CONFIG.CORE.DIAMETER_PCT) / 2 * 1.07,
          rotation: {
            value: 0
          },
          opacity: 1
        }
      },
      position: positions.core,
    }
  }), [sharedOptions, positions, motionFactor]);

  // --- Layer 1: Foreground Sparkles ---
  const foregroundSparklesOptions: RecursivePartial<IOptions> = useMemo(() => ({
    ...sharedOptions,
    particles: {
      number: { value: CONFIG.SPARKLES.COUNT },
      color: { value: Object.values(CONFIG.COLORS) },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 1.5 * motionFactor,
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
        straight: false,
        outModes: "out",
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
        },
      },
      shadow: {
        enable: true,
        blur: 5,
        color: "rgba(128,128,255,0.5)",
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
      {/* --- Layers (z-index managed by render order) --- */}
      <Particles id="starfield" style={particleContainerStyle} options={starfieldOptions} />
      <Particles id="scanlines" style={particleContainerStyle} options={scanlinesOptions} />

      <Particles id="networkSphere" style={particleContainerStyle} options={networkSphereOptions} />
      <Particles id="radarSphere" style={particleContainerStyle} options={radarSphereOptions} />
      <Particles id="radarEmitter" style={particleContainerStyle} options={radarEmitterOptions} />
      <Particles id="dataStreaks" style={particleContainerStyle} options={dataStreaksOptions} />
      <Particles id="geoSphere" style={particleContainerStyle} options={geoSphereOptions} />

      <Particles id="beams" style={particleContainerStyle} options={beamOptions} />
      <Particles id="coreRings" style={particleContainerStyle} options={coreAndRingsOptions} />
      <Particles id="dashedRing" style={particleContainerStyle} options={dashedRingOptions} />

      <Particles id="foreground" style={particleContainerStyle} container={foregroundCanvasRef as any} options={foregroundSparklesOptions} />

      {/* --- HTML Overlays --- */}
      <div
        className="hud-overlay"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontFamily: "'Orbitron', 'Roboto Mono', 'monospace'",
          color: CONFIG.COLORS.TEXT,
        }}
      >
        {/* Top-Right Radar Crosshair */}
        <div style={{
          position: 'absolute',
          left: `${positions.tr.x}%`,
          top: `${positions.tr.y}%`,
          width: `${positions.sphereDiameter}px`,
          height: `${positions.sphereDiameter}px`,
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(85, 195, 255, 0.2)',
          borderRadius: '50%',
        }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(85, 195, 255, 0.2)', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '1px', background: 'rgba(85, 195, 255, 0.2)', transform: 'translateX(-50%)' }} />
        </div>

        {/* Top-Left Label */}
        <div style={{ position: 'absolute', top: '2%', left: '2%', padding: '8px', border: `1px solid ${CONFIG.COLORS.NEON_CYAN}44`, background: `${CONFIG.BACKGROUND_COLOR}88`}}>
            <p style={{ margin: 0, fontSize: '12px' }}>SYS_STATUS: OPERATIONAL</p>
            <p style={{ margin: 0, fontSize: '10px', opacity: 0.7 }}>FLOW_RATE: 98.7%</p>
        </div>

        {/* Bottom-Right Text */}
        <div style={{ position: 'absolute', bottom: '2%', right: '2%', fontSize: '16px', letterSpacing: '2px' }}>
          GALAX 監視中
        </div>

        {/* Screenshot Button (with pointer events) */}
        <button
          onClick={handleScreenshot}
          style={{
            position: 'absolute',
            bottom: '2%',
            left: '2%',
            pointerEvents: 'all',
            padding: '8px 12px',
            fontFamily: "'Orbitron', 'Roboto Mono', 'monospace'",
            background: 'rgba(10, 15, 28, 0.8)',
            border: `1px solid ${CONFIG.COLORS.NEON_LIGHT_BLUE}`,
            color: CONFIG.COLORS.NEON_LIGHT_BLUE,
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s, background-color 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.backgroundColor = 'rgba(85, 195, 255, 0.2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.backgroundColor = 'rgba(10, 15, 28, 0.8)'; }}
        >
          SAVE PNG
        </button>
      </div>
    </div>
  );
};

export default HudParticles;
