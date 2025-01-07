'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchIncomeStatements } from '@/lib/api';
import { FilterParams, SortParams } from '@/types/financial';
import FilterPanel from '@/components/FilterPanel';
import DataTable from '@/components/DataTable';
import CardView from '@/components/CardView';
import { Button } from '@/components/ui/button';
import { TableIcon, LayoutGridIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [sort, setSort] = useState<SortParams>({
    field: 'date',
    direction: 'desc',
  });

  // Handle mobile view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setViewMode('card');
      }
    };

    // Set initial view mode
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    return <div className="container max-w-7xl mx-auto px-4">Error loading data</div>;
  }

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex w-full sm:w-auto">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className="flex-1 sm:flex-initial gap-2"
          >
            <TableIcon className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            onClick={() => setViewMode('card')}
            className="flex-1 sm:flex-initial gap-2 ml-2"
          >
            <LayoutGridIcon className="h-4 w-4" />
            Cards
          </Button>
        </div>
        {viewMode === 'card' && (
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={(value) => {
              const [field] = value.split('-');
              handleSort(field);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: 'Date (Newest)', value: 'date-desc' },
                { label: 'Date (Oldest)', value: 'date-asc' },
                { label: 'Revenue (Highest)', value: 'revenue-desc' },
                { label: 'Revenue (Lowest)', value: 'revenue-asc' },
                { label: 'Net Income (Highest)', value: 'netIncome-desc' },
                { label: 'Net Income (Lowest)', value: 'netIncome-asc' },
              ].map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {viewMode === 'table' ? (
        <DataTable
          data={incomeData || []}
          isLoading={isLoading}
          sortField={sort.field}
          sortDirection={sort.direction}
          onSort={handleSort}
        />
      ) : (
        <CardView
          data={incomeData || []}
          isLoading={isLoading}
          sortField={sort.field}
          sortDirection={sort.direction}
          onSort={handleSort}
        />
      )}
    </main>
  );
}
