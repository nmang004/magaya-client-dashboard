# W.M. Stone Command Center - Claude Code Reference

## Project Overview
Modern logistics dashboard for W.M. Stone Logistics, LLC (since 1907) with React/TypeScript frontend and Node.js/Express backend. Features beautiful maritime-inspired UI/UX with W.M. Stone brand colors and Norfolk heritage.

## Quick Start
```bash
# Backend
cd server && npm install && npm run dev

# Frontend  
cd client && npm install && npm start

# Demo login
Email: demo@client1.com
Password: demo123
```

## Tech Stack

### Frontend
- **React 18 + TypeScript** - Core framework
- **Material-UI v5** - Component library
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Recharts** - Charts
- **Mapbox GL** - Maps
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Forms
- **date-fns** - Date utilities

### Backend
- **Node.js + Express** - Server framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Mock data** - Realistic shipping data
- **CORS enabled** for frontend

## W.M. Stone Brand Guidelines

### Brand Colors (MANDATORY)
- **Primary Navy Blue**: #1e3a8a (headers, primary buttons, active states)
- **Secondary Blue**: #1e40af (hover states, accents)
- **Success Green**: #059669 (delivered shipments, positive metrics)
- **Warning Orange**: #d97706 (pending shipments, alerts)
- **Error Red**: #dc2626 (issues, errors)
- **Info Blue**: #2563eb (active shipments, information)

### Brand Identity
- **Company**: W.M. Stone Logistics, LLC
- **Heritage**: Founded 1907 - Norfolk's first customs broker
- **Location**: Norfolk, Virginia (Port of Virginia)
- **Services**: Customs Clearance, Ocean Freight, Trucking, Global Forwarding

## Project Structure
```
wm-stone-command-center/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── shipments/   # Shipment components
│   │   │   └── transactions/# Transaction components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── styles/         # Global styles & theme
│   │   └── utils/          # Utility functions
│   └── public/
└── server/                   # Express backend
    ├── routes/              # API routes
    ├── middleware/          # Auth & error handling
    ├── mock-data/          # Data generators
    └── server.js           # Entry point
```

## Key Design Patterns

### 1. Glass Morphism Cards
```typescript
background: 'rgba(255, 255, 255, 0.7)',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255, 255, 255, 0.18)',
```

### 2. Gradient Buttons
```typescript
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
```

### 3. Animation Pattern
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
```

### 4. W.M. Stone Chart Colors
```typescript
const wmStoneColors = {
  primary: '#1e3a8a',
  secondary: '#1e40af',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#2563eb'
};
```

### 5. Loading States
- Use Skeleton components for loading
- Implement shimmer effects
- Show progress for long operations

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Shipments
- `GET /api/shipments` - List with filters
- `GET /api/shipments/:id` - Single shipment
- `GET /api/shipments/track/:trackingNumber` - Track
- `GET /api/shipments/:id/location` - Real-time location

### Analytics
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/trends/monthly` - Monthly data
- `GET /api/analytics/routes/performance` - Route metrics

### Transactions
- `GET /api/transactions` - List invoices
- `GET /api/transactions/:id` - Single transaction
- `POST /api/transactions/:id/mark-paid` - Update status

## Component Guidelines

### State Management
```typescript
// Use React Query for server state
const { data, isLoading } = useQuery(['key'], fetchFunction);

// Use useState for UI state
const [open, setOpen] = useState(false);

// Use Context for global app state
const { user } = useAuth();
```

### Error Handling
```typescript
// API interceptor handles errors globally
// Use toast notifications for user feedback
toast.success('Success message');
toast.error('Error message');
```

### Type Safety
```typescript
// Always define interfaces
interface ShipmentProps {
  shipment: Shipment;
  onUpdate?: (id: string) => void;
}

// Use proper types
const [value, setValue] = useState<string>('');
```

## Styling Best Practices

### Theme Usage
```typescript
const theme = useTheme();
// Use theme values
color: theme.palette.primary.main
boxShadow: theme.customShadows.card
```

### Responsive Design
```typescript
sx={{
  p: { xs: 2, md: 3 },
  fontSize: { xs: '1rem', md: '1.25rem' }
}}
```

### Hover Effects
```typescript
'&:hover': {
  transform: 'translateY(-4px)',
  boxShadow: theme.customShadows.primary,
}
```

## Performance Tips

### Lazy Load Pages
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Memoize Expensive Operations
```typescript
const memoizedValue = useMemo(() => computeExpensive(data), [data]);
```

### Debounce Search
```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

- Virtual Scrolling for large lists
- Image Optimization with lazy loading

## Mock Data Patterns

### Shipment Status Flow
Pending → Processing → In Transit → Customs → Delivered

### Data Generators
- `generateShipments(count, clientId)` - Create shipments
- `generateAnalytics(clientId)` - Dashboard stats
- `generateTransaction(shipmentId, index)` - Invoices

## Security Considerations
- **JWT Storage**: localStorage (consider httpOnly cookies for production)
- **API Rate Limiting**: Implemented on all endpoints
- **CORS**: Configured for specific origins
- **Input Validation**: Use Yup schemas
- **XSS Prevention**: React handles by default

## Deployment

### Frontend (Netlify)
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend (Railway)
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=your_token
```

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Common Issues & Solutions
- **CORS Errors**: Check allowed origins in server.js
- **Auth Token Expired**: Handled by axios interceptor
- **Map Not Loading**: Verify Mapbox token
- **Build Errors**: Clear node_modules and reinstall

## Testing Checklist
- ☐ Login/Logout flow
- ☐ Dashboard data loading
- ☐ Shipment filtering and search
- ☐ Map visualization
- ☐ Transaction management
- ☐ Responsive design on mobile
- ☐ Animation performance
- ☐ Error states

## Future Enhancements

### Real Magaya API Integration
- Replace mock data with actual API calls
- Implement OAuth flow

### PowerBI Embedding
- Add PowerBI Embedded SDK
- Configure row-level security

### WebSocket Integration
- Real-time shipment updates
- Live notifications

### Advanced Features
- Bulk operations
- Custom reports
- Email notifications
- Multi-language support

## Code Quality
- Run `npm run lint` before commits
- Follow TypeScript strict mode
- Use meaningful variable names
- Comment complex logic
- Keep components under 200 lines

## Git Workflow
```bash
git add .
git commit -m "feat: add shipment tracking"
git push origin main
```

## Support Resources
- **Material-UI Docs**: https://mui.com
- **React Query**: https://react-query.tanstack.com
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org

## Development Workflow

### Testing the Application
1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm start`
3. Login with demo credentials: `demo@client1.com` / `demo123`
4. Test all features: dashboard, shipments, analytics, transactions
5. Test responsive design on mobile devices

### Production Deployment
1. **Backend (Railway)**: Uses Dockerfile and railway.toml configuration
2. **Frontend (Netlify)**: Uses netlify.toml for build and deployment
3. **Environment Variables**: Set in production dashboards
4. **Testing**: Verify all endpoints and features work in production

### Final Project Status
✅ Complete full-stack W.M. Stone logistics dashboard
✅ Comprehensive TypeScript API service layer
✅ Production-ready deployment configuration
✅ Beautiful maritime-inspired UI with animations
✅ Mock data system for realistic testing
✅ Security best practices implemented
✅ Documentation and deployment guides

---

**Remember**: Focus on beautiful UI/UX with smooth animations and intuitive user experience. The dashboard should feel modern, responsive, and delightful to use.