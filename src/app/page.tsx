'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchIncomeStatements } from '@/lib/api';
import { FilterParams, SortParams } from '@/types/financial';
import FilterPanel from '@/components/FilterPanel';
import DataTable from '@/components/DataTable';
import CardView from '@/components/CardView';
import { Button } from '@/components/ui/button';
import { TableIcon, LayoutGridIcon } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [sort, setSort] = useState<SortParams>({
    field: 'date',
    direction: 'desc',
  });

  const { data: incomeData, isLoading, isError } = useQuery({
    queryKey: ['incomeStatements', filters, sort],
    queryFn: () => fetchIncomeStatements(filters, sort),
  });

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field: field as SortParams['field'],
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <main className="container mx-auto py-10">
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <TableIcon className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            onClick={() => setViewMode('card')}
            className="gap-2"
          >
            <LayoutGridIcon className="h-4 w-4" />
            Cards
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        viewMode === 'table' ? (
          <div className="rounded-lg border bg-card">
            <DataTable 
              data={incomeData || []}
              sortField={sort.field}
              sortDirection={sort.direction}
              onSort={handleSort}
            />
          </div>
        ) : (
          <CardView 
            data={incomeData || []} 
            sortField={sort.field}
            sortDirection={sort.direction}
            onSort={handleSort}
          />
        )
      )}
    </main>
  );
}
