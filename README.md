# JKTech Assignment

A full-stack application built with Angular frontend and Express/Node.js backend using TypeScript.

## Project Structure

The project consists of two main directories:

- `frontend/`: Angular application (v19.1.0)
- `backend/`: Express.js server with Prisma ORM

## Tech Stack

### Frontend

- Angular 19.1.0
- TypeScript
- RxJS
- Angular SSR (Server-Side Rendering)

### Backend

- Node.js with Express
- TypeScript
- Prisma ORM
- NeonDB (Serverless Postgres)
- Passport.js (Google OAuth)
- JWT Authentication
- Winston Logger

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or pnpm package manager

## Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Development

### Backend Scripts

Available scripts:

```bash
# Start development server
npm run dev

# Build the project
npm run build

# Database operations
npm run db-push     # Push schema changes to database
npm run db-seed     # Seed the database
npm run db-pull     # Pull database schema
npm run db-generate # Generate Prisma client

# Start production server
npm start
```

### Frontend Scripts

Available scripts:

```bash
# Start development server
npm start

# Build the project
npm run build

# Run tests
npm test

# Build in watch mode
npm run watch

# Serve SSR version
npm run serve:ssr:frontend
```

## Environment Setup

Create `.env` files in both frontend and backend directories with necessary environment variables.

### Backend Environment Variables

```env
DATABASE_URL=your_neon_db_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

## Features

- Server-Side Rendering (SSR) for improved performance and SEO
- Google OAuth integration for authentication
- JWT-based authentication
- Database integration with Prisma ORM
- TypeScript support for both frontend and backend
- Comprehensive logging with Winston

## Production Deployment

1. Build both frontend and backend:

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

1. Start the production server:

```bash
# Start backend
cd backend
npm start

# Serve frontend (SSR)
cd ../frontend
npm run serve:ssr:frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License
