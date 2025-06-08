import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, Avatar, useTheme, alpha } from '@mui/material';
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

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add shipment markers
    shipments.forEach((shipment) => {
      // Origin marker
      const originEl = document.createElement('div');
      originEl.className = 'marker-origin';
      originEl.style.width = '30px';
      originEl.style.height = '30px';
      originEl.style.borderRadius = '50%';
      originEl.style.border = `3px solid ${theme.palette.primary.main}`;
      originEl.style.backgroundColor = 'white';
      originEl.style.boxShadow = theme.customShadows?.card || theme.shadows[4];
      originEl.style.cursor = 'pointer';

      const originMarker = new mapboxgl.Marker(originEl)
        .setLngLat([shipment.origin.coordinates.lng, shipment.origin.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <strong>${shipment.origin.port}</strong><br/>
              ${shipment.origin.country}<br/>
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
      destEl.style.border = `3px solid ${theme.palette.success.main}`;
      destEl.style.backgroundColor = 'white';
      destEl.style.boxShadow = theme.customShadows?.card || theme.shadows[4];
      destEl.style.cursor = 'pointer';

      const destMarker = new mapboxgl.Marker(destEl)
        .setLngLat([shipment.destination.coordinates.lng, shipment.destination.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <strong>${shipment.destination.port}</strong><br/>
              ${shipment.destination.country}<br/>
              <span style="color: #666; font-size: 12px;">Destination</span>
            </div>
          `)
        )
        .addTo(map.current!);

      markers.current.push(destMarker);

      // Draw route line
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
              [shipment.origin.coordinates.lng, shipment.origin.coordinates.lat],
              [shipment.destination.coordinates.lng, shipment.destination.coordinates.lat],
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
          'line-color': theme.palette.primary.main,
          'line-width': 2,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2],
        },
      });

      // Add current location for in-transit shipments
      if (shipment.status === 'In Transit' && shipment.currentLocation) {
        const currentEl = document.createElement('div');
        currentEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: ${theme.palette.info.main};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${theme.customShadows?.primary || theme.shadows[4]};
            animation: pulse 2s infinite;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        `;

        const currentMarker = new mapboxgl.Marker(currentEl)
          .setLngLat([shipment.currentLocation.lng, shipment.currentLocation.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <strong>${shipment.trackingNumber}</strong><br/>
                Status: ${shipment.status}<br/>
                Speed: ${shipment.currentLocation.speed} knots<br/>
                <span style="color: #666; font-size: 12px;">Last updated: Just now</span>
              </div>
            `)
          )
          .addTo(map.current!);

        markers.current.push(currentMarker);
      }
    });

    // Fit map to show all markers
    if (shipments.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      shipments.forEach(shipment => {
        bounds.extend([shipment.origin.coordinates.lng, shipment.origin.coordinates.lat]);
        bounds.extend([shipment.destination.coordinates.lng, shipment.destination.coordinates.lat]);
      });
      map.current!.fitBounds(bounds, { padding: 50 });
    }
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
            boxShadow: theme.customShadows?.card || theme.shadows[4],
            backdropFilter: 'blur(10px)',
            background: alpha(theme.palette.background.paper, 0.9),
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Map Legend
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiberManualRecord sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
              <Typography variant="caption">Origin Port</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiberManualRecord sx={{ color: theme.palette.success.main, fontSize: 16 }} />
              <Typography variant="caption">Destination Port</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping sx={{ color: theme.palette.info.main, fontSize: 16 }} />
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
            bgcolor: alpha(theme.palette.info.main, 0.9),
            color: 'white',
            fontWeight: 600,
            boxShadow: theme.customShadows?.card || theme.shadows[4],
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