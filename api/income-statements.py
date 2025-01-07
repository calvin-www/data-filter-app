from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import json
import os
import requests
from datetime import datetime

def get_income_statements(params):
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
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.RequestException as e:
        return {"error": f"Failed to fetch data from FMP API: {str(e)}"}, 500

    try:
        data = response.json()
    except json.JSONDecodeError:
        return {"error": "Invalid JSON response from FMP API"}, 500
    
    # Apply filters
    filtered_data = data
    
    try:
        if 'start_year' in params:
            start_year = int(params['start_year'][0])
            filtered_data = [item for item in filtered_data 
                           if int(datetime.strptime(item['date'], "%Y-%m-%d").year) >= start_year]
        
        if 'end_year' in params:
            end_year = int(params['end_year'][0])
            filtered_data = [item for item in filtered_data 
                           if int(datetime.strptime(item['date'], "%Y-%m-%d").year) <= end_year]
        
        if 'min_revenue' in params:
            min_revenue = float(params['min_revenue'][0])
            filtered_data = [item for item in filtered_data if item['revenue'] >= min_revenue]
        
        if 'max_revenue' in params:
            max_revenue = float(params['max_revenue'][0])
            filtered_data = [item for item in filtered_data if item['revenue'] <= max_revenue]
        
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
    def do_GET(self):
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
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
