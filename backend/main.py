import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router

app = FastAPI(
    title="VERONICA — BEYOND THE ASSISTANT",
    description="Computational Digital Self, Behavioral Simulation & Agent Orchestration API",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "VERONICA DIGITAL SELF OS",
        "philosophy": "Don't just assist the user. Understand how the user operates.",
        "mode": "FOSS_LOCAL"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8001, reload=True)
