# REST Express Application with React Frontend

## Overview

This is a full-stack web application built with Express.js backend and React frontend, focusing on automation workflows management. The application provides a comprehensive system for browsing, searching, and managing automation templates across different categories like marketing, sales, project management, content creation, and productivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES Modules (ESM)
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in `shared/schema.ts` with two main tables:
  - `automations`: Stores automation templates with categories, descriptions, and metadata
  - `users`: Basic user management structure
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect

### API Layer
- **RESTful API**: Express routes handling automation CRUD operations
- **Endpoints**:
  - `GET /api/automations` - Retrieve all automations
  - `GET /api/automations/category/:category` - Filter by category
  - `GET /api/automations/search` - Search functionality
  - `GET /api/automations/:id` - Get specific automation
- **Storage**: Abstracted through IStorage interface with in-memory implementation for development

### Frontend Components
- **Automation Cards**: Display automation templates with badges, app integrations, and descriptions
- **Search & Filter**: Sidebar with category filtering and text search
- **Responsive Design**: Mobile-friendly layout with sheet components for mobile navigation
- **UI Components**: Comprehensive set of accessible components from Radix UI

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM manages database interactions
4. **Response Handling**: JSON responses with proper error handling and logging
5. **State Management**: TanStack Query manages caching and synchronization

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Connection**: Using `@neondatabase/serverless` driver
- **Environment**: `DATABASE_URL` environment variable required

### UI Framework
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with HMR

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- **Development**: `NODE_ENV=development` with Vite dev server
- **Production**: `NODE_ENV=production` with bundled assets
- **Database**: PostgreSQL connection via `DATABASE_URL`

### Scripts
- `dev`: Development server with hot reload
- `build`: Production build for both frontend and backend
- `start`: Production server
- `db:push`: Database schema synchronization

The application is designed for deployment on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.