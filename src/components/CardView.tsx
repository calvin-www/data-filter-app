import { IncomeStatement } from '@/types/financial';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardViewProps {
  data: IncomeStatement[];
  isLoading?: boolean;
  sortField?: 'date' | 'revenue' | 'netIncome';
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: 'date' | 'revenue' | 'netIncome') => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(date: string): string {
  return new Date(date).getFullYear().toString();
}

const CardSkeleton = () => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/4" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </CardContent>
  </Card>
);

export default function CardView({ 
  data, 
  isLoading, 
  sortField, 
  sortDirection, 
  onSort 
}: CardViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const sortedData = [...data];
  if (sortField && sortDirection) {
    sortedData.sort((a, b) => {
      let valueA: number, valueB: number;
      
      switch (sortField) {
        case 'date':
          valueA = new Date(a.date).getFullYear();
          valueB = new Date(b.date).getFullYear();
          break;
        case 'revenue':
          valueA = a.revenue;
          valueB = b.revenue;
          break;
        case 'netIncome':
          valueA = a.netIncome;
          valueB = b.netIncome;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedData.map((item) => (
        <Card key={item.date} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{item.symbol}</span>
              <span className="text-lg">{formatDate(item.date)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-medium">{formatCurrency(item.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net Income</span>
              <span className="font-medium">{formatCurrency(item.netIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gross Profit</span>
              <span className="font-medium">{formatCurrency(item.grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">EPS</span>
              <span className="font-medium">${item.eps.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Operating Income</span>
              <span className="font-medium">{formatCurrency(item.operatingIncome)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
