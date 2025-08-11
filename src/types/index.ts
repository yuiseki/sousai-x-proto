export interface Event {
  id: string;
  lat: number;
  lon: number;
  severity: 1 | 2 | 3 | 4 | 5;
  category: 'net' | 'geo' | 'news' | 'energy' | 'unknown';
  ts: number;
}

export interface SystemStatus {
  phase: string;
  progress: number;
  linkLayer: string;
  lastUpdate: number;
  userPermission: string;
}

export interface TelemetryData {
  throughput: number;
  activeNodes: number;
  serialNumber: string;
  buildId: string;
}