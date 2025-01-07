'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchIncomeStatements, testApi } from '@/lib/api';
import { FilterParams, SortParams } from '@/types/financial';
import DataTable from '@/components/DataTable';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'date',
    direction: 'desc',
  });

  const { data: incomeData, isLoading: isLoadingIncome, error: errorIncome } = useQuery({
    queryKey: ['incomeStatements', filters, sort],
    queryFn: () => fetchIncomeStatements(filters, sort),
  });

  const { data: apiTestData, error: apiTestError, isLoading: isLoadingApiTest, refetch: refetchApiTest } = useQuery({
    queryKey: ['apiTest'],
    queryFn: testApi
  });

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field: field as SortParams['field'],
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoadingIncome) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorIncome) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">
          Error loading data. Please check your API key and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <FilterPanel filters={filters} onFilterChange={setFilters} />
        
        <div className="rounded-lg border bg-card">
          <DataTable
            data={incomeData || []}
            sortField={sort.field}
            sortDirection={sort.direction}
            onSort={handleSort}
          />
        </div>

        <main className="container mx-auto p-4">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">API Test</h1>
            <Button onClick={() => refetchApiTest()}>Test API</Button>
            
            {isLoadingApiTest && <p>Testing API...</p>}
            {apiTestError && <p className="text-red-500">Error: {(apiTestError as Error).message}</p>}
            {apiTestData && (
              <div className="p-4 bg-green-100 rounded">
                <pre>{JSON.stringify(apiTestData, null, 2)}</pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
