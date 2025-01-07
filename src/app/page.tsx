'use client';

import { useQuery } from '@tanstack/react-query';
import { testApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['apiTest'],
    queryFn: testApi,
    // Don't auto-fetch, wait for button click
    enabled: false
  });

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">API Test</h1>
        <Button onClick={() => refetch()}>Test API</Button>
        
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 rounded w-full max-w-md">
            <p className="text-red-500">Error: {(error as Error).message}</p>
          </div>
        )}
        
        {data && (
          <div className="p-4 bg-green-100 rounded w-full max-w-md">
            <h2 className="font-semibold mb-2">API Response:</h2>
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
