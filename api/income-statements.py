"""
Income Statements API endpoint for fetching and filtering financial data.

This endpoint fetches income statement data from the Financial Modeling Prep API
and provides filtering and sorting capabilities. It requires an FMP_API_KEY
environment variable to be set.

Query Parameters:
    start_year (int): Filter by start year (inclusive)
    end_year (int): Filter by end year (inclusive)
    min_revenue (float): Minimum revenue filter
    max_revenue (float): Maximum revenue filter
    min_net_income (float): Minimum net income filter
    max_net_income (float): Maximum net income filter
    sort_field (str): Field to sort by (default: 'date')
    sort_direction (str): Sort direction ('asc' or 'desc', default: 'desc')

Returns:
    JSON response containing filtered and sorted income statement data
    or an error message if something goes wrong.
"""

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import json
import os
import requests
from datetime import datetime

def get_income_statements(params):
    """
    Fetch and process income statement data based on query parameters.
    
    Args:
        params (dict): Dictionary of query parameters for filtering and sorting
        
    Returns:
        tuple: (data, status_code) where data is the processed response data
        and status_code is the HTTP status code
    """
    api_key = os.environ.get("FMP_API_KEY")
    if not api_key:
        return {"error": "API key not configured"}, 500

    # Fetch data from Financial Modeling Prep API
    base_url = "https://financialmodelingprep.com/api/v3/income-statement/AAPL"
    fmp_params = {
        "period": "annual",
        "apikey": api_key
    }
    
    try:
        response = requests.get(base_url, params=fmp_params)
        response.raise_for_status()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch data from FMP API: {str(e)}"}, 500

    try:
        data = response.json()
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from FMP API"}, 500
    
    try:
        # Apply filters
        filtered_data = data
        
        # Year filters
        if 'start_year' in params:
            start_year = int(params['start_year'][0])
            filtered_data = [item for item in filtered_data 
                           if int(datetime.strptime(item['date'], "%Y-%m-%d").year) >= start_year]
        
        if 'end_year' in params:
            end_year = int(params['end_year'][0])
            filtered_data = [item for item in filtered_data 
                           if int(datetime.strptime(item['date'], "%Y-%m-%d").year) <= end_year]
        
        # Revenue filters
        if 'min_revenue' in params:
            min_revenue = float(params['min_revenue'][0])
            filtered_data = [item for item in filtered_data if item['revenue'] >= min_revenue]
        
        if 'max_revenue' in params:
            max_revenue = float(params['max_revenue'][0])
            filtered_data = [item for item in filtered_data if item['revenue'] <= max_revenue]
        
        # Net income filters
        if 'min_net_income' in params:
            min_net_income = float(params['min_net_income'][0])
            filtered_data = [item for item in filtered_data if item['netIncome'] >= min_net_income]
        
        if 'max_net_income' in params:
            max_net_income = float(params['max_net_income'][0])
            filtered_data = [item for item in filtered_data if item['netIncome'] <= max_net_income]
        
        # Apply sorting
        sort_field = params.get('sort_field', ['date'])[0]
        sort_direction = params.get('sort_direction', ['desc'])[0]
        
        filtered_data.sort(
            key=lambda x: x[sort_field],
            reverse=sort_direction.lower() == 'desc'
        )
    except (ValueError, KeyError) as e:
        return {"error": f"Error processing data: {str(e)}"}, 400
    
    # Format the response data
    formatted_data = [{
        'date': item['date'],
        'symbol': item['symbol'],
        'revenue': item['revenue'],
        'netIncome': item['netIncome'],
        'grossProfit': item['grossProfit'],
        'eps': item['eps'],
        'operatingIncome': item['operatingIncome']
    } for item in filtered_data]
    
    return formatted_data, 200

class handler(BaseHTTPRequestHandler):
    """Vercel serverless function handler for the income statements endpoint."""
    
    def do_GET(self):
        """Handle GET requests by returning filtered and sorted income statement data."""
        # Parse query parameters
        query_components = parse_qs(urlparse(self.path).query)
        
        # Get the data
        data, status_code = get_income_statements(query_components)
        
        # Send response
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
