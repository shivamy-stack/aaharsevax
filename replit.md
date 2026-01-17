# AharSetu - Food Donation Platform

## Overview

AharSetu is a food redistribution platform that connects food donors with NGOs in need. The application enables individuals and organizations to donate surplus food while allowing NGOs to submit food requests. An admin dashboard provides real-time visibility into donations and requests across multiple Indian cities.

The name "AharSetu" combines Hindi words meaning "Food Bridge" - bridging the gap between food abundance and hunger.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI effects
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (compiled with tsx)
- **API Design**: RESTful endpoints with Zod schema validation
- **Build Process**: esbuild for production bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: drizzle-zod for automatic schema-to-validation conversion
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and Zod validation schemas
- `routes.ts`: API route definitions with input/output types

### Key Design Decisions

**Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories enables type safety across the full stack without separate packages.

**Schema-First Validation**: Using drizzle-zod generates validation schemas directly from database definitions, ensuring consistency between database constraints and API validation.

**Component Library**: shadcn/ui provides accessible, customizable components built on Radix UI primitives, configured via `components.json`.

## External Dependencies

### Database
- PostgreSQL database (required)
- Connection string via `DATABASE_URL` environment variable
- Schema migrations in `./migrations` directory via drizzle-kit

### Third-Party Libraries
- **@tanstack/react-query**: Async state management and caching
- **drizzle-orm / drizzle-kit**: Database ORM and migration tools
- **zod**: Runtime type validation
- **react-hook-form**: Form state management with @hookform/resolvers
- **date-fns**: Date formatting utilities
- **framer-motion**: Animation library

### Development Tools
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server code
- **Replit plugins**: Dev banner and cartographer for Replit environment