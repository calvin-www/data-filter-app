import { IncomeStatement } from '@/types/financial';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataTableProps {
  data: IncomeStatement[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

interface SortButtonProps {
  field: string;
  currentField: string;
  direction: 'asc' | 'desc';
  onClick: (field: string) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

const SortButton = ({ field, currentField, direction, onClick }: SortButtonProps) => {
  const isActive = field === currentField;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onClick(field)}
      className={isActive ? "text-primary" : "text-muted-foreground"}
    >
      {isActive ? (
        direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
    </Button>
  );
};

export default function DataTable({
  data,
  sortField,
  sortDirection,
  onSort,
}: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              <div className="flex items-center gap-2">
                Date
                <SortButton
                  field="date"
                  currentField={sortField}
                  direction={sortDirection}
                  onClick={onSort}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                Revenue
                <SortButton
                  field="revenue"
                  currentField={sortField}
                  direction={sortDirection}
                  onClick={onSort}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                Net Income
                <SortButton
                  field="netIncome"
                  currentField={sortField}
                  direction={sortDirection}
                  onClick={onSort}
                />
              </div>
            </TableHead>
            <TableHead>Gross Profit</TableHead>
            <TableHead>EPS</TableHead>
            <TableHead>Operating Income</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.date}>
              <TableCell className="font-medium">
                {format(new Date(item.date), 'yyyy-MM-dd')}
              </TableCell>
              <TableCell>{formatCurrency(item.revenue)}</TableCell>
              <TableCell>{formatCurrency(item.netIncome)}</TableCell>
              <TableCell>{formatCurrency(item.grossProfit)}</TableCell>
              <TableCell>{item.eps.toFixed(2)}</TableCell>
              <TableCell>{formatCurrency(item.operatingIncome)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
