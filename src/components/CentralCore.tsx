import React, { useState, useEffect } from 'react';

interface CentralCoreProps {
  eventCount: number;
  severity: number;
  onPulse: () => void;
}

export function CentralCore({ eventCount, severity, onPulse }: CentralCoreProps) {
  const [rotation, setRotation] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [orbitalTexts, setOrbitalTexts] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (eventCount > 0) {
      setPulse(true);
      onPulse();
      setTimeout(() => setPulse(false), 200);
    }
  }, [eventCount, onPulse]);

  useEffect(() => {
    const texts = [
      'GLOBAL MONITOR',
      'THREAT ANALYSIS',
      'NEURAL SYNC',
      'QUANTUM CORE',
      'DATA FUSION',
      'PREDICTIVE AI'
    ];
    setOrbitalTexts(texts);
  }, []);

  const getSeverityColor = () => {
    if (severity >= 4) return 'from-red-500 to-orange-500';
    if (severity >= 3) return 'from-orange-500 to-yellow-500';
    return 'from-cyan-500 to-purple-500';
  };

  const getSeverityGlow = () => {
    if (severity >= 4) return 'shadow-red-500/50';
    if (severity >= 3) return 'shadow-orange-500/50';
    return 'shadow-cyan-500/50';
  };

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Outer glow ring */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${getSeverityColor()} opacity-20 animate-pulse`}
        style={{ 
          filter: 'blur(20px)',
          transform: pulse ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.2s'
        }}
      ></div>
      
      {/* Rotating arcs */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        {[...Array(3)].map((_, i) => (
          <circle
            key={i}
            cx="50%"
            cy="50%"
            r={120 + i * 20}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="2"
            strokeDasharray={`${80 + i * 20} ${200 + i * 40}`}
            className={severity >= 4 ? 'text-red-400' : severity >= 3 ? 'text-orange-400' : 'text-cyan-400'}
            opacity={0.7 - i * 0.2}
          />
        ))}
      </svg>

      {/* Central core */}
      <div 
        className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${getSeverityColor()} shadow-2xl ${getSeverityGlow()} flex items-center justify-center`}
        style={{ 
          transform: pulse ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s'
        }}
      >
        <div className="absolute inset-2 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white font-mono text-xs text-center">
            <div>EVENTS</div>
            <div className="text-lg font-bold text-cyan-300">{eventCount}</div>
            <div>SEVERITY</div>
            <div className={`text-lg font-bold ${severity >= 4 ? 'text-red-400' : severity >= 3 ? 'text-orange-400' : 'text-green-400'}`}>
              {severity}
            </div>
          </div>
        </div>
      </div>

      {/* Orbital text elements */}
      {orbitalTexts.map((text, i) => (
        <div
          key={i}
          className="absolute text-xs font-mono text-cyan-300/70 whitespace-nowrap"
          style={{
            transform: `rotate(${rotation + i * 60}deg) translateX(180px) rotate(${-rotation - i * 60}deg)`,
            transformOrigin: 'center'
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}