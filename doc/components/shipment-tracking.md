# Shipment Tracking Components

Advanced components for real-time shipment tracking, visualization, and status management.

## ShipmentMap

Interactive Mapbox integration with real-time shipment tracking, custom markers, and route visualization.

### Location
`client/src/components/shipments/ShipmentMap.tsx`

### Features
- Mapbox GL JS integration
- Real-time shipment tracking
- Custom markers for origin/destination
- Animated route lines
- Interactive popups
- Map legend and controls

### Props
```typescript
interface ShipmentMapProps {
  shipments: Array<{
    id: string;
    trackingNumber: string;
    status: string;
    origin: {
      port: string;
      country: string;
      coordinates: { lat: number; lng: number };
    };
    destination: {
      port: string;
      country: string;
      coordinates: { lat: number; lng: number };
    };
    currentLocation?: {
      lat: number;
      lng: number;
      speed: number;
    };
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
}
```

### Usage
```tsx
import ShipmentMap from '@/components/shipments/ShipmentMap';

<ShipmentMap 
  shipments={shipmentsData}
  center={{ lat: 0, lng: 0 }}
  zoom={2}
/>
```

### Key Features
- **Mapbox Integration**: Professional mapping with custom styling
- **Custom Markers**: Color-coded markers for different locations
- **Route Visualization**: Dashed lines showing shipment routes
- **Real-time Tracking**: Animated markers for in-transit shipments
- **Interactive Popups**: Detailed information on marker click
- **Auto-fitting**: Automatically adjusts view to show all shipments

### Setup Requirements
```typescript
// Environment variable required
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### Marker Types
- **Origin**: Blue circle markers
- **Destination**: Green circle markers  
- **In Transit**: Animated blue aircraft icons with pulse effect

---

## ShipmentTimeline

Event timeline visualization with alternating layout and status-based color coding.

### Location
`client/src/components/shipments/ShipmentTimeline.tsx`

### Features
- Material-UI Lab Timeline integration
- Alternating timeline layout
- Status-based color coding
- Animated timeline dots
- Event completion tracking
- Interactive timeline cards

### Props
```typescript
interface ShipmentTimelineProps {
  events: Array<{
    id: string;
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
    description?: string;
  }>;
}
```

### Usage
```tsx
import ShipmentTimeline from '@/components/shipments/ShipmentTimeline';

<ShipmentTimeline events={timelineEvents} />
```

### Key Features
- **Timeline Layout**: Alternating left/right event positioning
- **Status Icons**: Contextual icons for different event types
- **Color Coding**: Success, primary, and grey states
- **Completion Tracking**: Visual indicators for completed events
- **Current Event**: Highlighted current status with pulse animation
- **Interactive Cards**: Hover effects and detailed information

### Event Icons
- **Booking Confirmed**: Assignment icon
- **Container Loaded**: Inventory icon
- **Vessel Departed**: DirectionsBoat icon
- **In Transit**: LocalShipping icon
- **Vessel Arrived**: Anchor icon
- **Delivered**: CheckCircle icon

---

## StatusChip

Reusable status component with flexible color and icon support for consistent status visualization.

### Location
`client/src/components/common/StatusChip.tsx`

### Features
- Flexible color system
- Icon support
- Multiple variants
- Theme integration
- Consistent styling

### Props
```typescript
interface StatusChipProps {
  status: string;
  color?: string;
  icon?: string | React.ReactElement;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}
```

### Usage
```tsx
import StatusChip from '@/components/common/StatusChip';

<StatusChip 
  status="In Transit"
  color={theme.palette.info.main}
  variant="filled"
  size="small"
/>
```

### Key Features
- **Flexible Colors**: Custom color support or theme defaults
- **Icon Integration**: Support for string or React element icons
- **Variants**: Filled and outlined styles
- **Size Options**: Small and medium sizes
- **Theme Aware**: Automatic theme color integration

### Common Use Cases
```tsx
// Status indicators
<StatusChip status="Delivered" color="success.main" />
<StatusChip status="Pending" color="warning.main" />
<StatusChip status="Delayed" color="error.main" />

// With icons
<StatusChip 
  status="In Transit" 
  icon={<LocalShipping />}
  color="info.main" 
/>
```

## Integration Patterns

### Real-time Updates
Components are designed to handle real-time data updates:

```tsx
// WebSocket integration example
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080/shipments');
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    updateShipmentLocation(update);
  };
  
  return () => ws.close();
}, []);
```

### Error Handling
```tsx
// Map error handling
useEffect(() => {
  if (!mapboxgl.accessToken) {
    console.error('Mapbox token not provided');
    return;
  }
  
  map.current = new mapboxgl.Map({
    // ... config
  });
  
  map.current.on('error', (e) => {
    console.error('Map error:', e);
  });
}, []);
```

### Performance Considerations
- **Marker Management**: Efficient adding/removing of map markers
- **Animation Optimization**: RequestAnimationFrame for smooth animations
- **Memory Cleanup**: Proper cleanup of map instances and event listeners
- **Debounced Updates**: Prevent excessive re-renders with rapid updates

## Styling Patterns

### Glass Morphism Effects
```tsx
sx={{
  bgcolor: 'background.paper',
  backdropFilter: 'blur(10px)',
  background: alpha(theme.palette.background.paper, 0.9),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}}
```

### Pulse Animations
```css
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
```

### Responsive Design
All components use Material-UI's responsive system:
- Breakpoint-aware layouts
- Mobile-optimized interactions
- Flexible container sizing
- Touch-friendly controls