import { FilterParams } from '@/types/financial';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { FilterIcon } from 'lucide-react';
import { RangeSlider } from '@/components/ui/range-slider';
import { useQuery } from '@tanstack/react-query';
import { fetchIncomeStatements } from '@/lib/api';

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

const formatCurrency = (value: number) => {
  const billion = 1_000_000_000;
  return `$${(value / billion).toFixed(1)}B`;
};

const parseCurrency = (value: string) => {
  const number = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return number * 1_000_000_000;
};

const formatYear = (value: number) => value.toString();
const parseYear = (value: string) => parseInt(value);

export default function FilterPanel({
  filters,
  onFilterChange,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);
  const [ranges, setRanges] = useState({
    year: [2010, 2023],
    revenue: [0, 1_000_000_000_000],
    netIncome: [-100_000_000_000, 100_000_000_000],
  });

  // Fetch all data to determine ranges
  const { data: allData } = useQuery({
    queryKey: ['incomeStatements', {}],
    queryFn: () => fetchIncomeStatements(),
  });

  useEffect(() => {
    if (allData) {
      const years = allData.map(item => new Date(item.date).getFullYear());
      const revenues = allData.map(item => item.revenue);
      const netIncomes = allData.map(item => item.netIncome);

      setRanges({
        year: [Math.min(...years), Math.max(...years)],
        revenue: [Math.min(...revenues), Math.max(...revenues)],
        netIncome: [Math.min(...netIncomes), Math.max(...netIncomes)],
      });
    }
  }, [allData]);

  const handleYearChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      startYear: values[0],
      endYear: values[1],
    }));
  };

  const handleRevenueChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      minRevenue: values[0],
      maxRevenue: values[1],
    }));
  };

  const handleNetIncomeChange = (values: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      minNetIncome: values[0],
      maxNetIncome: values[1],
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Filters</CardTitle>
        <Button 
          onClick={handleApplyFilters}
          className="transition-transform hover:scale-105"
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <RangeSlider
              label="Year Range"
              min={ranges.year[0]}
              max={ranges.year[1]}
              step={1}
              value={[
                localFilters.startYear || ranges.year[0],
                localFilters.endYear || ranges.year[1]
              ]}
              onValueChange={handleYearChange}
              formatValue={formatYear}
              parseValue={parseYear}
              showMarks={true}
              markCount={ranges.year[1] - ranges.year[0]}
              className="mt-2"
            />

            <RangeSlider
              label="Revenue Range"
              min={ranges.revenue[0]}
              max={ranges.revenue[1]}
              step={1_000_000_000}
              value={[
                localFilters.minRevenue || ranges.revenue[0],
                localFilters.maxRevenue || ranges.revenue[1]
              ]}
              onValueChange={handleRevenueChange}
              formatValue={formatCurrency}
              parseValue={parseCurrency}
              className="mt-6"
            />

            <RangeSlider
              label="Net Income Range"
              min={ranges.netIncome[0]}
              max={ranges.netIncome[1]}
              step={1_000_000_000}
              value={[
                localFilters.minNetIncome || ranges.netIncome[0],
                localFilters.maxNetIncome || ranges.netIncome[1]
              ]}
              onValueChange={handleNetIncomeChange}
              formatValue={formatCurrency}
              parseValue={parseCurrency}
              className="mt-6"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
