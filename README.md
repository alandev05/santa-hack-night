# ElfShift - Workshop Scheduler

AI-powered shift management for Santa's Workshop. Because even elves need a break (and Santa needs his gifts delivered on time). Optimize assignments, prevent burnout, and keep the workshop running smoother than a reindeer on Christmas Eve.

## 🎄 Features

- **AI-Powered Scheduling**: Intelligent shift assignment algorithm that balances workload and prevents burnout
- **Burnout Prevention**: Real-time monitoring of elf burnout risk with alerts and recommendations
- **Real-Time Updates**: Live dashboard showing workshop status, station assignments, and order progress
- **Interactive Terminal**: Vintage-style terminal component with context-aware commands
- **Beautiful UI**: Cursor IDE-inspired dark theme with vintage Macintosh ad aesthetics
- **Authentication**: Secure login system with protected routes

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Component library

### Backend
- **Express.js** - Server framework
- **Vite** - Development server and build tool
- **TypeScript** - Type safety

### AI Agent (Optional)
- **Python** - AI scheduling agent
- **FastAPI** - Agent API server

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd santa-hack-night
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Python agent:
```bash
cd agent
pip install -r requirements.txt
```

## 🏃 Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Optional: Python Agent

To run the AI scheduling agent (optional, falls back to simple algorithm if not available):
```bash
npm run agent
```

The agent will run on `http://localhost:8001`

### Production Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 🔐 Authentication

### Login Credentials

- **Username**: `HoHo`
- **Password**: `Naughty Santa`

### Authentication Flow

1. Visit the landing page at `/`
2. Click "Login" or "Get Started"
3. Enter credentials on the login page
4. After successful login, you'll be redirected to the dashboard
5. All protected routes require authentication

### Protected Routes

The following routes require authentication:
- `/dashboard` - Main workshop dashboard
- `/schedule` - Shift schedule view
- `/alerts` - Burnout alerts and notifications

### Public Routes

These routes are accessible without authentication:
- `/` - Landing page
- `/login` - Login page

## 📄 Available Pages

### Landing Page (`/`)
- Public landing page with project overview
- Features section
- Call-to-action buttons
- Terminal preview

### Login Page (`/login`)
- Authentication form
- Username and password input
- Redirects to dashboard after successful login
- Redirects to dashboard if already authenticated

### Dashboard (`/dashboard`)
- **Protected Route** - Requires authentication
- Overview of workshop operations
- Key statistics (total elves, active stations, high-risk alerts, pending orders)
- Station status cards
- Elf roster table
- Interactive terminal component
- Generate schedule button

### Schedule (`/schedule`)
- **Protected Route** - Requires authentication
- Station-based schedule view
- Timeline visualization
- Risk level indicators
- Interactive terminal component

### Alerts (`/alerts`)
- **Protected Route** - Requires authentication
- Burnout risk alerts
- Alert statistics
- Unresolved and resolved alerts
- Burnout risk breakdown formula
- Interactive terminal component

### 404 Page
- Shown for unknown routes
- Navigation options to return home or go back

## 🎨 Theme & Design

The application features a beautiful dark theme inspired by:
- **Cursor IDE** - Deep backgrounds, subtle borders, polished developer-focused look
- **Vintage Macintosh Ads** - Clean, minimalist aesthetic with vintage charm

### Color Scheme
- Dark blue-gray backgrounds (`hsl(222, 14%, 10%)`)
- Subtle borders and accents
- High contrast text for readability
- Smooth transitions and hover effects

## 🛠️ Development

### Project Structure

```
santa-hack-night/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express server
│   ├── routes.ts        # API routes
│   ├── vite.ts          # Vite configuration
│   └── index.ts         # Server entry point
├── agent/               # Python AI agent (optional)
│   ├── main.py          # FastAPI server
│   └── burnout.py       # Burnout calculation logic
└── shared/              # Shared TypeScript types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run agent` - Start Python agent server

## 🔧 API Endpoints

### Elves
- `GET /api/elves` - Get all elves
- `GET /api/elves/:id` - Get specific elf

### Stations
- `GET /api/stations` - Get all stations with current staff counts

### Schedule
- `GET /api/schedule` - Get current schedule
- `POST /api/schedule/generate` - Generate new schedule

### Alerts
- `GET /api/alerts` - Get all burnout alerts

### Orders
- `GET /api/orders` - Get all orders

## 🎯 Key Features

### Terminal Component
Interactive terminal available on dashboard, schedule, and alerts pages with commands:
- `help` - Show available commands
- `status` - Show system status
- `elves` - List all elves
- `stations` - List all stations
- `schedule` - Show current schedule
- `alerts` - Show active alerts
- `clear` - Clear terminal

### Burnout Prevention
- Real-time burnout risk calculation
- Alert system for high-risk elves
- Workload balancing in schedule generation
- Visual indicators for risk levels

### Schedule Generation
- AI-powered algorithm (if Python agent available)
- Fallback to simple algorithm
- Considers burnout risk, skills, and station requirements
- Generates alerts for potential issues

## 📝 Notes

- Authentication is stored in localStorage (client-side only)
- The Python agent is optional - the app works with a fallback algorithm
- All routes are client-side routed using Wouter
- The app uses React Query for efficient data fetching and caching

## 🎄 License

MIT

---

**Built with ❤️ for Santa's Workshop**

