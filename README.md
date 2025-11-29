# SCMTP Frontend

A modern, beautiful frontend for the Smart City Mobility & Transport Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Beautiful UI/UX** - Modern design with smooth animations
- 🔐 **Authentication** - Login and registration with JWT
- 🗺️ **Route Browsing** - GraphQL integration for routes and schedules
- 🎫 **Ticket Booking** - Seamless booking flow with payment integration
- 💰 **Wallet Management** - Top-up, view balance, and transaction history
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Live data updates and status polling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **GraphQL**: Apollo Client
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3000
NEXT_PUBLIC_ROUTE_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_TICKETING_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_WALLET_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_TRACKING_SERVICE_URL=http://localhost:50051
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── dashboard/   # Dashboard page
│   ├── routes/      # Routes browsing and booking
│   ├── tickets/     # Ticket management
│   ├── wallet/      # Wallet management
│   ├── profile/     # User profile
│   ├── login/       # Login page
│   └── register/    # Registration page
├── components/       # Reusable components
├── lib/             # Utilities and API clients
│   ├── api.ts       # API service functions
│   ├── store.ts     # Zustand state management
│   └── graphql/     # GraphQL queries
└── styles/          # Global styles
```

## Features Overview

### Authentication
- User registration with wallet auto-creation
- Secure login with JWT tokens
- Protected routes with authentication checks

### Route Management
- Browse all available routes
- View schedules and stops
- Search functionality
- GraphQL integration for efficient data fetching

### Ticket Booking
- Select route and schedule
- Enter passenger details
- Real-time payment processing
- Status polling for booking confirmation

### Wallet Management
- View current balance
- Top-up with quick amount buttons
- Transaction history
- Statistics and analytics

### Dashboard
- Overview of account status
- Quick actions
- Recent tickets
- Statistics cards

## API Integration

The frontend integrates with all backend microservices:

- **User Service**: Authentication and profile management
- **Route Service**: GraphQL queries for routes and schedules
- **Ticketing Service**: Ticket booking and management
- **Payment Service**: Payment orchestration (Saga)
- **Wallet Service**: Wallet operations and transactions

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

All service URLs can be configured via environment variables. See `.env.example` for reference.

## License

MIT

