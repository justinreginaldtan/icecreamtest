# Sweet Solutions Frontend

Internal scheduling and payroll management frontend for Howdy Homemade Ice Cream.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: Radix UI + Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context
- **API**: REST API client

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment variables:
```bash
cp env.example .env.local
```

3. Update `.env.local` with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
app/
├── (auth)/              # Authentication routes
├── (dashboard)/         # Protected dashboard routes
├── globals.css         # Global styles
└── layout.tsx          # Root layout

components/
├── ui/                 # shadcn/ui components
├── layout/             # Layout components
├── features/           # Feature-specific components
└── common/             # Shared components

lib/
├── api/               # API client
├── auth/              # Authentication logic
├── utils/             # Utility functions
└── constants/         # App constants

hooks/                 # Custom React hooks
types/                 # TypeScript type definitions
```

## Features

- **Authentication**: Role-based access (Manager/Employee)
- **Dashboard**: Overview with key metrics
- **Schedule**: Weekly shift management
- **Employees**: Team directory
- **Requests**: Time-off request management
- **Payroll**: Compensation tracking (Manager only)
- **Settings**: Account preferences (Manager only)

## API Integration

The frontend communicates with the backend via REST API:

- **Base URL**: `NEXT_PUBLIC_API_URL` environment variable
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Centralized error handling with toast notifications

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
