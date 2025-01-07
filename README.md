# Financial Data Filter App

A web application for filtering and analyzing Apple Inc.'s financial data using the Financial Modeling Prep API.

## Features

- Display annual income statements in a responsive table
- Filter data by date range, revenue, and net income
- Sort data by any column (date, revenue, net income, etc.)
- Server-side filtering and sorting for better performance
- Mobile-friendly design using TailwindCSS

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Financial Modeling Prep API key

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install Python dependencies
   cd api
   pip install -r requirements.txt
   cd ..
   ```
3. Create a `.env` file in the root directory and add your API key:
   ```
   FMP_API_KEY=your_api_key_here
   ```
4. Start the development servers:
   ```bash
   # Terminal 1: Start the Next.js frontend
   npm run dev

   # Terminal 2: Start the Python backend
   cd api
   python local_server.py
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
data-filter-app/
├── api/                    # Vercel serverless functions
│   ├── income-statements.py  # Income statements endpoint
│   ├── local_server.py      # Local development server
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/                # Utility functions and API client
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── vercel.json            # Vercel deployment configuration
```

## Tech Stack

### Frontend
- Next.js 13+ with App Router
- TypeScript for type safety
- TailwindCSS for styling
- React Query for data fetching and caching
- shadcn/ui for UI components

### Backend
- Python serverless functions
- Vercel for deployment and hosting
- Financial Modeling Prep API for financial data

## API Endpoints

### GET /api/income-statements
Fetches and filters income statement data for Apple Inc.

Query Parameters:
- `start_year`: Filter by start year (inclusive)
- `end_year`: Filter by end year (inclusive)
- `min_revenue`: Minimum revenue filter
- `max_revenue`: Maximum revenue filter
- `min_net_income`: Minimum net income filter
- `max_net_income`: Maximum net income filter
- `sort_field`: Field to sort by (e.g., 'date', 'revenue', 'netIncome')
- `sort_direction`: Sort direction ('asc' or 'desc')

## Development

### Local Development
The app uses two development servers:
1. Next.js frontend server (port 3000)
2. Python backend server (port 8000)

To test the serverless functions locally:
1. Make sure you have Python 3.8+ installed
2. Install Python dependencies: `pip install -r api/requirements.txt`
3. Start the local Python server: `python api/local_server.py`
4. The backend will be available at `http://localhost:8000`

### Production Build
- Run `npm run build` to create a production build
- Run `npm run lint` to check for code style issues

## Deployment

The app is configured for deployment on Vercel:

1. Push code to GitHub
2. Create a new project on Vercel
3. Connect your repository
4. Add your `FMP_API_KEY` to the Environment Variables
5. Deploy!!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
