import React from 'react';
import { Event } from '../types';

interface EventOverlayProps {
  event: Event;
  onClose: () => void;
}

export function EventOverlay({ event, onClose }: EventOverlayProps) {
  const getCategoryInfo = () => {
    switch (event.category) {
      case 'net':
        return {
          title: 'Network Security Alert',
          icon: '🔗',
          details: 'Anomalous network traffic detected in sector coordinates',
          analyst: 'Dr. Sarah Chen - Cybersecurity Division'
        };
      case 'geo':
        return {
          title: 'Geological Anomaly',
          icon: '🌍',
          details: 'Seismic irregularities registered by global monitoring grid',
          analyst: 'Prof. Marcus Wright - Geological Survey'
        };
      case 'news':
        return {
          title: 'Information Warfare Detected',
          icon: '📡',
          details: 'Coordinated disinformation campaign identified across multiple platforms',
          analyst: 'Agent Rivera - Information Operations'
        };
      case 'energy':
        return {
          title: 'Energy Grid Fluctuation',
          icon: '⚡',
          details: 'Unusual power consumption patterns detected in regional grid',
          analyst: 'Dr. Kim Nakamura - Energy Systems'
        };
      default:
        return {
          title: 'Unknown Signal',
          icon: '❓',
          details: 'Unclassified event requiring immediate analyst attention',
          analyst: 'AI Classification System'
        };
    }
  };

  const info = getCategoryInfo();
  const severityColor = event.severity >= 4 ? 'border-red-500' : event.severity >= 3 ? 'border-orange-500' : 'border-yellow-500';
  const severityBg = event.severity >= 4 ? 'bg-red-500/20' : event.severity >= 3 ? 'bg-orange-500/20' : 'bg-yellow-500/20';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-96 bg-gray-900/90 backdrop-blur-md rounded-lg border-2 ${severityColor} shadow-2xl`}>
        <div className={`p-4 ${severityBg} border-b border-gray-700 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <h3 className="text-white font-bold">{info.title}</h3>
              <p className="text-xs text-gray-300">Event ID: {event.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Severity:</span>
              <span className={`ml-2 font-bold ${event.severity >= 4 ? 'text-red-400' : event.severity >= 3 ? 'text-orange-400' : 'text-yellow-400'}`}>
                Level {event.severity}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Category:</span>
              <span className="ml-2 text-cyan-400 uppercase">{event.category}</span>
            </div>
            <div>
              <span className="text-gray-400">Coordinates:</span>
              <span className="ml-2 text-green-400 font-mono">
                {event.lat.toFixed(4)}, {event.lon.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Timestamp:</span>
              <span className="ml-2 text-purple-400 font-mono">
                {new Date(event.ts).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-300 text-sm mb-3">{info.details}</p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                AC
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Assigned Analyst</p>
                <p className="text-gray-400 text-xs">{info.analyst}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-semibold transition-colors">
              Investigate
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm font-semibold transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}