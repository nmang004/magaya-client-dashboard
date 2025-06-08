# Dashboard Widget Components

Beautiful, animated dashboard widgets for displaying key metrics and data visualization.

## RecentShipments

Interactive shipment list component with status indicators and navigation.

### Location
`client/src/components/dashboard/RecentShipments.tsx`

### Features
- Real-time shipment status tracking
- Interactive hover effects
- Status-based color coding
- Navigation to detailed views
- Staggered entry animations

### Props
```typescript
interface RecentShipmentsProps {
  shipments: Array<{
    id: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed';
    estimatedDelivery: string;
    progress: number;
  }>;
}
```

### Usage
```tsx
import RecentShipments from '@/components/dashboard/RecentShipments';

<RecentShipments shipments={shipmentsData} />
```

### Key Features
- **Status Colors**: Dynamic color coding based on shipment status
- **Progress Tracking**: Visual progress indicators
- **Animations**: Framer Motion staggered animations with hover effects
- **Navigation**: Click handlers for detailed shipment views

---

## ActivityTimeline

Timeline view of activities with color-coded events and motion animations.

### Location
`client/src/components/dashboard/ActivityTimeline.tsx`

### Features
- Chronological activity display
- Color-coded event types
- Icon-based activity indicators
- Animated timeline dots
- Responsive timeline layout

### Props
```typescript
interface ActivityTimelineProps {
  activities: Array<{
    id: string;
    type: 'shipment' | 'payment' | 'document' | 'notification';
    title: string;
    description: string;
    timestamp: string;
    color: 'primary' | 'success' | 'warning' | 'error';
    icon: React.ReactNode;
  }>;
}
```

### Usage
```tsx
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

<ActivityTimeline activities={activitiesData} />
```

### Key Features
- **Timeline Layout**: Material-UI Lab Timeline components
- **Dynamic Icons**: Customizable activity icons
- **Color Theming**: Theme-aware color system
- **Animations**: Staggered entry with pulse effects

---

## RoutePerformance

Table component showing route metrics with performance indicators.

### Location
`client/src/components/dashboard/RoutePerformance.tsx`

### Features
- Route performance metrics
- On-time delivery rates
- Interactive data table
- Performance indicators
- Glass morphism styling

### Props
```typescript
interface RoutePerformanceProps {
  routes: Array<{
    id: string;
    name: string;
    origin: string;
    destination: string;
    totalShipments: number;
    onTimeRate: number;
    avgDuration: string;
    revenue: number;
  }>;
}
```

### Usage
```tsx
import RoutePerformance from '@/components/dashboard/RoutePerformance';

<RoutePerformance routes={routesData} />
```

### Key Features
- **Performance Metrics**: On-time delivery tracking
- **Progress Bars**: Visual performance indicators
- **Interactive Rows**: Hover effects and click handlers
- **Responsive Design**: Mobile-friendly table layout

---

## RevenueChart

Pie chart component using Recharts with custom tooltips and revenue breakdown.

### Location
`client/src/components/dashboard/RevenueChart.tsx`

### Features
- Revenue breakdown visualization
- Interactive pie chart
- Custom tooltips
- Animated chart loading
- Responsive chart sizing

### Props
```typescript
interface RevenueChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  total?: number;
}
```

### Usage
```tsx
import RevenueChart from '@/components/dashboard/RevenueChart';

<RevenueChart data={revenueData} total={totalRevenue} />
```

### Key Features
- **Recharts Integration**: Professional chart components
- **Custom Tooltips**: Styled hover information
- **Color Theming**: Theme-aware chart colors
- **Animations**: Smooth chart transitions

---

## GlassCard

Reusable glass morphism card component with motion animations.

### Location
`client/src/components/common/Cards/GlassCard.tsx`

### Features
- Glass morphism effects
- Backdrop blur styling
- Customizable gradients
- Motion animations
- Flexible content layout

### Props
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  gradient?: boolean;
  blur?: boolean;
  elevation?: number;
  sx?: object;
}
```

### Usage
```tsx
import GlassCard from '@/components/common/Cards/GlassCard';

<GlassCard gradient blur>
  <CardContent>
    // Your content here
  </CardContent>
</GlassCard>
```

### Key Features
- **Glass Effects**: Backdrop blur and transparency
- **Gradient Backgrounds**: Optional gradient overlays
- **Motion Support**: Framer Motion integration
- **Theme Integration**: Material-UI theme system
- **Flexible Styling**: Customizable appearance

## Common Patterns

### Animation Timing
All dashboard widgets use consistent animation timing:
- Entry animations: 0.1s stagger delay
- Hover effects: 0.2s duration
- Loading states: Coordinated timing

### Theme Integration
Components automatically inherit:
- Color palette from Material-UI theme
- Custom shadows and gradients
- Alpha transparency effects
- Responsive breakpoints

### Performance Optimization
- React.memo for expensive components
- Optimized animation frames
- Efficient re-rendering patterns
- Debounced user interactions