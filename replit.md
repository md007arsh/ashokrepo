# ShopEase E-commerce Application

## Overview

ShopEase is a modern e-commerce web application built with a full-stack TypeScript architecture. It features a React frontend with shadcn/ui components, an Express.js backend, and uses Drizzle ORM for database management. The application supports product browsing, shopping cart functionality, order management, and an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: 
  - React Context for cart state
  - TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for products, orders, and admin functions
- **Storage**: PostgreSQL database with Drizzle ORM for persistent data storage
- **Database**: Neon PostgreSQL with connection pooling and type-safe queries
- **Middleware**: JSON parsing, URL encoding, request logging with response time tracking

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Three main entities:
  - `users`: Admin authentication
  - `products`: Product catalog with images, descriptions, and pricing
  - `orders`: Customer orders with JSON-stored line items
- **Migrations**: Configured to output to `./migrations` directory

## Key Components

### Client-Side Components
- **ProductCard**: Displays product information with add-to-cart functionality
- **Cart**: Slide-out shopping cart with quantity management
- **CheckoutModal**: Customer information form for order placement
- **OrderConfirmation**: Success notification with order tracking
- **AdminDashboard**: Product management interface with CRUD operations

### Server-Side Components
- **Routes**: RESTful API endpoints with proper error handling
- **Storage Interface**: Abstracted data layer supporting multiple storage backends
- **Request Logging**: Detailed API request tracking with response times
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Shared Components
- **Schema Definitions**: Drizzle table schemas with TypeScript types
- **Validation**: Zod schemas for runtime type checking
- **Type Safety**: Shared types between client and server

## Data Flow

### Product Management
1. Admin creates/updates products through dashboard
2. Products stored with validation via Zod schemas
3. Frontend fetches products via TanStack Query
4. Products displayed in responsive grid layout

### Shopping Cart
1. Products added to cart via React Context
2. Cart state persists during session
3. Quantity updates trigger re-renders
4. Cart totals calculated in real-time

### Order Processing
1. Customer fills checkout form with validation
2. Order data submitted to backend API
3. Unique order number generated
4. Order confirmation displayed to customer

### Admin Authentication
1. Simple username/password authentication
2. Session stored in localStorage
3. Protected routes redirect unauthenticated users
4. Admin dashboard provides product management

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data and State
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Fast development server and bundler
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production

### Database
- **Neon Database**: Serverless PostgreSQL (configured but not required)
- **connect-pg-simple**: PostgreSQL session store (for future session management)

## Deployment Strategy

### Development Mode
- Vite dev server for frontend with HMR
- TSX for running TypeScript server files
- Development-specific middleware and logging
- Environment-based configuration

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles server code to single file
- Static file serving integrated with Express
- Environment variable configuration for database

### Environment Configuration
- Database URL required for PostgreSQL connection
- Development vs production environment detection
- Replit-specific integration for cloud deployment

### Build Process
1. `npm run build`: Compiles both frontend and backend
2. Frontend assets output to `dist/public`
3. Server bundle output to `dist/index.js`
4. `npm start`: Runs production server

The application is designed to be easily deployable on platforms like Replit, with automatic database provisioning and environment configuration.