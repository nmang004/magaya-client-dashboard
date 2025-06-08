import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import { LocalShipping, FiberManualRecord } from '@mui/icons-material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';

// Set your Mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

interface ShipmentMapProps {
  shipments: any[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ 
  shipments, 
  center = { lat: 0, lng: 0 }, 
  zoom = 2 
}) => {
  const theme = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Helper function to handle both coordinate structures - nested or direct
    const getCoordinates = (location: any) => {
      if (!location) return { lng: null, lat: null };
      if (location.coordinates) {
        return { lng: location.coordinates.lng, lat: location.coordinates.lat };
      }
      return { lng: location.lng, lat: location.lat };
    };

    // Wait for the map to be loaded before adding sources
    const addShipmentData = () => {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add shipment markers
      shipments.forEach((shipment: any) => {
        const originCoords = getCoordinates(shipment.origin);
        const destCoords = getCoordinates(shipment.destination);

        // Skip if coordinates are missing
        if (!originCoords.lng || !originCoords.lat || !destCoords.lng || !destCoords.lat) {
          console.warn('Missing coordinates for shipment:', shipment.id);
          return;
        }

        // Origin marker
        const originEl = document.createElement('div');
        originEl.className = 'marker-origin';
        originEl.style.width = '30px';
        originEl.style.height = '30px';
        originEl.style.borderRadius = '50%';
        originEl.style.border = `3px solid #1e3a8a`;
        originEl.style.backgroundColor = 'white';
        originEl.style.boxShadow = '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)';
        originEl.style.cursor = 'pointer';

        const originMarker = new mapboxgl.Marker(originEl)
          .setLngLat([originCoords.lng, originCoords.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <strong>${shipment.origin.port}</strong><br/>
                ${shipment.origin.country || 'Unknown'}<br/>
                <span style="color: #666; font-size: 12px;">Origin</span>
              </div>
            `)
          )
          .addTo(map.current!);

        markers.current.push(originMarker);

        // Destination marker
        const destEl = document.createElement('div');
        destEl.className = 'marker-destination';
        destEl.style.width = '30px';
        destEl.style.height = '30px';
        destEl.style.borderRadius = '50%';
        destEl.style.border = `3px solid #059669`;
        destEl.style.backgroundColor = 'white';
        destEl.style.boxShadow = '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)';
        destEl.style.cursor = 'pointer';

        const destMarker = new mapboxgl.Marker(destEl)
          .setLngLat([destCoords.lng, destCoords.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <strong>${shipment.destination.port}</strong><br/>
                ${shipment.destination.country || 'Unknown'}<br/>
                <span style="color: #666; font-size: 12px;">Destination</span>
              </div>
            `)
          )
          .addTo(map.current!);

        markers.current.push(destMarker);

        // Draw route line - only if map style is loaded
        if (map.current!.isStyleLoaded()) {
          if (map.current!.getSource(`route-${shipment.id}`)) {
            map.current!.removeLayer(`route-${shipment.id}`);
            map.current!.removeSource(`route-${shipment.id}`);
          }

          map.current!.addSource(`route-${shipment.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [originCoords.lng, originCoords.lat],
                  [destCoords.lng, destCoords.lat],
                ],
              },
            },
          });

          map.current!.addLayer({
            id: `route-${shipment.id}`,
            type: 'line',
            source: `route-${shipment.id}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#1e3a8a',
              'line-width': 2,
              'line-opacity': 0.6,
              'line-dasharray': [2, 2],
            },
          });
        }

        // Add current location for in-transit shipments
        if (shipment.status === 'In Transit' && shipment.currentLocation) {
          const currentCoords = getCoordinates(shipment.currentLocation);
          
          if (currentCoords.lng && currentCoords.lat) {
            const currentEl = document.createElement('div');
            currentEl.innerHTML = `
              <div style="
                width: 40px;
                height: 40px;
                background: #2563eb;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12);
                animation: pulse 2s infinite;
              ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            `;

            const currentMarker = new mapboxgl.Marker(currentEl)
              .setLngLat([currentCoords.lng, currentCoords.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 8px;">
                    <strong>${shipment.trackingNumber}</strong><br/>
                    Status: ${shipment.status}<br/>
                    Speed: ${shipment.currentLocation.speed || 'Unknown'} knots<br/>
                    <span style="color: #666; font-size: 12px;">Last updated: Just now</span>
                  </div>
                `)
              )
              .addTo(map.current!);

            markers.current.push(currentMarker);
          }
        }
      });

      // Fit map to show all markers
      if (shipments.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        shipments.forEach((shipment: any) => {
          const originCoords = getCoordinates(shipment.origin);
          const destCoords = getCoordinates(shipment.destination);
          
          if (originCoords.lng && originCoords.lat) {
            bounds.extend([originCoords.lng, originCoords.lat]);
          }
          if (destCoords.lng && destCoords.lat) {
            bounds.extend([destCoords.lng, destCoords.lat]);
          }
        });
        
        if (!bounds.isEmpty()) {
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      }
    };

    // Check if map is already loaded, if not wait for it
    if (map.current && map.current.isStyleLoaded()) {
      addShipmentData();
    } else if (map.current) {
      map.current.on('style.load', addShipmentData);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.off('style.load', addShipmentData);
      }
    };
  }, [shipments, theme]);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <Box ref={mapContainer} sx={{ height: '100%', width: '100%' }} />
      
      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
            backdropFilter: 'blur(10px)',
            background: alpha(theme.palette.background.paper, 0.9),
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Map Legend
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiberManualRecord sx={{ color: '#1e3a8a', fontSize: 16 }} />
              <Typography variant="caption">Origin Port</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiberManualRecord sx={{ color: '#059669', fontSize: 16 }} />
              <Typography variant="caption">Destination Port</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping sx={{ color: '#2563eb', fontSize: 16 }} />
              <Typography variant="caption">In Transit</Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Active Shipments Counter */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <Chip
          label={`${shipments.filter(s => s.status === 'In Transit').length} Active Shipments`}
          icon={<LocalShipping />}
          sx={{
            bgcolor: alpha('#2563eb', 0.9),
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
          }}
        />
      </motion.div>

      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ShipmentMap;