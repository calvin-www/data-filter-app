# Financial Data Filter App

A web application for filtering and analyzing Apple Inc.'s financial data using the Financial Modeling Prep API.

## Features

- Display annual income statements in a responsive table
- Filter data by date range, revenue, and net income
- Sort data by date, revenue, and net income
- Mobile-friendly design using TailwindCSS

## Prerequisites

- Node.js (v18 or higher)
- Financial Modeling Prep API key

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your API key:
   ```
   NEXT_PUBLIC_FMP_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js with TypeScript
- TailwindCSS for styling
- React Query for data fetching
- Financial Modeling Prep API for financial data
