import React from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-8 w-72 bg-gray-900/90 backdrop-blur-md rounded-lg border border-cyan-500/30 shadow-2xl z-40 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm">System Configuration</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4 text-sm">
        <div>
          <label className="text-gray-300 block mb-1">Alert Threshold</label>
          <select className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white">
            <option>Severity ≥ 3</option>
            <option>Severity ≥ 4</option>
            <option>Severity = 5</option>
          </select>
        </div>
        
        <div>
          <label className="text-gray-300 block mb-1">Event Count Limit</label>
          <input
            type="range"
            min="8"
            max="128"
            defaultValue="24"
            className="w-full"
          />
          <div className="text-xs text-gray-400 mt-1">8 - 128 events per cycle</div>
        </div>
        
        <div>
          <label className="text-gray-300 block mb-1">Animation Speed</label>
          <select className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white">
            <option>Normal (60 FPS)</option>
            <option>Smooth (30 FPS)</option>
            <option>Performance (15 FPS)</option>
          </select>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Auto-dismiss overlays</span>
            <input type="checkbox" defaultChecked className="accent-cyan-500" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Audio alerts</span>
          <input type="checkbox" className="accent-cyan-500" />
        </div>
      </div>
    </div>
  );
}