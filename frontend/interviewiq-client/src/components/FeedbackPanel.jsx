import { useEffect, useState } from "react";

import EmptyState from "./EmptyState";
import FeedbackList from "./FeedbackList";
import ScoreBadge from "./ScoreBadge";

function FeedbackPanel({ feedback, selectedQuestion, answer }) {
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  async function handleCopyImprovedAnswer() {
    if (!feedback?.improved_answer) {
      return;
    }

    try {
      await navigator.clipboard.writeText(feedback.improved_answer);
      setToastMessage("Improved answer copied.");
    } catch {
      setToastMessage("Could not copy text.");
    }
  }

  async function handleCopyFullFeedback() {
    if (!feedback) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        buildFeedbackText(feedback, selectedQuestion, answer)
      );
      setToastMessage("Full feedback copied.");
    } catch {
      setToastMessage("Could not copy feedback.");
    }
  }

  function handleDownloadFeedback() {
    if (!feedback) {
      return;
    }

    const feedbackText = buildFeedbackText(feedback, selectedQuestion, answer);
    const blob = new Blob([feedbackText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "interviewiq-feedback.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
    setToastMessage("Feedback downloaded.");
  }

  return (
    <section className="panel feedback-panel" id="feedback">
      <div className="panel-header">
        <div>
          <p className="section-label">Step 4</p>
          <h2>AI feedback</h2>
        </div>

        {feedback && <ScoreBadge score={feedback.score} />}
      </div>

      {!feedback ? (
        <EmptyState
          title="No feedback yet"
          message="Submit an answer to get a score, strengths, weaknesses, coaching notes, and an improved version."
        />
      ) : (
        <div className="feedback-content">
          <div className="feedback-actions">
            <button
              type="button"
              className="small-action-button"
              onClick={handleCopyImprovedAnswer}
            >
              Copy improved answer
            </button>

            <button
              type="button"
              className="small-action-button"
              onClick={handleCopyFullFeedback}
            >
              Copy full feedback
            </button>

            <button
              type="button"
              className="small-action-button"
              onClick={handleDownloadFeedback}
            >
              Download .txt
            </button>
          </div>

          {toastMessage && (
            <div className="feedback-toast" role="status">
              {toastMessage}
            </div>
          )}

          <FeedbackList title="Strengths" items={feedback.strengths} />
          <FeedbackList title="Weaknesses" items={feedback.weaknesses} />

          <div className="feedback-block">
            <h3>Coaching notes</h3>
            <p>{feedback.coaching_notes}</p>
          </div>

          <div className="feedback-block improved-answer">
            <h3>Improved answer</h3>
            <p>{feedback.improved_answer}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function buildFeedbackText(feedback, selectedQuestion, answer) {
  const strengths = feedback.strengths?.length
    ? feedback.strengths.map((item) => `- ${item}`).join("\n")
    : "- No strengths returned.";

  const weaknesses = feedback.weaknesses?.length
    ? feedback.weaknesses.map((item) => `- ${item}`).join("\n")
    : "- No weaknesses returned.";

  return `InterviewIQ Feedback

Question:
${selectedQuestion?.question ?? "No question selected."}

Original Answer:
${answer || "No original answer provided."}

Score:
${feedback.score}/10

Strengths:
${strengths}

Weaknesses:
${weaknesses}

Coaching Notes:
${feedback.coaching_notes}

Improved Answer:
${feedback.improved_answer}
`;
}

export default FeedbackPanel;