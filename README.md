# Financial Data Filter App

A web application for filtering and analyzing Apple Inc.'s financial data using the Financial Modeling Prep API.

## Live Demo

Visit the live application at: [https://data-filter-app.vercel.app](https://data-filter-app.vercel.app)

## Features

- Display annual income statements in a responsive table and card view
- **Server-Side Filtering and Sorting**
  - Efficient data processing directly on the backend
  - Reduces client-side computational overhead
  - Supports complex filtering and sorting operations
- Filter data by:
  - Date range (Year)
  - Revenue range
  - Net Income range
- Sort data by:
  - Date (ascending/descending)
  - Revenue (ascending/descending)
  - Net Income (ascending/descending)
- Mobile-friendly design using TailwindCSS
- Interactive UI with table and card views

## Server-Side Filtering and Sorting

### How It Works
- All filtering and sorting operations are performed on the Python backend
- Reduces client-side data processing and improves performance
- Supports complex, multi-parameter filtering
- Minimizes data transfer by filtering data before sending to the client

### Filtering Capabilities
- **Date Range Filtering**
  - Filter income statements by start and end years
  - Precise year-based selection
- **Revenue Filtering**
  - Set minimum and maximum revenue thresholds
  - Easily find statements within specific revenue ranges
- **Net Income Filtering**
  - Define net income boundaries
  - Identify financial periods meeting specific profitability criteria

### Sorting Mechanisms
- Dynamic sorting across multiple fields
- Support for ascending and descending order
- Efficient sorting directly in the backend
- Minimal client-side computational overhead

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Financial Modeling Prep API key

## Project Structure

```
data-filter-app/
├── api/                    # Vercel serverless functions
│   └── income-statements.py  # Income statements endpoint
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/                # Utility functions and API client
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── vercel.json            # Vercel deployment configuration
```

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/calvin-www/data-filter-app.git
   cd data-filter-app
   ```

2. Install dependencies
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

## API Endpoint

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

### Production Build
- Run `npm run build` to create a production build
- Run `npm run lint` to check for code style issues

## Deployment

The app is configured for deployment on Vercel:
1. Push code to GitHub
2. Create a new project on Vercel
3. Connect your repository
4. Add your `FMP_API_KEY` to the Environment Variables
5. Deploy!
