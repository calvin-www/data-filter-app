import { IncomeStatement, FilterParams, SortParams } from '@/types/financial';

// Use relative URL in production, full URL in development
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api';

export async function fetchIncomeStatements(
  filters?: FilterParams,
  sort?: SortParams
): Promise<IncomeStatement[]> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.startYear) params.append('start_year', filters.startYear.toString());
    if (filters.endYear) params.append('end_year', filters.endYear.toString());
    if (filters.minRevenue) params.append('min_revenue', filters.minRevenue.toString());
    if (filters.maxRevenue) params.append('max_revenue', filters.maxRevenue.toString());
    if (filters.minNetIncome) params.append('min_net_income', filters.minNetIncome.toString());
    if (filters.maxNetIncome) params.append('max_net_income', filters.maxNetIncome.toString());
  }

  if (sort) {
    params.append('sort_field', sort.field);
    params.append('sort_direction', sort.direction);
  }

  const response = await fetch(`${API_URL}/income-statements?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch income statements');
  }

  return response.json();
}

// This function is no longer needed as filtering and sorting are handled by the backend
export function filterAndSortData(
  data: IncomeStatement[],
  filters: FilterParams,
  sort: SortParams
): IncomeStatement[] {
  return data;
}
