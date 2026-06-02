import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import InterviewAnswer, InterviewQuestion, InterviewSession
from app.schemas import (
    AnswerRead,
    CreateSessionRequest,
    SaveAnswerRequest,
    SessionRead,
    SessionSummary,
)

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])


@router.post("", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
def create_session(request: CreateSessionRequest, db: Session = Depends(get_db)):
    session = InterviewSession(
        job_title=request.job_title.strip(),
        company_name=request.company_name.strip() or None,
        job_description=request.job_description.strip(),
        interview_type=request.interview_type,
        difficulty=request.difficulty,
    )

    db.add(session)
    db.flush()

    for question in request.questions:
        db.add(
            InterviewQuestion(
                session_id=session.id,
                category=question.category,
                question=question.question,
                why_it_matters=question.why_it_matters,
            )
        )

    db.commit()

    saved_session = get_session_or_404(session.id, db)
    return serialize_session(saved_session)


@router.get("", response_model=List[SessionSummary])
def list_sessions(db: Session = Depends(get_db)):
    sessions = (
        db.query(InterviewSession)
        .options(
            joinedload(InterviewSession.questions),
            joinedload(InterviewSession.answers),
        )
        .order_by(InterviewSession.created_at.desc())
        .all()
    )

    summaries = []

    for session in sessions:
        sorted_answers = sorted(
            session.answers,
            key=lambda answer: answer.created_at,
            reverse=True,
        )

        summaries.append(
            SessionSummary(
                id=session.id,
                job_title=session.job_title,
                company_name=session.company_name,
                interview_type=session.interview_type,
                difficulty=session.difficulty,
                created_at=session.created_at,
                question_count=len(session.questions),
                answer_count=len(session.answers),
                latest_score=sorted_answers[0].score if sorted_answers else None,
            )
        )

    return summaries


@router.get("/{session_id}", response_model=SessionRead)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = get_session_or_404(session_id, db)
    return serialize_session(session)


@router.post("/{session_id}/answers", response_model=AnswerRead, status_code=status.HTTP_201_CREATED)
def save_answer(
    session_id: int,
    request: SaveAnswerRequest,
    db: Session = Depends(get_db),
):
    if session_id != request.session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL session_id does not match request session_id.",
        )

    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    if request.question_id is not None:
        question = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.id == request.question_id,
                InterviewQuestion.session_id == session_id,
            )
            .first()
        )

        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview question not found for this session.",
            )

    answer = InterviewAnswer(
        session_id=session_id,
        question_id=request.question_id,
        answer=request.answer,
        score=request.score,
        strengths=json.dumps(request.strengths),
        weaknesses=json.dumps(request.weaknesses),
        improved_answer=request.improved_answer,
        coaching_notes=request.coaching_notes,
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    return serialize_answer(answer)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    db.delete(session)
    db.commit()

    return None


def get_session_or_404(session_id: int, db: Session):
    session = (
        db.query(InterviewSession)
        .options(
            joinedload(InterviewSession.questions),
            joinedload(InterviewSession.answers),
        )
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session not found.",
        )

    return session


def serialize_session(session: InterviewSession) -> SessionRead:
    return SessionRead(
        id=session.id,
        job_title=session.job_title,
        company_name=session.company_name,
        job_description=session.job_description,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        created_at=session.created_at,
        questions=[serialize_question(question) for question in session.questions],
        answers=[serialize_answer(answer) for answer in session.answers],
    )


def serialize_question(question: InterviewQuestion):
    return {
        "id": question.id,
        "session_id": question.session_id,
        "category": question.category,
        "question": question.question,
        "why_it_matters": question.why_it_matters,
        "created_at": question.created_at,
    }


def serialize_answer(answer: InterviewAnswer) -> AnswerRead:
    return AnswerRead(
        id=answer.id,
        session_id=answer.session_id,
        question_id=answer.question_id,
        answer=answer.answer,
        score=answer.score,
        strengths=json.loads(answer.strengths),
        weaknesses=json.loads(answer.weaknesses),
        improved_answer=answer.improved_answer,
        coaching_notes=answer.coaching_notes,
        created_at=answer.created_at,
    )