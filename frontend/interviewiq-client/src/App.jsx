import { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  analyzeJob,
  createSession,
  deleteSession,
  generateQuestions,
  getReadableApiError,
  getSession,
  getSessions,
  reviewAnswer,
  saveAnswer,
} from "./api/interviewIqApi";

import AnswerHistory from "./components/AnswerHistory";
import AnswerPractice from "./components/AnswerPractice";
import FeedbackPanel from "./components/FeedbackPanel";
import InterviewForm from "./components/InterviewForm";
import JobAnalysisPanel from "./components/JobAnalysisPanel";
import QuestionList from "./components/QuestionList";
import SessionHistory from "./components/SessionHistory";
import Sidebar from "./components/Sidebar";

const initialFormState = {
  job_title: "",
  company_name: "",
  job_description: "",
  interview_type: "mixed",
  difficulty: "entry-level",
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [currentSession, setCurrentSession] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [isStartingPrep, setIsStartingPrep] = useState(false);
  const [isReviewingAnswer, setIsReviewingAnswer] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("interviewiq-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );

    localStorage.setItem("interviewiq-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    loadSavedSessions();
  }, []);

  const selectedQuestion = useMemo(() => {
    if (selectedQuestionIndex === null) {
      return null;
    }

    return questions[selectedQuestionIndex] ?? null;
  }, [questions, selectedQuestionIndex]);

  const hasValidJobInput =
    formData.job_title.trim().length >= 2 &&
    formData.job_description.trim().length >= 20;

  const canStartPrep = hasValidJobInput && !isStartingPrep;

  const canReviewAnswer =
    currentSession &&
    selectedQuestion &&
    answer.trim().length >= 10 &&
    !isReviewingAnswer;

  async function loadSavedSessions() {
    setIsLoadingSessions(true);

    try {
      const sessions = await getSessions();
      setSavedSessions(sessions);
    } catch (requestError) {
      setError(getReadableApiError(requestError));
    } finally {
      setIsLoadingSessions(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleStartPrep(event) {
  event.preventDefault();

  if (!canStartPrep) {
    setError("Enter a job title and a job description with at least 20 characters.");
    return;
  }

  setIsStartingPrep(true);
  setError("");
  setSuccessMessage("");
  setCurrentSession(null);
  setQuestions([]);
  setJobAnalysis(null);
  setSelectedQuestionIndex(null);
  setSelectedAnswerId(null);
  setAnswer("");
  setFeedback(null);

  try {
    const cleanedJobData = {
      job_title: formData.job_title.trim(),
      company_name: formData.company_name.trim(),
      job_description: formData.job_description.trim(),
    };

    const cleanedSessionData = {
      ...cleanedJobData,
      interview_type: formData.interview_type,
      difficulty: formData.difficulty,
    };

    const analysisResult = await analyzeJob(cleanedJobData);
    setJobAnalysis(analysisResult);

    const generatedData = await generateQuestions(cleanedSessionData);
    const generatedQuestions = generatedData.questions ?? [];

    const savedSession = await createSession({
      ...cleanedSessionData,
      questions: generatedQuestions,
    });

    setCurrentSession(savedSession);
    setQuestions(savedSession.questions ?? generatedQuestions);
    setSuccessMessage(
      `Interview prep started. Session #${savedSession.id} saved to SQLite.`
    );

    await loadSavedSessions();
  } catch (requestError) {
    setError(getReadableApiError(requestError));
  } finally {
    setIsStartingPrep(false);
  }
}

  async function handleReviewAnswer(event) {
    event.preventDefault();

    if (!canReviewAnswer) {
      setError("Select a question and enter an answer with at least 10 characters.");
      return;
    }

    setIsReviewingAnswer(true);
    setError("");
    setSuccessMessage("");
    setFeedback(null);
    setSelectedAnswerId(null);

    try {
      const reviewedFeedback = await reviewAnswer({
        job_title: formData.job_title.trim(),
        question: selectedQuestion.question,
        answer: answer.trim(),
        job_description: formData.job_description.trim(),
      });

      const savedAnswer = await saveAnswer(currentSession.id, {
        session_id: currentSession.id,
        question_id: selectedQuestion.id ?? null,
        answer: answer.trim(),
        score: reviewedFeedback.score,
        strengths: reviewedFeedback.strengths,
        weaknesses: reviewedFeedback.weaknesses,
        improved_answer: reviewedFeedback.improved_answer,
        coaching_notes: reviewedFeedback.coaching_notes,
      });

      setFeedback({
        score: savedAnswer.score,
        strengths: savedAnswer.strengths,
        weaknesses: savedAnswer.weaknesses,
        improved_answer: savedAnswer.improved_answer,
        coaching_notes: savedAnswer.coaching_notes,
      });

      setSelectedAnswerId(savedAnswer.id);

      setCurrentSession((existingSession) => {
        if (!existingSession) {
          return existingSession;
        }

        return {
          ...existingSession,
          answers: [savedAnswer, ...(existingSession.answers ?? [])],
        };
      });

      setSuccessMessage(`Saved answer #${savedAnswer.id} to SQLite.`);
      await loadSavedSessions();
    } catch (requestError) {
      setError(getReadableApiError(requestError));
    } finally {
      setIsReviewingAnswer(false);
    }
  }

  async function handleLoadSession(sessionId) {
    setError("");
    setSuccessMessage("");

    try {
      const session = await getSession(sessionId);
      const sortedAnswers = [...(session.answers ?? [])].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      const latestAnswer = sortedAnswers[0] ?? null;
      const loadedQuestions = session.questions ?? [];

      setCurrentSession(session);
      setFormData({
        job_title: session.job_title,
        company_name: session.company_name ?? "",
        job_description: session.job_description,
        interview_type: session.interview_type,
        difficulty: session.difficulty,
      });
      setQuestions(loadedQuestions);
      setJobAnalysis(null);

      if (latestAnswer) {
        loadSavedAnswerIntoPractice(latestAnswer, loadedQuestions);
      } else {
        setSelectedQuestionIndex(null);
        setSelectedAnswerId(null);
        setAnswer("");
        setFeedback(null);
      }

      setSuccessMessage(`Loaded session #${session.id}.`);
    } catch (requestError) {
      setError(getReadableApiError(requestError));
    }
  }

  async function handleDeleteSession(sessionId) {
    const shouldDelete = window.confirm(
      "Delete this saved interview session? This cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await deleteSession(sessionId);

      if (currentSession?.id === sessionId) {
        handleReset();
      }

      await loadSavedSessions();
      setSuccessMessage(`Deleted session #${sessionId}.`);
    } catch (requestError) {
      setError(getReadableApiError(requestError));
    }
  }

  function handleSelectQuestion(index) {
    setSelectedQuestionIndex(index);
    setSelectedAnswerId(null);
    setAnswer("");
    setFeedback(null);
    setError("");
    setSuccessMessage("");
  }

  function handleSelectSavedAnswer(savedAnswer) {
    loadSavedAnswerIntoPractice(savedAnswer, questions);
    setError("");
    setSuccessMessage(`Loaded answer attempt #${savedAnswer.id}.`);
  }

  function loadSavedAnswerIntoPractice(savedAnswer, questionList) {
    const matchingQuestionIndex = questionList.findIndex(
      (question) => question.id === savedAnswer.question_id
    );

    setSelectedQuestionIndex(
      matchingQuestionIndex >= 0 ? matchingQuestionIndex : null
    );

    setSelectedAnswerId(savedAnswer.id);
    setAnswer(savedAnswer.answer);
    setFeedback({
      score: savedAnswer.score,
      strengths: savedAnswer.strengths,
      weaknesses: savedAnswer.weaknesses,
      improved_answer: savedAnswer.improved_answer,
      coaching_notes: savedAnswer.coaching_notes,
    });
  }

  function handleReset() {
    setFormData(initialFormState);
    setCurrentSession(null);
    setQuestions([]);
    setJobAnalysis(null);
    setSelectedQuestionIndex(null);
    setSelectedAnswerId(null);
    setAnswer("");
    setFeedback(null);
    setError("");
    setSuccessMessage("");
  }

  return (
    <div className="app-frame">
      <Sidebar
        questionsCount={questions.length}
        selectedQuestionIndex={selectedQuestionIndex}
        score={feedback?.score ?? null}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((currentValue) => !currentValue)}
      />

      <main className="app-shell" id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">AI-powered interview preparation</p>
            <h1>
              Practice smarter.
              <br />
              Answer stronger.
            </h1>
            <p className="hero-copy">
              Generate realistic interview questions from a job description, practice
              your answers, and get direct AI coaching from a local open-source model.
            </p>
          </div>

          <div className="hero-card">
            <span className="status-dot" />
            <div>
              <p className="hero-card-label">AI Engine</p>
              <p className="hero-card-value">FastAPI + Ollama</p>
            </div>
          </div>
        </section>

        {error && (
          <section className="alert" role="alert">
            {error}
          </section>
        )}

        {successMessage && (
          <section className="success-alert" role="status">
            {successMessage}
          </section>
        )}

        <SessionHistory
          sessions={savedSessions}
          currentSessionId={currentSession?.id ?? null}
          isLoadingSessions={isLoadingSessions}
          onLoadSession={handleLoadSession}
          onDeleteSession={handleDeleteSession}
        />

        <section className="layout-grid">
          <InterviewForm
            formData={formData}
            isStartingPrep={isStartingPrep}
            canStartPrep={canStartPrep}
            onInputChange={handleInputChange}
            onStartPrep={handleStartPrep}
            onReset={handleReset}
          />

          <JobAnalysisPanel analysis={jobAnalysis} isAnalyzing={isStartingPrep} />
        </section>

        <section className="layout-grid practice-grid">
          <QuestionList
            questions={questions}
            selectedQuestionIndex={selectedQuestionIndex}
            onSelectQuestion={handleSelectQuestion}
          />

          <AnswerPractice
            selectedQuestion={selectedQuestion}
            answer={answer}
            isReviewingAnswer={isReviewingAnswer}
            canReviewAnswer={canReviewAnswer}
            onAnswerChange={setAnswer}
            onReviewAnswer={handleReviewAnswer}
          />
        </section>

        <section className="layout-grid practice-grid">
          <AnswerHistory
            answers={currentSession?.answers ?? []}
            questions={questions}
            selectedAnswerId={selectedAnswerId}
            onSelectAnswer={handleSelectSavedAnswer}
          />

          <FeedbackPanel
            feedback={feedback}
            selectedQuestion={selectedQuestion}
            answer={answer}
          />
        </section>
      </main>
    </div>
  );
}

export default App;