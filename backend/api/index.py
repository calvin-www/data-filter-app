from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import httpx
import os
from mangum import Mangum

app = FastAPI()

# Enable CORS with more permissive settings for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://data-filter-app.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.environ.get("FMP_API_KEY")
BASE_URL = "https://financialmodelingprep.com/api/v3"

class IncomeStatement(BaseModel):
    date: str
    symbol: str
    revenue: float
    netIncome: float
    grossProfit: float
    eps: float
    operatingIncome: float

async def fetch_income_statements():
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/income-statement/AAPL",
            params={"period": "annual", "apikey": API_KEY}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from FMP API")
        
        data = response.json()
        return [
            IncomeStatement(
                date=item["date"],
                symbol=item["symbol"],
                revenue=item["revenue"],
                netIncome=item["netIncome"],
                grossProfit=item["grossProfit"],
                eps=item["eps"],
                operatingIncome=item["operatingIncome"]
            )
            for item in data
        ]

def filter_data(data: List[IncomeStatement], 
                start_year: Optional[int] = None,
                end_year: Optional[int] = None,
                min_revenue: Optional[float] = None,
                max_revenue: Optional[float] = None,
                min_net_income: Optional[float] = None,
                max_net_income: Optional[float] = None):
    
    filtered_data = data.copy()
    
    if start_year:
        filtered_data = [
            item for item in filtered_data 
            if int(datetime.strptime(item.date, "%Y-%m-%d").year) >= start_year
        ]
    
    if end_year:
        filtered_data = [
            item for item in filtered_data 
            if int(datetime.strptime(item.date, "%Y-%m-%d").year) <= end_year
        ]
    
    if min_revenue is not None:
        filtered_data = [item for item in filtered_data if item.revenue >= min_revenue]
    
    if max_revenue is not None:
        filtered_data = [item for item in filtered_data if item.revenue <= max_revenue]
    
    if min_net_income is not None:
        filtered_data = [item for item in filtered_data if item.netIncome >= min_net_income]
    
    if max_net_income is not None:
        filtered_data = [item for item in filtered_data if item.netIncome <= max_net_income]
    
    return filtered_data

def sort_data(data: List[IncomeStatement], sort_field: str = "date", sort_direction: str = "desc"):
    reverse = sort_direction.lower() == "desc"
    return sorted(
        data,
        key=lambda x: getattr(x, sort_field),
        reverse=reverse
    )

@app.get("/api/income-statements")
async def get_income_statements(
    start_year: Optional[int] = Query(None),
    end_year: Optional[int] = Query(None),
    min_revenue: Optional[float] = Query(None),
    max_revenue: Optional[float] = Query(None),
    min_net_income: Optional[float] = Query(None),
    max_net_income: Optional[float] = Query(None),
    sort_field: str = Query("date"),
    sort_direction: str = Query("desc")
):
    try:
        data = await fetch_income_statements()
        
        # Apply filters
        filtered_data = filter_data(
            data,
            start_year,
            end_year,
            min_revenue,
            max_revenue,
            min_net_income,
            max_net_income
        )
        
        # Apply sorting
        sorted_data = sort_data(filtered_data, sort_field, sort_direction)
        
        return sorted_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create handler for AWS Lambda / Vercel
handler = Mangum(app)
# Make handler available for import
__all__ = ['handler']
