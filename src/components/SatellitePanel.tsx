import React from 'react';

interface SatellitePanelProps {
  title: string;
  type: 'map' | 'network' | 'analysis' | 'status';
  data?: any;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isConnected?: boolean;
}

export function SatellitePanel({ title, type, data, position, isConnected = true }: SatellitePanelProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-8 left-8';
      case 'top-right': return 'top-8 right-8';
      case 'bottom-left': return 'bottom-8 left-8';
      case 'bottom-right': return 'bottom-8 right-8';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'map':
        return (
          <div className="space-y-2">
            <div className="w-full h-12 bg-gradient-to-br from-blue-900 to-green-900 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-green-400">HOTSPOTS: {Math.floor(Math.random() * 20) + 5}</div>
          </div>
        );
      
      case 'network':
        return (
          <div className="space-y-2">
            <div className="relative w-full h-12">
              <svg className="w-full h-full">
                {[...Array(8)].map((_, i) => (
                  <g key={i}>
                    <circle
                      cx={`${20 + (i % 4) * 20}%`}
                      cy={`${30 + Math.floor(i / 4) * 40}%`}
                      r="2"
                      fill="currentColor"
                      className="text-cyan-400"
                    />
                    {i < 7 && (
                      <line
                        x1={`${20 + (i % 4) * 20}%`}
                        y1={`${30 + Math.floor(i / 4) * 40}%`}
                        x2={`${20 + ((i + 1) % 4) * 20}%`}
                        y2={`${30 + Math.floor((i + 1) / 4) * 40}%`}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-purple-400/50"
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
            <div className="text-xs text-purple-400">NODES: {Math.floor(Math.random() * 100) + 200}</div>
          </div>
        );
      
      case 'analysis':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-orange-600 to-yellow-400 rounded"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-orange-400">PATTERN: {(Math.random() * 100).toFixed(1)}%</div>
          </div>
        );
      
      case 'status':
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              {['CPU', 'MEM', 'NET', 'GPU'].map((metric, i) => (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{metric}</span>
                  <div className="w-8 h-1 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-400 transition-all duration-1000"
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-green-400">STATUS: OPTIMAL</div>
          </div>
        );
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} w-32 h-32`}>
      {/* Connection line to center */}
      {isConnected && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-px bg-gradient-to-r from-cyan-400/50 to-transparent animate-pulse"
            style={{
              left: '50%',
              top: '50%',
              width: '200px',
              height: '1px',
              transformOrigin: 'left center',
              transform: (() => {
                switch (position) {
                  case 'top-left': return 'rotate(135deg)';
                  case 'top-right': return 'rotate(225deg)';
                  case 'bottom-left': return 'rotate(45deg)';
                  case 'bottom-right': return 'rotate(315deg)';
                }
              })()
            }}
          ></div>
        </div>
      )}
      
      {/* Panel */}
      <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm border border-cyan-500/30 p-4 flex flex-col items-center justify-center hover:border-cyan-400/50 transition-colors cursor-pointer group">
        <div className="text-xs font-mono text-cyan-300 mb-2 text-center group-hover:text-cyan-200">
          {title}
        </div>
        <div className="flex-1 w-full flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}