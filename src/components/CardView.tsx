import { IncomeStatement } from '@/types/financial';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardViewProps {
  data: IncomeStatement[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const formatCurrency = (value: number) => {
  const billion = 1_000_000_000;
  return `$${(value / billion).toFixed(1)}B`;
};

const formatDate = (date: string) => {
  return new Date(date).getFullYear().toString();
};

const getGrowthIndicator = (current: number, previous: number | undefined) => {
  if (!previous) return null;
  const growth = ((current - previous) / Math.abs(previous)) * 100;
  if (growth > 0) {
    return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
  } else if (growth < 0) {
    return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
  }
  return null;
};

const sortOptions = [
  { label: 'Date (Newest)', value: 'date-desc' },
  { label: 'Date (Oldest)', value: 'date-asc' },
  { label: 'Revenue (Highest)', value: 'revenue-desc' },
  { label: 'Revenue (Lowest)', value: 'revenue-asc' },
  { label: 'Net Income (Highest)', value: 'netIncome-desc' },
  { label: 'Net Income (Lowest)', value: 'netIncome-asc' },
];

export default function CardView({ data, sortField = 'date', sortDirection = 'desc', onSort }: CardViewProps) {
  const handleSortChange = (value: string) => {
    const field = value.split('-')[0];
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={`${sortField}-${sortDirection}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => {
          const previousItem = data[index + 1];
          return (
            <Card key={item.date} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.symbol}</span>
                  <span className="text-lg">{formatDate(item.date)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(item.revenue)}</span>
                    {getGrowthIndicator(item.revenue, previousItem?.revenue)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Net Income</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(item.netIncome)}</span>
                    {getGrowthIndicator(item.netIncome, previousItem?.netIncome)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Operating Income</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(item.operatingIncome)}</span>
                    {getGrowthIndicator(item.operatingIncome, previousItem?.operatingIncome)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
