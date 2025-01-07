'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchIncomeStatements } from '@/lib/api';
import { FilterParams, SortParams } from '@/types/financial';
import DataTable from '@/components/DataTable';
import FilterPanel from '@/components/FilterPanel';

export default function Home() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'date',
    direction: 'desc',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['incomeStatements', filters, sort],
    queryFn: () => fetchIncomeStatements(filters, sort),
  });

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field: field as SortParams['field'],
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
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
            data={data || []}
            sortField={sort.field}
            sortDirection={sort.direction}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
}
