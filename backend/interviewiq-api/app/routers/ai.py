from fastapi import APIRouter, HTTPException, status

from app.schemas import (
    AnalyzeJobRequest,
    AnalyzeJobResponse,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    ReviewAnswerRequest,
    ReviewAnswerResponse,
)
from app.services.ollama_service import OllamaServiceError, call_ollama_json

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/analyze-job", response_model=AnalyzeJobResponse)
def analyze_job(request: AnalyzeJobRequest):
    system_prompt = """
You are an interview preparation coach for software, IT, and government technology roles.
Analyze job descriptions and return practical preparation guidance.
Return only valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.

The JSON must follow this exact structure:
{
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "responsibilities": ["string"],
  "likely_interview_topics": ["string"],
  "preparation_advice": ["string"],
  "summary": "string"
}
"""

    user_prompt = f"""
Analyze this job description for interview preparation.

Job title: {request.job_title}
Company name: {request.company_name or "Not provided"}

Job description:
{request.job_description}

Rules:
- Extract realistic technical skills from the job description.
- Extract soft skills and workplace expectations.
- Identify the main responsibilities.
- Predict likely interview topics.
- Give practical preparation advice.
- Do not invent requirements that are not supported by the job description.
- Keep the response useful for a candidate preparing for this specific role.
"""

    try:
        result = call_ollama_json(system_prompt=system_prompt, user_prompt=user_prompt)
        return result
    except OllamaServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
def generate_questions(request: GenerateQuestionsRequest):
    system_prompt = """
You are an interview preparation coach for software, IT, and government technology roles.
Return only valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.

The JSON must follow this exact structure:
{
  "questions": [
    {
      "category": "technical | behavioral | hr | government",
      "question": "string",
      "why_it_matters": "string"
    }
  ]
}
"""

    user_prompt = f"""
Generate exactly 5 interview questions for this role.

Job title: {request.job_title}
Company name: {request.company_name or "Not provided"}
Interview type: {request.interview_type}
Difficulty: {request.difficulty}

Job description:
{request.job_description}

Rules:
- Questions should be realistic for the role.
- Include a mix of technical and behavioral questions when interview_type is mixed.
- If interview_type is government, include questions about documentation, process, communication, policies, and public service.
- The why_it_matters field should explain what the interviewer is evaluating.
"""

    try:
        result = call_ollama_json(system_prompt=system_prompt, user_prompt=user_prompt)
        return result
    except OllamaServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc


@router.post("/review-answer", response_model=ReviewAnswerResponse)
def review_answer(request: ReviewAnswerRequest):
    system_prompt = """
You are an interview coach who gives direct, practical feedback.
Return only valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.

The JSON must follow this exact structure:
{
  "score": 1,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improved_answer": "string",
  "coaching_notes": "string"
}

The score must be an integer from 1 to 10.
"""

    user_prompt = f"""
Review this interview answer.

Job title: {request.job_title}

Question:
{request.question}

Candidate answer:
{request.answer}

Job description:
{request.job_description or "Not provided"}

Evaluate the answer based on:
- clarity
- relevance to the question
- technical depth when applicable
- confidence
- specificity
- whether it uses a STAR-style structure when appropriate

Important rules:
- Do not invent metrics, numbers, results, technologies, job titles, companies, or accomplishments.
- Only use facts that are clearly included in the candidate answer or job description.
- If the answer needs stronger results, suggest that the candidate add a real result instead of making one up.
- The improved answer should sound professional but still believable for an entry-level or junior candidate.
- Keep the improved answer grounded in the candidate's original experience.

Give useful feedback and rewrite the answer into a stronger version.
"""

    try:
        result = call_ollama_json(system_prompt=system_prompt, user_prompt=user_prompt)
        return result
    except OllamaServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc