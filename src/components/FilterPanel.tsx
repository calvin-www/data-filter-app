import { FilterParams } from '@/types/financial';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FilterPanelProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export default function FilterPanel({
  filters,
  onFilterChange,
}: FilterPanelProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FilterParams
  ) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                placeholder="Start Year"
                value={filters.startYear || ''}
                onChange={(e) => handleInputChange(e, 'startYear')}
              />
              <Input
                type="number"
                placeholder="End Year"
                value={filters.endYear || ''}
                onChange={(e) => handleInputChange(e, 'endYear')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Revenue Range (USD)</h3>
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                placeholder="Min Revenue"
                value={filters.minRevenue || ''}
                onChange={(e) => handleInputChange(e, 'minRevenue')}
              />
              <Input
                type="number"
                placeholder="Max Revenue"
                value={filters.maxRevenue || ''}
                onChange={(e) => handleInputChange(e, 'maxRevenue')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Net Income Range (USD)</h3>
            <div className="flex flex-col gap-2">
              <Input
                type="number"
                placeholder="Min Net Income"
                value={filters.minNetIncome || ''}
                onChange={(e) => handleInputChange(e, 'minNetIncome')}
              />
              <Input
                type="number"
                placeholder="Max Net Income"
                value={filters.maxNetIncome || ''}
                onChange={(e) => handleInputChange(e, 'maxNetIncome')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
