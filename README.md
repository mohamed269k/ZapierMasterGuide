# Zapier Automations Guide

A comprehensive web application showcasing the top 30 Zapier automations with detailed guides, search functionality, and professional documentation layout.

## Features

- **30 Essential Automations**: Curated collection of the most effective Zapier automations
- **5 Categories**: Marketing, Sales, Project Management, Content Creation, Personal Productivity
- **Search & Filter**: Advanced search functionality with category filtering
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **Step-by-Step Guides**: Detailed instructions for each automation
- **Pro Tips**: Expert advice to maximize automation effectiveness

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd zapier-automations-guide
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build command to `npm run build`
4. Set output directory to `dist`
5. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set up serverless functions for API routes (optional)

### Railway/Render

1. Connect your GitHub repository
2. Set build command to `npm run build`
3. Set start command to `npm start`
4. Add environment variables if using database

## Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string (optional)
NODE_ENV=production
```

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── lib/         # Utilities
│   │   └── hooks/       # Custom hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data layer
├── shared/              # Shared types
└── dist/                # Built files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details