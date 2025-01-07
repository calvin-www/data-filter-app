import { IncomeStatement, FilterParams, SortParams } from '@/types/financial';

// Use relative URL in production, full URL in development
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api';

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

  console.log('Making API request to:', `${API_URL}/income-statements?${params.toString()}`);
  try {
    const response = await fetch(`${API_URL}/income-statements?${params.toString()}`);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`Failed to fetch income statements: ${error}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export async function testApi() {
  console.log('Making API request to:', `${API_URL}/test`);
  try {
    const response = await fetch(`${API_URL}/test`);
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`API test failed: ${error}`);
    }
    
    const text = await response.text();
    console.log('API Response text:', text);
    
    // Convert Python string representation to JSON
    const cleanedText = text.replace(/'/g, '"');
    const data = JSON.parse(cleanedText);
    
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}
