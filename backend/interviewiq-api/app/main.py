from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import ai, sessions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InterviewIQ API",
    description="Backend API for InterviewIQ, an AI-powered interview preparation app.",
    version="0.2.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)
app.include_router(sessions.router)


@app.get("/")
def root():
    return {
        "message": "InterviewIQ API is running.",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }