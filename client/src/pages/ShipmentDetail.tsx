import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Print,
  Share,
  LocalShipping,
  Description,
  Timeline,
  Map,
  AttachMoney,
  NavigateNext,
  ContentCopy,
  CheckCircle,
  Schedule,
  LocationOn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
// React Query will be integrated later
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import components
import StatusChip from '../components/common/StatusChip';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2VvZGlyZWN0b3IiLCJhIjoiY21ibm51eGF4MGpiZzJvb2I5eGhxYmlnMyJ9.nK-8bmXVMKRCEXZF0BRV6w';

// Temporary inline GlassCard to fix import issues
const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Card sx={{ 
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    borderRadius: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
    },
  }}>
    {children}
  </Card>
);

// Great Circle Distance Calculation
const calculateGreatCircleDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = point1[1] * Math.PI / 180;
  const lat2 = point2[1] * Math.PI / 180;
  const deltaLat = (point2[1] - point1[1]) * Math.PI / 180;
  const deltaLng = (point2[0] - point1[0]) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

// Fixed Great Circle Route with proper Date Line handling
const generateGreatCircleWaypoints = (start: [number, number], end: [number, number], numPoints: number = 8): [number, number][] => {
  const waypoints: [number, number][] = [start];
  
  // Handle International Date Line crossing for Trans-Pacific routes
  let adjustedEnd = [...end] as [number, number];
  
  // If crossing date line (Shanghai to LA case), adjust longitude for shortest path
  if (start[0] > 100 && end[0] < -100) {
    // Shanghai (121°E) to LA (-118°W) - go EAST across Pacific
    adjustedEnd[0] = end[0] + 360; // Convert -118 to 242 for calculation
  } else if (start[0] < -100 && end[0] > 100) {
    // LA to Shanghai - go WEST across Pacific  
    adjustedEnd[0] = end[0] - 360; // Convert for westward calculation
  }
  
  for (let i = 1; i < numPoints - 1; i++) {
    const fraction = i / (numPoints - 1);
    
    // Simple interpolation for maritime routes (more reliable than complex great circle)
    const lat = start[1] + (adjustedEnd[1] - start[1]) * fraction;
    let lng = start[0] + (adjustedEnd[0] - start[0]) * fraction;
    
    // Normalize longitude to -180 to 180 range
    while (lng > 180) lng -= 360;
    while (lng < -180) lng += 360;
    
    waypoints.push([lng, lat]);
  }
  
  waypoints.push(end);
  return waypoints;
};

// Professional Maritime Route Generator
const generateMaritimeRoute = (origin: [number, number], destination: [number, number], progress: number = 0.6) => {
  // Validate coordinates
  if (!origin || !destination || origin.length !== 2 || destination.length !== 2) {
    throw new Error('Invalid coordinates provided');
  }

  // Ensure proper coordinate format [longitude, latitude]
  const startPort: [number, number] = [origin[0], origin[1]];
  const endPort: [number, number] = [destination[0], destination[1]];

  // Detect route type based on coordinates
  const isTransPacific = (startPort[0] > 100 && endPort[0] < -100) || (startPort[0] < -100 && endPort[0] > 100);
  const isTransAtlantic = Math.abs(startPort[0] - endPort[0]) > 60 && !isTransPacific;

  let waypoints: [number, number][] = [];

  if (isTransPacific) {
    // Trans-Pacific Route - FIXED to go EASTWARD across Pacific
    
    // Calculate if we need to cross the International Date Line
    const crossesDateLine = (startPort[0] > 100 && endPort[0] < -100);
    
    if (crossesDateLine) {
      // Shanghai to LA: EASTWARD across Pacific (CRITICAL FIX)
      waypoints = [
        startPort,                    // Shanghai Port (121.4737°E, 31.2304°N)
        [130, 33],                    // East China Sea (moving EAST)
        [145, 36],                    // Western Pacific (continuing EAST)
        [165, 39],                    // Central Pacific (still EAST)
        [175, 41],                    // Near International Date Line (EAST)
        [-175, 42],                   // Just past Date Line (continuing EAST)
        [-160, 41],                   // Eastern Pacific (EAST)
        [-145, 39],                   // Northeast Pacific (EAST)
        [-130, 36],                   // Approaching California (EAST)
        endPort                       // Los Angeles (-118.2437°W, 34.0522°N)
      ];
    } else {
      // LA to Shanghai: WESTWARD across Pacific
      waypoints = [
        startPort,                    // Origin port
        [startPort[0] + 15, startPort[1] + 6],  // Exit coastal waters
        [-130, 40],                   // Northeast Pacific
        [-145, 42],                   // Eastern Pacific  
        [-160, 44],                   // Central Pacific
        [-175, 45],                   // Near Date Line
        [175, 44],                    // Past Date Line
        [160, 42],                    // Western Pacific
        [145, 40],                    // Western Pacific
        [endPort[0] - 8, endPort[1] + 3],      // Approach coastal waters
        endPort                       // Destination port
      ];
    }
  } else if (isTransAtlantic) {
    // Trans-Atlantic Route
    if (startPort[0] < endPort[0]) {
      // Americas to Europe/Africa
      waypoints = [
        startPort,
        [startPort[0] + 20, startPort[1] + 5],
        [-40, startPort[1] + 8],
        [-20, (startPort[1] + endPort[1]) / 2],
        [endPort[0] - 15, endPort[1]],
        endPort
      ];
    } else {
      // Europe/Africa to Americas
      waypoints = [
        startPort,
        [startPort[0] - 15, startPort[1]],
        [-20, (startPort[1] + endPort[1]) / 2],
        [-40, endPort[1] + 5],
        [endPort[0] + 20, endPort[1]],
        endPort
      ];
    }
  } else {
    // Regional route - use great circle approximation
    waypoints = generateGreatCircleWaypoints(startPort, endPort, 6);
  }

  // Calculate progress-based current position
  const totalSegments = waypoints.length - 1;
  const progressSegment = Math.min(progress * totalSegments, totalSegments - 0.1);
  const segmentIndex = Math.floor(progressSegment);
  const segmentProgress = progressSegment - segmentIndex;

  // Interpolate between waypoints for smooth progress
  let currentPosition: [number, number];
  if (segmentIndex >= waypoints.length - 1) {
    currentPosition = waypoints[waypoints.length - 1];
  } else {
    const currentWaypoint = waypoints[segmentIndex];
    const nextWaypoint = waypoints[segmentIndex + 1];
    currentPosition = [
      currentWaypoint[0] + (nextWaypoint[0] - currentWaypoint[0]) * segmentProgress,
      currentWaypoint[1] + (nextWaypoint[1] - currentWaypoint[1]) * segmentProgress
    ];
  }

  // Generate completed route up to current position
  const completedWaypoints = waypoints.slice(0, segmentIndex + 1);
  if (segmentProgress > 0 && segmentIndex < waypoints.length - 1) {
    completedWaypoints.push(currentPosition);
  }

  return {
    fullRoute: waypoints,
    completedRoute: completedWaypoints,
    currentPosition,
    origin: startPort,
    destination: endPort,
    totalDistance: calculateGreatCircleDistance(startPort, endPort),
    completedDistance: calculateGreatCircleDistance(startPort, currentPosition)
  };
};

// Maritime Tracking Map Component
const MaritimeTrackingMap: React.FC<{ shipmentData: any }> = ({ shipmentData }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const theme = useTheme();

  React.useEffect(() => {
    if (!mapContainer.current) return;

    // Extract and validate coordinates from shipment data
    const originLng = shipmentData.origin?.lng || 121.4737; // Shanghai longitude
    const originLat = shipmentData.origin?.lat || 31.2304;  // Shanghai latitude
    const destLng = shipmentData.destination?.lng || -118.2437; // LA longitude
    const destLat = shipmentData.destination?.lat || 34.0522;   // LA latitude

    // Ensure proper coordinate format [longitude, latitude] for Mapbox
    const origin: [number, number] = [originLng, originLat];
    const destination: [number, number] = [destLng, destLat];
    
    // Validate coordinates are within valid ranges
    if (Math.abs(originLng) > 180 || Math.abs(destLng) > 180 || 
        Math.abs(originLat) > 90 || Math.abs(destLat) > 90) {
      console.error('Invalid coordinates detected');
      return;
    }
    
    // Generate professional maritime route with 60% completion
    const routeData = generateMaritimeRoute(origin, destination, 0.60);
    
    try {
      // Calculate dynamic center point based on route
      const routeBounds = new mapboxgl.LngLatBounds();
      routeData.fullRoute.forEach(coord => routeBounds.extend(coord));
      const routeCenter = routeBounds.getCenter();

      // Initialize map with maritime styling - route-focused view
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark theme for better route visibility
        center: [routeCenter.lng, routeCenter.lat], // Dynamic center based on route
        zoom: 3, // Will be adjusted after route is loaded
        pitch: 0,
        bearing: 0,
        projection: 'mercator' as any
      });
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      return;
    }

    // Wait for map to load
    map.current.on('load', () => {
      if (!map.current) return;

      // Add ocean depth styling
      map.current.setPaintProperty('water', 'fill-color', [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, '#0f172a',
        5, '#1e293b',
        10, '#334155'
      ]);

      // Add full maritime route
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeData.fullRoute
          }
        }
      });

      // Add completed route
      map.current.addSource('completed-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeData.completedRoute
          }
        }
      });

      // Add planned route (remaining) - dashed white line
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 4,
          'line-opacity': 0.7,
          'line-dasharray': [4, 4]
        }
      });

      // Add completed route glow effect
      map.current.addLayer({
        id: 'completed-route-glow',
        type: 'line',
        source: 'completed-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 10,
          'line-opacity': 0.4,
          'line-blur': 2
        }
      });

      // Add completed route main line - solid green
      map.current.addLayer({
        id: 'completed-route-line',
        type: 'line',
        source: 'completed-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 5,
          'line-opacity': 1
        }
      });

      // Origin Port Marker
      const originMarker = new mapboxgl.Marker({
        element: createPortMarker('#10b981', '⚓')
      })
        .setLngLat(routeData.origin)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'maritime-popup' })
            .setHTML(`
              <div style="padding: 12px; background: rgba(15, 23, 42, 0.95); color: white; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="color: #10b981; font-weight: bold; margin-bottom: 4px;">${shipmentData.origin.port}</div>
                <div style="color: rgba(255,255,255,0.8); font-size: 12px;">Port of Origin</div>
                <div style="color: #10b981; font-size: 11px; margin-top: 4px;">✓ Departed Jun 01</div>
              </div>
            `)
        )
        .addTo(map.current);

      // Destination Port Marker
      const destMarker = new mapboxgl.Marker({
        element: createPortMarker('#f59e0b', '🏢')
      })
        .setLngLat(routeData.destination)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'maritime-popup' })
            .setHTML(`
              <div style="padding: 12px; background: rgba(15, 23, 42, 0.95); color: white; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="color: #f59e0b; font-weight: bold; margin-bottom: 4px;">${shipmentData.destination.port}</div>
                <div style="color: rgba(255,255,255,0.8); font-size: 12px;">Destination Port</div>
                <div style="color: #f59e0b; font-size: 11px; margin-top: 4px;">⏱ ETA: Jun 15</div>
              </div>
            `)
        )
        .addTo(map.current);

      // Current Vessel Position (if in transit)
      if (shipmentData.status === 'In Transit') {
        const vesselMarker = new mapboxgl.Marker({
          element: createVesselMarker()
        })
          .setLngLat(routeData.currentPosition)
          .setPopup(
            new mapboxgl.Popup({ offset: 25, className: 'maritime-popup' })
              .setHTML(`
                <div style="padding: 16px; background: rgba(15, 23, 42, 0.95); color: white; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                  <div style="color: #2563eb; font-weight: bold; margin-bottom: 4px;">${shipmentData.trackingNumber}</div>
                  <div style="color: rgba(255,255,255,0.9); font-size: 12px; margin-bottom: 8px;">MV Ever Given • Pacific Ocean</div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #10b981; font-size: 11px;">Speed: 18.5 knots</span>
                    <span style="color: #f59e0b; font-size: 11px;">Bearing: 045°</span>
                  </div>
                  <div style="color: #22d3ee; font-size: 11px;">🌊 Fair Weather • Calm Seas</div>
                </div>
              `)
          )
          .addTo(map.current);
      }

      // Professional route-focused bounds fitting
      const bounds = new mapboxgl.LngLatBounds();
      
      // Extend bounds for all route points to ensure full visibility
      routeData.fullRoute.forEach(coord => {
        if (coord && coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
          bounds.extend(coord);
        }
      });
      
      // Add current position to bounds if it exists
      if (routeData.currentPosition) {
        bounds.extend(routeData.currentPosition);
      }
      
      // Calculate optimal padding based on route type and distance
      const isLongHaul = routeData.totalDistance > 8000; // 8000km+ is long-haul
      const basePadding = isLongHaul ? 80 : 120;
      
      // Fit bounds with intelligent padding
      setTimeout(() => {
        if (map.current) {
          map.current.fitBounds(bounds, {
            padding: { 
              top: basePadding, 
              bottom: basePadding + 80, // Extra space for information panels
              left: basePadding, 
              right: basePadding + 100  // Extra space for navigation panels
            },
            maxZoom: isLongHaul ? 4 : 6,  // Appropriate zoom for route scale
            minZoom: 1,
            duration: 1500  // Smooth animation
          });
        }
      }, 500); // Delay to ensure map is fully loaded
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [shipmentData]);

  // Helper function to create port markers
  const createPortMarker = (color: string, emoji: string) => {
    const el = document.createElement('div');
    el.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
      border: 3px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4), inset 0 2px 4px rgba(255,255,255,0.1);
      transition: all 0.3s ease;
      position: relative;
      transform-origin: center center;
    `;
    el.innerHTML = emoji;
    
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)';
      el.style.borderWidth = '4px';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)';
      el.style.borderWidth = '3px';
    });
    
    return el;
  };

  // Helper function to create vessel marker
  const createVesselMarker = () => {
    const el = document.createElement('div');
    el.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      border: 4px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 12px 40px rgba(37, 99, 235, 0.6), inset 0 2px 4px rgba(255,255,255,0.2);
      animation: vesselPulse 3s ease-in-out infinite;
      position: relative;
      transform-origin: center center;
      transition: all 0.3s ease;
    `;
    
    // Add vessel icon
    el.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M21 6h-2l-1.27-3.18C17.53 2.34 17.04 2 16.5 2h-9C7.46 2 6.97 2.34 6.77 2.82L5.5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1.12L5 10v8c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-8l.88-2H21c.55 0 1-.45 1-1s-.45-1-1-1z"/>
      </svg>
    `;
    
    el.addEventListener('mouseenter', () => {
      el.style.animationPlayState = 'paused';
      el.style.boxShadow = '0 16px 48px rgba(37, 99, 235, 0.8), inset 0 2px 4px rgba(255,255,255,0.3)';
      el.style.borderWidth = '5px';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.animationPlayState = 'running';
      el.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)';
      el.style.borderWidth = '4px';
    });
    
    return el;
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100%', 
      width: '100%',
      '& .mapboxgl-popup-content': {
        padding: 0,
        borderRadius: '8px !important',
        background: 'transparent !important'
      },
      '& .mapboxgl-popup-tip': {
        borderTopColor: 'rgba(15, 23, 42, 0.95) !important'
      },
      '& .mapboxgl-canvas': {
        left: 0,
        top: 0
      }
    }}>
      <div 
        ref={mapContainer} 
        style={{ 
          height: '100%', 
          width: '100%', 
          position: 'relative',
          minHeight: '600px'
        }} 
      />
      
      {/* Add vessel pulse animation */}
      <style>{`
        @keyframes vesselPulse {
          0%, 100% { 
            box-shadow: 0 12px 40px rgba(37, 99, 235, 0.6), inset 0 2px 4px rgba(255,255,255,0.2), 0 0 0 0 rgba(37, 99, 235, 0.4);
          }
          50% { 
            box-shadow: 0 12px 40px rgba(37, 99, 235, 0.6), inset 0 2px 4px rgba(255,255,255,0.2), 0 0 0 20px rgba(37, 99, 235, 0);
          }
        }
      `}</style>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ShipmentDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);

  // Mock shipment data for immediate functionality
  const shipmentData = {
    id,
    trackingNumber: `SHP-00${id}`,
    status: 'In Transit',
    statusColor: 'info',
    statusIcon: 'local_shipping',
    lastUpdated: new Date().toISOString(),
    origin: { port: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
    destination: { port: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437 },
    estimatedDelivery: '2024-06-15T00:00:00Z',
    actualDelivery: null,
    carrier: {
      name: 'Maersk Line',
      logo: null,
      vesselName: 'Ever Given',
      voyageNumber: 'MG2401'
    },
    cargo: {
      value: 125000,
      weight: 2500,
      weightUnit: 'kg',
      type: 'Electronics',
      description: 'Consumer electronics and components'
    },
    container: {
      number: 'MSKU1234567',
      type: '40ft HC',
      sealNumber: 'SL123456'
    },
    paymentStatus: 'paid',
    shipper: 'Shanghai Electronics Co., Ltd.',
    consignee: 'LA Distribution Center',
    incoterm: 'FOB Shanghai',
    referenceNumber: 'REF-2024-001',
    events: [
      {
        id: '1',
        title: 'Shipment Departed',
        description: 'Container departed from Shanghai Port',
        timestamp: '2024-06-01T08:00:00Z',
        location: 'Shanghai, China',
        status: 'completed' as const,
        icon: 'local_shipping'
      },
      {
        id: '2',
        title: 'In Transit',
        description: 'Vessel on route to Los Angeles',
        timestamp: '2024-06-05T14:30:00Z',
        location: 'Pacific Ocean',
        status: 'in_progress' as const,
        icon: 'directions_boat'
      },
      {
        id: '3',
        title: 'Expected Arrival',
        description: 'Estimated arrival at LA Port',
        timestamp: '2024-06-15T06:00:00Z',
        location: 'Los Angeles, USA',
        status: 'pending' as const,
        icon: 'schedule'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Bill of Lading',
        type: 'BOL',
        size: '245 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      },
      {
        id: '2',
        name: 'Commercial Invoice',
        type: 'INV',
        size: '189 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      },
      {
        id: '3',
        name: 'Packing List',
        type: 'PKL',
        size: '156 KB',
        uploadDate: '2024-06-01T00:00:00Z',
        url: '#'
      }
    ]
  };

  const handleCopyTracking = () => {
    if (shipmentData?.trackingNumber) {
      navigator.clipboard.writeText(shipmentData.trackingNumber);
      toast.success('Tracking number copied!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Shipment ${shipmentData?.trackingNumber}`,
        text: `Track shipment ${shipmentData?.trackingNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!shipmentData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Shipment not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/shipments')}
          sx={{ mt: 2 }}
        >
          Back to Shipments
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard')}
          sx={{ textDecoration: 'none' }}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/shipments')}
          sx={{ textDecoration: 'none' }}
        >
          Shipments
        </Link>
        <Typography variant="body2" color="text.primary">
          {shipmentData.trackingNumber}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/shipments')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" fontWeight={700}>
                  {shipmentData.trackingNumber}
                </Typography>
                <IconButton size="small" onClick={handleCopyTracking}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusChip
                  status={shipmentData.status}
                  color={shipmentData.statusColor}
                />
                <Typography variant="body2" color="text.secondary">
                  Last updated: {format(new Date(shipmentData.lastUpdated), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Download Documents">
              <IconButton>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Key Information Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Route
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {shipmentData.origin.port}
                  </Typography>
                  <Box sx={{ my: 1, textAlign: 'center' }}>
                    <NavigateNext sx={{ color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {shipmentData.destination.port}
                  </Typography>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Schedule sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Timeline
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ETA
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(shipmentData.estimatedDelivery), 'MMM dd, yyyy')}
                  </Typography>
                  {shipmentData.actualDelivery && (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Delivered
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {format(new Date(shipmentData.actualDelivery), 'MMM dd, yyyy')}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShipping sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Carrier
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={shipmentData.carrier.logo}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {shipmentData.carrier.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Vessel: {shipmentData.carrier.vesselName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Voyage: {shipmentData.carrier.voyageNumber}
                  </Typography>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div whileHover={{ y: -4 }}>
              <GlassCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Value
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    ${shipmentData.cargo.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shipmentData.cargo.weight} {shipmentData.cargo.weightUnit}
                  </Typography>
                  <Chip
                    label={shipmentData.paymentStatus}
                    size="small"
                    color={shipmentData.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <GlassCard>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
          }}
        >
          <Tab label="Timeline" icon={<Timeline />} iconPosition="start" />
          <Tab label="Tracking Map" icon={<Map />} iconPosition="start" />
          <Tab label="Documents" icon={<Description />} iconPosition="start" />
          <Tab label="Events" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Shipment Timeline</Typography>
              {shipmentData.events.map((event, index) => (
                <Box key={event.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{event.description}</Typography>
                  <Typography variant="caption" color="text.disabled">
                    {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')} - {event.location}
                  </Typography>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ height: 600, position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              {/* Real Mapbox Maritime Map */}
              <MaritimeTrackingMap shipmentData={shipmentData} />
              
              {/* Enhanced Information Panels - Overlay on real map */}
              
              {/* Navigation Status */}
              <Paper sx={{ 
                position: 'absolute',
                top: 20,
                right: 20,
                p: 2.5,
                minWidth: 200,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#0ea5e9' }}>
                  🚢 Navigation Status
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Total Distance: 8,547 nm
                  </Typography>
                  <Box sx={{ 
                    mt: 0.5, 
                    width: '100%', 
                    height: 4, 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      style={{
                        width: '60%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #059669 0%, #0ea5e9 100%)',
                        borderRadius: 2
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Completed: 5,128 nm (60%)
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Remaining: 3,419 nm (40%)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    ETA: {format(new Date(shipmentData.estimatedDelivery), 'MMM dd, yyyy')} • 06:00 PST
                  </Typography>
                </Box>
              </Paper>

              {/* Weather & Conditions */}
              <Paper sx={{ 
                position: 'absolute',
                bottom: 20,
                left: 20,
                p: 2,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#22d3ee' }}>
                  🌊 Maritime Conditions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.8)">
                      Weather: Fair
                    </Typography>
                    <Typography variant="caption" display="block" color="rgba(255,255,255,0.8)">
                      Sea State: Calm (2-3ft)
                    </Typography>
                    <Typography variant="caption" display="block" color="rgba(255,255,255,0.8)">
                      Wind: 12 knots SW
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.8)">
                      Visibility: 10+ nm
                    </Typography>
                    <Typography variant="caption" display="block" color="rgba(255,255,255,0.8)">
                      Current: 1.2 knots E
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#10b981' }}>
                      Status: Optimal
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Progress Timeline */}
              <Paper sx={{ 
                position: 'absolute',
                bottom: 20,
                right: 20,
                p: 2,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'white',
                minWidth: 200
              }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#a855f7' }}>
                  📍 Milestone Timeline
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="caption" color="#10b981">Jun 01 - Departed Shanghai</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563eb' }} />
                    <Typography variant="caption" color="#2563eb">Jun 08 - Pacific Transit</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">Jun 15 - Arrive LA</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Documents ({shipmentData.documents.length})</Typography>
              {shipmentData.documents.map((doc) => (
                <Box key={doc.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{doc.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.size} • {doc.type} • {format(new Date(doc.uploadDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<Download />}>Download</Button>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Events</Typography>
              <Typography variant="body2" color="text.secondary">
                Track all activities and updates for shipment {shipmentData.trackingNumber}
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </GlassCard>

      {/* Additional Information */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cargo Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Type"
                    secondary={shipmentData.cargo.type}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Description"
                    secondary={shipmentData.cargo.description}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Container"
                    secondary={`${shipmentData.container.number} (${shipmentData.container.type})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Seal Number"
                    secondary={shipmentData.container.sealNumber}
                  />
                </ListItem>
              </List>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Parties
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Shipper"
                    secondary={shipmentData.shipper}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Consignee"
                    secondary={shipmentData.consignee}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Incoterm"
                    secondary={shipmentData.incoterm}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reference Number"
                    secondary={shipmentData.referenceNumber}
                  />
                </ListItem>
              </List>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default ShipmentDetail;