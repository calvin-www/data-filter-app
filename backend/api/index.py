from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://data-filter-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
async def test_endpoint(request: Request):
    return {
        "message": "API is working!",
        "method": request.method,
        "url": str(request.url)
    }

# Handler for Vercel serverless
handler = Mangum(app, lifespan="off")