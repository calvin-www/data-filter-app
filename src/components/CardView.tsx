import { IncomeStatement } from '@/types/financial';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardViewProps {
  data: IncomeStatement[];
  isLoading?: boolean;
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

const CardSkeleton = () => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default function CardView({ data, isLoading }: CardViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
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
              <span className="font-medium">{formatCurrency(item.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Net Income</span>
              <span className="font-medium">{formatCurrency(item.netIncome)}</span>
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
