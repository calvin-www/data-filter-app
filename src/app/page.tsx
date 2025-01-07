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

  const { data: incomeData, isLoading: isLoadingIncome, error: incomeError } = useQuery({
    queryKey: ['incomeStatements', filters, sort],
    queryFn: () => fetchIncomeStatements(filters, sort),
  });

  const { data: apiTestData, error: apiTestError, isLoading: isLoadingApiTest, refetch: refetchApiTest } = useQuery({
    queryKey: ['apiTest'],
    queryFn: testApi,
    enabled: false
  });

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field: field as SortParams['field'],
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4 mb-8 p-4 border rounded-lg bg-card">
          <h2 className="text-xl font-bold">API Test</h2>
          <Button onClick={() => refetchApiTest()}>Test API</Button>
          
          {isLoadingApiTest && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          )}
          
          {apiTestError && (
            <div className="p-4 bg-red-100 rounded w-full max-w-md">
              <p className="text-red-500">Error: {(apiTestError as Error).message}</p>
            </div>
          )}
          
          {apiTestData && (
            <div className="p-4 bg-green-100 rounded w-full max-w-md">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="whitespace-pre-wrap">{JSON.stringify(apiTestData, null, 2)}</pre>
            </div>
          )}
        </div>

        <FilterPanel filters={filters} onFilterChange={setFilters} />
        
        {isLoadingIncome && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {incomeError && (
          <div className="text-center py-8">
            <div className="text-destructive">
              Error loading data: {(incomeError as Error).message}
            </div>
          </div>
        )}

        {incomeData && (
          <div className="rounded-lg border bg-card">
            <DataTable
              data={incomeData}
              sortField={sort.field}
              sortDirection={sort.direction}
              onSort={handleSort}
            />
          </div>
        )}
      </div>
    </div>
  );
}
