# Magaya Client Dashboard Documentation

## Overview

This documentation covers all the custom components, hooks, and utilities created for the Magaya Client Dashboard application. The dashboard is built with React 18, TypeScript, Material-UI v5, and Framer Motion for animations.

## Architecture

- **Frontend**: React 18 + TypeScript
- **UI Library**: Material-UI v5
- **Animations**: Framer Motion
- **Mapping**: Mapbox GL JS
- **Charts**: Recharts
- **State Management**: React Hooks + Context

## Component Categories

### 1. Dashboard Widgets
Interactive dashboard components with animations and real-time data visualization.

- [RecentShipments](./components/dashboard-widgets.md#recentshipments)
- [ActivityTimeline](./components/dashboard-widgets.md#activitytimeline)
- [RoutePerformance](./components/dashboard-widgets.md#routeperformance)
- [RevenueChart](./components/dashboard-widgets.md#revenuechart)
- [GlassCard](./components/dashboard-widgets.md#glasscard)

### 2. Shipment Tracking
Components for real-time shipment tracking and visualization.

- [ShipmentMap](./components/shipment-tracking.md#shipmentmap)
- [ShipmentTimeline](./components/shipment-tracking.md#shipmenttimeline)
- [StatusChip](./components/shipment-tracking.md#statuschip)

### 3. Utility Components & Hooks
Reusable utilities for performance and functionality enhancement.

- [useDebounce Hook](./hooks/use-debounce.md)
- [ExportDialog](./components/utility-components.md#exportdialog)

## Design System

### Theme Integration
All components use Material-UI's theme system with:
- Custom color palettes
- Alpha transparency effects
- Glass morphism styling
- Responsive design patterns

### Animation Patterns
Consistent animation system using Framer Motion:
- Staggered entry animations
- Hover effects and micro-interactions
- Loading states and transitions
- Performance-optimized animations

## File Structure

```
client/src/
├── components/
│   ├── dashboard/
│   │   ├── RecentShipments.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── RoutePerformance.tsx
│   │   └── RevenueChart.tsx
│   ├── shipments/
│   │   ├── ShipmentMap.tsx
│   │   └── ShipmentTimeline.tsx
│   └── common/
│       ├── Cards/
│       │   └── GlassCard.tsx
│       ├── StatusChip.tsx
│       └── ExportDialog.tsx
└── hooks/
    └── useDebounce.ts
```

## Getting Started

1. **Installation**: All components use existing dependencies
2. **Usage**: Import components and use with TypeScript interfaces
3. **Theming**: Components automatically inherit Material-UI theme
4. **Animations**: Framer Motion animations are built-in

## Performance Considerations

- Components use React.memo where appropriate
- Debounced inputs for search and API calls
- Optimized animation timing
- Lazy loading for heavy components

## Contributing

When adding new components:
1. Follow TypeScript strict typing
2. Use Material-UI theme system
3. Include Framer Motion animations
4. Add proper documentation
5. Test responsive behavior