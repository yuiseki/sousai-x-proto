import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from './components/StatusBar';
import { TelemetryBar } from './components/TelemetryBar';
import { CentralCore } from './components/CentralCore';
import { SatellitePanel } from './components/SatellitePanel';
import { EventOverlay } from './components/EventOverlay';
import { GlobalMap } from './components/GlobalMap';
import { SettingsPanel } from './components/SettingsPanel';
import HudParticles from './components/HudParticles';
import { useDataStream } from './hooks/useDataStream';
import { Event } from './types';

function App() {
  const { events, systemStatus, telemetry } = useDataStream();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHudParticles, setShowHudParticles] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'escape':
          if (selectedEvent) {
            setSelectedEvent(null);
          } else if (showSettings) {
            setShowSettings(false);
          } else if (showHudParticles) {
            setShowHudParticles(false);
          }
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowSettings(!showSettings);
          }
          break;
        case 'h':
          // Toggle HUD Particles with 'H' key
          setShowHudParticles(!showHudParticles);
          break;
        case 'c':
          if (selectedEvent) {
            setSelectedEvent(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedEvent, showSettings, showHudParticles]);

  const handlePulse = useCallback(() => {
    setPulseCount(prev => prev + 1);
  }, []);

  const handleShowDetails = useCallback(() => {
    const criticalEvent = events.find(e => e.severity >= 4) || events[0];
    if (criticalEvent) {
      setSelectedEvent(criticalEvent);
    }
  }, [events]);

  const maxSeverity = Math.max(...events.map(e => e.severity), 1);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden relative">
      {/* HUD Particles Background Layer */}
      {showHudParticles && (
        <div className="absolute inset-0 z-0">
          <HudParticles />
        </div>
      )}

      {/* Background map */}
      <GlobalMap events={events} />
      
      {/* Status bar */}
      <StatusBar status={systemStatus} />
      
      {/* Main content area */}
      <div className="absolute inset-x-0 top-12 bottom-10 flex items-center justify-center">
        {/* Central monitoring core */}
        <CentralCore
          eventCount={events.length}
          severity={maxSeverity}
          onPulse={handlePulse}
          onShowDetails={handleShowDetails}
        />
        
        {/* Satellite panels */}
        <SatellitePanel
          title="GLOBAL MAP"
          type="map"
          position="top-left"
          isConnected={true}
        />
        
        <SatellitePanel
          title="NETWORK"
          type="network"
          position="top-right"
          isConnected={true}
        />
        
        <SatellitePanel
          title="ANALYSIS"
          type="analysis"
          position="bottom-left"
          isConnected={true}
        />
        
        <SatellitePanel
          title="STATUS"
          type="status"
          position="bottom-right"
          isConnected={true}
        />
      </div>
      
      {/* Telemetry bar */}
      <TelemetryBar telemetry={telemetry} />
      
      {/* Controls */}
      <div className="fixed top-16 right-8 space-y-2 z-30">
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Settings (Ctrl+S)"
        >
          ⚙
        </button>
        
        {/* HUD Particles toggle button */}
        <button
          onClick={() => setShowHudParticles(!showHudParticles)}
          className={`w-8 h-8 bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-full flex items-center justify-center transition-colors ${
            showHudParticles 
              ? 'text-cyan-300 bg-cyan-500/20' 
              : 'text-cyan-400 hover:text-cyan-300'
          }`}
          title="Toggle HUD Particles (H)"
        >
          ✨
        </button>
      </div>
      
      {/* Overlays */}
      {selectedEvent && (
        <EventOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-12 left-8 text-xs font-mono text-gray-500 space-y-1">
        <div>ESC: Close overlay/settings</div>
        <div>Ctrl+S: Toggle settings</div>
        <div>H: Toggle HUD particles</div>
        <div>C: Close event overlay</div>
      </div>
    </div>
  );
}

export default App;