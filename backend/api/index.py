from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working!"}

handler = Mangum(app)