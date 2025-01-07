export interface IncomeStatement {
  date: string;
  symbol: string;

  calendarYear: string;
  revenue: number;
  netIncome: number;
  eps: number;
  grossProfit: number;
  operatingIncome: number;
}

export interface FilterParams {
  startYear?: number;
  endYear?: number;
  minRevenue?: number;
  maxRevenue?: number;
  minNetIncome?: number;
  maxNetIncome?: number;
}

export interface SortParams {
  field: 'date' | 'revenue' | 'netIncome';
  direction: 'asc' | 'desc';
}
