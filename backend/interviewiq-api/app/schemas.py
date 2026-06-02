from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


InterviewType = Literal["behavioral", "technical", "hr", "government", "mixed"]
Difficulty = Literal["entry-level", "mid-level", "advanced"]


class GenerateQuestionsRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=120)
    company_name: str = Field(default="", max_length=120)
    job_description: str = Field(..., min_length=20)
    interview_type: InterviewType = "mixed"
    difficulty: Difficulty = "entry-level"


class InterviewQuestion(BaseModel):
    category: str
    question: str
    why_it_matters: str


class GenerateQuestionsResponse(BaseModel):
    questions: List[InterviewQuestion]


class AnalyzeJobRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=120)
    company_name: str = Field(default="", max_length=120)
    job_description: str = Field(..., min_length=20)


class AnalyzeJobResponse(BaseModel):
    technical_skills: List[str]
    soft_skills: List[str]
    responsibilities: List[str]
    likely_interview_topics: List[str]
    preparation_advice: List[str]
    summary: str


class ReviewAnswerRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=120)
    question: str = Field(..., min_length=10)
    answer: str = Field(..., min_length=10)
    job_description: str = Field(default="")


class ReviewAnswerResponse(BaseModel):
    score: int = Field(..., ge=1, le=10)
    strengths: List[str]
    weaknesses: List[str]
    improved_answer: str
    coaching_notes: str


class CreateSessionRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=120)
    company_name: str = Field(default="", max_length=120)
    job_description: str = Field(..., min_length=20)
    interview_type: InterviewType = "mixed"
    difficulty: Difficulty = "entry-level"
    questions: List[InterviewQuestion] = Field(default_factory=list)


class SaveAnswerRequest(BaseModel):
    session_id: int
    question_id: Optional[int] = None
    answer: str = Field(..., min_length=10)
    score: int = Field(..., ge=1, le=10)
    strengths: List[str]
    weaknesses: List[str]
    improved_answer: str
    coaching_notes: str


class QuestionRead(BaseModel):
    id: int
    session_id: int
    category: str
    question: str
    why_it_matters: str
    created_at: datetime

    class Config:
        from_attributes = True


class AnswerRead(BaseModel):
    id: int
    session_id: int
    question_id: Optional[int]
    answer: str
    score: int
    strengths: List[str]
    weaknesses: List[str]
    improved_answer: str
    coaching_notes: str
    created_at: datetime

    class Config:
        from_attributes = True


class SessionRead(BaseModel):
    id: int
    job_title: str
    company_name: Optional[str]
    job_description: str
    interview_type: str
    difficulty: str
    created_at: datetime
    questions: List[QuestionRead] = []
    answers: List[AnswerRead] = []

    class Config:
        from_attributes = True


class SessionSummary(BaseModel):
    id: int
    job_title: str
    company_name: Optional[str]
    interview_type: str
    difficulty: str
    created_at: datetime
    question_count: int
    answer_count: int
    latest_score: Optional[int]