# Magaya Client Dashboard

A modern, responsive client dashboard for Magaya logistics platform built with React, TypeScript, Node.js, and Express.

## Features

- 🚢 Real-time shipment tracking and management
- 📊 Comprehensive analytics and reporting
- 💰 Transaction and invoice management
- 🗺️ Interactive shipment maps
- 📱 Fully responsive design
- 🔐 Secure authentication with JWT
- 🎨 Beautiful UI with Material-UI and animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI v5
- React Query for data fetching
- Framer Motion for animations
- Recharts for data visualization
- React Router v6

### Backend
- Node.js with Express
- JWT authentication
- Mock data generation
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/magaya-client-dashboard.git
cd magaya-client-dashboard
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Environment Setup

1. Backend (.env):
```
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

2. Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

3. Open http://localhost:3000 in your browser

### Demo Credentials
- Email: demo@client1.com
- Password: demo123

## Deployment

### Backend (Railway)

1. Create a new project on Railway
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

## API Documentation

### Authentication
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/refresh` - Refresh token

### Shipments
- GET `/api/shipments` - Get all shipments
- GET `/api/shipments/:id` - Get shipment by ID
- GET `/api/shipments/track/:trackingNumber` - Track shipment
- GET `/api/shipments/:id/location` - Get real-time location

### Analytics
- GET `/api/analytics/overview` - Get analytics overview
- GET `/api/analytics/trends/monthly` - Get monthly trends
- GET `/api/analytics/routes/performance` - Get route performance

### Transactions
- GET `/api/transactions` - Get all transactions
- GET `/api/transactions/:id` - Get transaction by ID
- POST `/api/transactions/:id/mark-paid` - Mark as paid

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.