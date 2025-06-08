# Component Index

Quick reference guide for all custom components in the Magaya Client Dashboard.

## Dashboard Widgets

| Component | Location | Purpose | Key Features |
|-----------|----------|---------|--------------|
| **RecentShipments** | `components/dashboard/` | Display recent shipment list | Status indicators, progress tracking, animations |
| **ActivityTimeline** | `components/dashboard/` | Show chronological activities | Color-coded events, icon system, timeline layout |
| **RoutePerformance** | `components/dashboard/` | Route metrics and KPIs | Performance indicators, data table, glass styling |
| **RevenueChart** | `components/dashboard/` | Revenue breakdown visualization | Pie chart, custom tooltips, Recharts integration |
| **GlassCard** | `components/common/Cards/` | Reusable glass morphism container | Backdrop blur, gradients, motion support |

## Shipment Tracking

| Component | Location | Purpose | Key Features |
|-----------|----------|---------|--------------|
| **ShipmentMap** | `components/shipments/` | Interactive shipment tracking map | Mapbox integration, custom markers, route visualization |
| **ShipmentTimeline** | `components/shipments/` | Event timeline for shipments | Alternating layout, status tracking, completion indicators |
| **StatusChip** | `components/common/` | Consistent status display | Flexible colors, icon support, theme integration |

## Utility Components

| Component | Location | Purpose | Key Features |
|-----------|----------|---------|--------------|
| **ExportDialog** | `components/common/` | Data export functionality | Format selection, configurable options, animations |

## Hooks

| Hook | Location | Purpose | Key Features |
|------|----------|---------|--------------|
| **useDebounce** | `hooks/` | Performance optimization | Generic typing, configurable delay, memory safe |

## Import Paths

### Dashboard Widgets
```typescript
import RecentShipments from '@/components/dashboard/RecentShipments';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import RoutePerformance from '@/components/dashboard/RoutePerformance';
import RevenueChart from '@/components/dashboard/RevenueChart';
import GlassCard from '@/components/common/Cards/GlassCard';
```

### Shipment Tracking
```typescript
import ShipmentMap from '@/components/shipments/ShipmentMap';
import ShipmentTimeline from '@/components/shipments/ShipmentTimeline';
import StatusChip from '@/components/common/StatusChip';
```

### Utility Components
```typescript
import ExportDialog from '@/components/common/ExportDialog';
```

### Hooks
```typescript
import { useDebounce } from '@/hooks/useDebounce';
```

## Component Categories by Use Case

### Data Visualization
- **RevenueChart**: Financial data visualization
- **RoutePerformance**: Metrics and KPI display
- **ActivityTimeline**: Chronological data presentation

### Real-time Tracking
- **ShipmentMap**: Geographic tracking
- **ShipmentTimeline**: Status progression
- **RecentShipments**: Live status updates

### User Interface
- **GlassCard**: Modern container styling
- **StatusChip**: Consistent status indicators
- **ExportDialog**: Data export workflows

### Performance
- **useDebounce**: Input optimization
- **GlassCard**: Efficient animations

## Dependencies by Component

### External Dependencies
| Component | Dependencies |
|-----------|--------------|
| **ShipmentMap** | `mapbox-gl`, `@types/mapbox-gl` |
| **RevenueChart** | `recharts` |
| **ShipmentTimeline** | `@mui/lab`, `date-fns` |
| **All Components** | `@mui/material`, `framer-motion` |

### Environment Variables
```bash
# Required for ShipmentMap
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

## Animation Patterns

### Entry Animations
```typescript
// Staggered entry (used in most components)
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1 }}
```

### Hover Effects
```typescript
// Subtle hover interactions
whileHover={{ scale: 1.02, y: -2 }}
transition={{ duration: 0.2 }}
```

### Button Interactions
```typescript
// Enhanced button feedback
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## Theme Integration

All components support:
- **Material-UI Theme**: Automatic color inheritance
- **Dark/Light Mode**: Theme-aware styling
- **Custom Shadows**: Enhanced depth effects
- **Alpha Transparency**: Modern glass effects
- **Responsive Design**: Breakpoint-aware layouts

## Common Props Patterns

### Status-based Props
```typescript
interface StatusProps {
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  color?: string;
}
```

### Animation Props
```typescript
interface AnimationProps {
  delay?: number;
  duration?: number;
  stagger?: boolean;
}
```

### Theme Props
```typescript
interface ThemeProps {
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
}
```

## Testing Components

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import RecentShipments from './RecentShipments';

test('renders shipment list', () => {
  const mockShipments = [
    { id: '1', trackingNumber: 'TEST001', status: 'In Transit' }
  ];
  
  render(
    <ThemeProvider theme={theme}>
      <RecentShipments shipments={mockShipments} />
    </ThemeProvider>
  );
  
  expect(screen.getByText('TEST001')).toBeInTheDocument();
});
```

### Hook Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

test('debounces value changes', async () => {
  const { result, rerender } = renderHook(
    ({ value, delay }) => useDebounce(value, delay),
    { initialProps: { value: 'initial', delay: 100 } }
  );
  
  expect(result.current).toBe('initial');
});
```

## Performance Guidelines

### Optimization Tips
1. **Use React.memo** for expensive components
2. **Implement useCallback** for event handlers
3. **Debounce user inputs** with useDebounce hook
4. **Lazy load** heavy components
5. **Optimize animations** with appropriate timing

### Memory Management
- Clean up timers and intervals
- Remove event listeners on unmount
- Clear map instances and markers
- Dispose of heavy objects

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+
- **Mobile**: iOS 13+, Android 8+
- **Features**: Full ES6+ support required
- **Polyfills**: None required for modern targets