import { useState, useEffect, useCallback } from 'react';
import { Event, SystemStatus, TelemetryData } from '../types';

const CATEGORIES: Event['category'][] = ['net', 'geo', 'news', 'energy', 'unknown'];
const PHASES = ['SCAN', 'ANALYZE', 'CORRELATE', 'PREDICT', 'MONITOR'];

export function useDataStream() {
  const [events, setEvents] = useState<Event[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    phase: 'SCAN',
    progress: 0,
    linkLayer: 'L7-HTTP',
    lastUpdate: Date.now(),
    userPermission: 'OVERSEER'
  });
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    throughput: 0,
    activeNodes: 0,
    serialNumber: 'AGI-7834-DELTA',
    buildId: 'v2.1.4-gamma'
  });

  const generateEvent = useCallback((): Event => {
    return {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      lat: (Math.random() - 0.5) * 180,
      lon: (Math.random() - 0.5) * 360,
      severity: Math.floor(Math.random() * 5) + 1 as Event['severity'],
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      ts: Date.now()
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate 8-24 new events
      const eventCount = Math.floor(Math.random() * 17) + 8;
      const newEvents = Array.from({ length: eventCount }, generateEvent);
      
      setEvents(newEvents);
      
      // Update system status
      setSystemStatus(prev => ({
        ...prev,
        phase: PHASES[Math.floor(Math.random() * PHASES.length)],
        progress: Math.random() * 100,
        lastUpdate: Date.now(),
        linkLayer: `L${Math.floor(Math.random() * 7) + 1}-${['HTTP', 'TCP', 'UDP', 'MQTT'][Math.floor(Math.random() * 4)]}`
      }));

      // Update telemetry
      setTelemetry(prev => ({
        ...prev,
        throughput: Math.floor(Math.random() * 1000) + 500,
        activeNodes: Math.floor(Math.random() * 50) + 100
      }));
    }, 3000);

    // Initial data
    const initialEvents = Array.from({ length: 16 }, generateEvent);
    setEvents(initialEvents);

    return () => clearInterval(interval);
  }, [generateEvent]);

  return { events, systemStatus, telemetry };
}