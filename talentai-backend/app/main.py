from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.candidates.router import router as candidates_router
from app.recruiters.router import router as recruiters_router

app = FastAPI(
    title="TalentAI API",
    description="AI-Powered Recruitment & Talent Marketplace",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(candidates_router)
app.include_router(recruiters_router)


@app.get("/")
def root():
    return {"message": "TalentAI API is running"}