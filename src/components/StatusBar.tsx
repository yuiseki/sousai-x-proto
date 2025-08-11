import React from 'react';
import { SystemStatus } from '../types';

interface StatusBarProps {
  status: SystemStatus;
}

export function StatusBar({ status }: StatusBarProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      timeZone: 'UTC'
    }) + ' UTC';
  };

  return (
    <div className="h-12 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30 flex items-center justify-between px-6 text-xs font-mono">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-cyan-300">PERMISSION: {status.userPermission}</span>
        </div>
        <div className="text-purple-300">PHASE: {status.phase}</div>
        <div className="text-orange-300">LINK: {status.linkLayer}</div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">PROGRESS:</span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          <span className="text-cyan-300">{Math.floor(status.progress)}%</span>
        </div>
        <div className="text-green-300">{formatTime(status.lastUpdate)}</div>
      </div>
    </div>
  );
}