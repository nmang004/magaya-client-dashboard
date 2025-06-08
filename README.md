# Magaya Client Dashboard

## Project Overview

The Magaya Client Dashboard is a modern web application designed to provide clients with a comprehensive interface for managing and tracking their logistics operations. This full-stack application offers real-time visibility into shipments, inventory, and related logistics data.

## Tech Stack

### Frontend
- React.js
- Modern JavaScript (ES6+)
- CSS3 with responsive design

### Backend
- Node.js
- Express.js
- JWT authentication
- RESTful API architecture

### Security & Middleware
- Helmet.js for security headers
- CORS for cross-origin resource sharing
- Express Rate Limiting for API protection
- bcrypt for password hashing
- JSON Web Tokens for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd magaya-client-dashboard
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Configure environment variables:
- Copy `.env.example` to `.env` in the server directory
- Update the environment variables with your specific values

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend application:
```bash
cd client
npm start
```

The backend server will run on http://localhost:5000 and the frontend on http://localhost:3000

## Deployment

### Production Build

1. Build the client application:
```bash
cd client
npm run build
```

2. Configure production environment variables on your hosting platform

3. Deploy the server application with production settings

### Environment Variables
Ensure all necessary environment variables are properly configured in production:
- `JWT_SECRET`: Use a strong, unique secret key
- `NODE_ENV`: Set to "production"
- `CLIENT_URL`: Update to match your production frontend URL

### Security Considerations
- Always use HTTPS in production
- Keep dependencies updated
- Implement proper logging and monitoring
- Regular security audits