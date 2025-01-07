"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIncomeStatements } from "@/lib/api";
import { IncomeStatement, FilterParams, SortParams } from "@/types/financial";
import DataTable from "@/components/DataTable";
import CardView from "@/components/CardView";
import FilterPanel from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Layers, Table2 } from "lucide-react";

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
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Apple Inc. Financial Data</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            <Table2 className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("card")}
            title="Card View"
          >
            <Layers className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <FilterPanel 
        filters={filters} 
        onFilterChange={setFilters} 
      />

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
        />
      )}
    </main>
  );
}
