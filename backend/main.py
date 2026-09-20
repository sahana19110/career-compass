from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import recommendations, colleges, market_trends, chatbot

app = FastAPI(
    title="ASCENTIA AI Backend API",
    description="Smart Skilling Navigator & TNEA Admission Allocation Engine",
    version="2.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

# Mount API routers
app.include_router(recommendations.router)
app.include_router(colleges.router)
app.include_router(market_trends.router)
app.include_router(chatbot.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "ASCENTIA AI — Smart Skilling Navigator",
        "author": "Sahana Balaji",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
