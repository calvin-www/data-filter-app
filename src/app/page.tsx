"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIncomeStatements } from "@/lib/api";
import { IncomeStatement, FilterParams, SortParams } from "@/types/financial";
import DataTable from "@/components/DataTable";
import CardView from "@/components/CardView";
import FilterPanel from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Layers, Table2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [filters, setFilters] = useState<FilterParams>({});
  const [sortParams, setSortParams] = useState<SortParams>({
    field: "date",
    direction: "desc",
  });

  const { data, isLoading, error } = useQuery<IncomeStatement[]>({
    queryKey: ["incomeStatements", filters, sortParams],
    queryFn: () => fetchIncomeStatements(filters, sortParams),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const handleSort = (field: 'date' | 'revenue' | 'netIncome') => {
    setSortParams((prev) => ({
      field,
      direction: 
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleResize = () => {
    // Responsive view mode toggle logic
    const width = window.innerWidth;
    if (width < 768 && viewMode === "table") {
      setViewMode("card");
    } else if (width >= 768 && viewMode === "card") {
      setViewMode("table");
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <FilterPanel 
        filters={filters} 
        onFilterChange={setFilters} 
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex w-full sm:w-auto">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className="flex-1 sm:flex-initial gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            onClick={() => setViewMode('card')}
            className="flex-1 sm:flex-initial gap-2 ml-2"
          >
            <Layers className="h-4 w-4" />
            Cards
          </Button>
        </div>
        {viewMode === 'card' && (
          <Select
            value={`${sortParams.field}-${sortParams.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('-');
              setSortParams({
                field: field as 'date' | 'revenue' | 'netIncome',
                direction: direction as 'asc' | 'desc'
              });
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="revenue-desc">Revenue (Highest)</SelectItem>
              <SelectItem value="revenue-asc">Revenue (Lowest)</SelectItem>
              <SelectItem value="netIncome-desc">Net Income (Highest)</SelectItem>
              <SelectItem value="netIncome-asc">Net Income (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {error ? (
        <div className="text-red-500 text-center">
          Error fetching data: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : viewMode === "table" ? (
        <DataTable 
          data={data || []} 
          isLoading={isLoading}
          sortField={sortParams.field}
          sortDirection={sortParams.direction}
          onSort={handleSort}
        />
      ) : (
        <CardView 
          data={data || []} 
          isLoading={isLoading} 
          sortField={sortParams.field}
          sortDirection={sortParams.direction}
        />
      )}
    </main>
  );
}
