import React, { useEffect, useRef, useState } from 'react';
import Map, { MapRef } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Event } from '../types';

interface GlobalMapProps {
  events: Event[];
}

export function GlobalMap({ events }: GlobalMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 0.8,
    pitch: 0,
    bearing: 0
  });

  const onMapLoad = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      // MapLibre GL用のglobe projection設定
      map.setProjection('globe');
    }
  }

  const layers = [
    new ScatterplotLayer({
      id: 'events-scatter',
      data: events,
      getPosition: (d: Event) => [d.lon, d.lat],
      getRadius: (d: Event) => d.severity * 50000,
      getFillColor: (d: Event) => {
        switch (d.severity) {
          case 5: return [255, 0, 0, 200];
          case 4: return [255, 100, 0, 180];
          case 3: return [255, 200, 0, 160];
          case 2: return [0, 255, 200, 140];
          default: return [0, 255, 0, 120];
        }
      },
      pickable: true,
      radiusUnits: 'meters',
      radiusScale: 1,
      stroked: true,
      filled: true,
      getLineColor: [255, 255, 255, 100],
      lineWidthMinPixels: 1
    }),
    new ArcLayer({
      id: 'events-arcs',
      data: events,
      getSourcePosition: (d: Event) => [d.lon, d.lat],
      getTargetPosition: [0, 0], // Center of the world
      getSourceColor: (d: Event) => {
        switch (d.category) {
          case 'net': return [0, 255, 255, 150];
          case 'geo': return [255, 100, 0, 150];
          case 'news': return [255, 0, 255, 150];
          case 'energy': return [255, 255, 0, 150];
          default: return [255, 255, 255, 100];
        }
      },
      getTargetColor: [100, 200, 255, 100],
      getWidth: (d: Event) => d.severity * 2,
      pickable: true
    })
  ];

  const getTooltip = ({ object }: any) => {
    if (object) {
      return {
        html: `
          <div style="font-family: monospace; font-size: 12px;">
            <strong>Event ${object.id}</strong><br/>
            Severity: ${object.severity}<br/>
            Category: ${object.category}<br/>
            Coordinates: ${object.lat.toFixed(4)}, ${object.lon.toFixed(4)}
          </div>
        `,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: '1px solid cyan',
          borderRadius: '4px',
          padding: '8px'
        }
      };
    }
    return null;
  }

  return (
    <div className="absolute inset-0 opacity-80">
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        getTooltip={getTooltip}
      >
        <Map
          ref={mapRef}
          mapStyle="https://trident.yuiseki.net/map_styles/fiord-color-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
          maxZoom={6}
          minZoom={0.3}
          attributionControl={false}
          onLoad={onMapLoad}
          projection="globe"
        />
      </DeckGL>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
}