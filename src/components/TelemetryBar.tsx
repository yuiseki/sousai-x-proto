import React, { useState, useEffect } from 'react';
import { TelemetryData } from '../types';

interface TelemetryBarProps {
  telemetry: TelemetryData;
}

export function TelemetryBar({ telemetry }: TelemetryBarProps) {
  const [scrollText, setScrollText] = useState('');
  const [randomId, setRandomId] = useState('');

  useEffect(() => {
    const generateScrollText = () => {
      const messages = [
        'QUANTUM ENTANGLEMENT SYNC NOMINAL',
        'NEURAL PATHWAY OPTIMIZATION COMPLETE',
        'GLOBAL SENSOR GRID ACTIVE',
        'PREDICTIVE ALGORITHM CONVERGENCE 97.3%',
        'THREAT ASSESSMENT MATRIX UPDATED',
        'COGNITIVE PROCESSING UNITS OPERATIONAL'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    const generateRandomId = () => {
      return Math.random().toString(36).substr(2, 12).toUpperCase();
    };

    setScrollText(generateScrollText());
    setRandomId(generateRandomId());

    const interval = setInterval(() => {
      setScrollText(generateScrollText());
      setRandomId(generateRandomId());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    timeZone: 'UTC'
  }) + ' UTC';

  return (
    <div className="h-10 bg-black/80 backdrop-blur-sm border-t border-cyan-500/30 flex items-center justify-between px-6 text-xs font-mono overflow-hidden">
      <div className="flex items-center space-x-8">
        <span className="text-green-400">SERIAL: {telemetry.serialNumber}</span>
        <span className="text-cyan-400">BUILD: {telemetry.buildId}</span>
        <span className="text-purple-400">NODES: {telemetry.activeNodes}</span>
        <span className="text-orange-400">THROUGHPUT: {telemetry.throughput} MB/s</span>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="text-yellow-400 animate-pulse whitespace-nowrap overflow-hidden">
          <div className="animate-marquee">{scrollText}</div>
        </div>
        <span className="text-gray-400">ID: {randomId}</span>
        <span className="text-green-300">{currentTime}</span>
      </div>
    </div>
  );
}