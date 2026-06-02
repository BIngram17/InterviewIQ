from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(120), nullable=False)
    company_name = Column(String(120), nullable=True)
    job_description = Column(Text, nullable=False)
    interview_type = Column(String(40), nullable=False, default="mixed")
    difficulty = Column(String(40), nullable=False, default="entry-level")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    questions = relationship(
        "InterviewQuestion",
        back_populates="session",
        cascade="all, delete-orphan",
    )

    answers = relationship(
        "InterviewAnswer",
        back_populates="session",
        cascade="all, delete-orphan",
    )


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category = Column(String(60), nullable=False)
    question = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("InterviewSession", back_populates="questions")
    answers = relationship(
        "InterviewAnswer",
        back_populates="question",
        cascade="all, delete-orphan",
    )


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id = Column(
        Integer,
        ForeignKey("interview_questions.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    answer = Column(Text, nullable=False)
    score = Column(Integer, nullable=False)
    strengths = Column(Text, nullable=False)
    weaknesses = Column(Text, nullable=False)
    improved_answer = Column(Text, nullable=False)
    coaching_notes = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    session = relationship("InterviewSession", back_populates="answers")
    question = relationship("InterviewQuestion", back_populates="answers")