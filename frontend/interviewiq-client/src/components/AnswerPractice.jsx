import EmptyState from "./EmptyState";

function AnswerPractice({
  selectedQuestion,
  answer,
  isReviewingAnswer,
  canReviewAnswer,
  onAnswerChange,
  onReviewAnswer,
}) {
  return (
    <form className="panel" onSubmit={onReviewAnswer}>
      <div className="panel-header">
        <div>
          <p className="section-label">Step 3</p>
          <h2>Practice your answer</h2>
        </div>
      </div>

      {selectedQuestion ? (
        <>
          <div className="selected-question-box">
            <span className="category-badge">{selectedQuestion.category}</span>
            <p>{selectedQuestion.question}</p>
          </div>

          <label className="field">
            <span>Your answer</span>
            <textarea
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Type your answer here..."
              rows={9}
            />
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={!canReviewAnswer}
          >
            {isReviewingAnswer ? "Reviewing answer..." : "Review answer"}
          </button>
        </>
      ) : (
        <EmptyState
          title="Select a question first"
          message="Choose one generated question above, then type your practice answer."
        />
      )}
    </form>
  );
}

export default AnswerPractice;