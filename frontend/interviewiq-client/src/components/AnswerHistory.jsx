function AnswerHistory({ answers, questions, selectedAnswerId, onSelectAnswer }) {
  const sortedAnswers = [...(answers ?? [])].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <section className="panel answer-history-panel">
      <div className="panel-header">
        <div>
          <p className="section-label">Saved attempts</p>
          <h2>Answer history</h2>
        </div>

        <span className="count-pill">{sortedAnswers.length} attempts</span>
      </div>

      {sortedAnswers.length === 0 ? (
        <div className="session-empty">
          <p>No saved answers yet. Review an answer to save your first attempt.</p>
        </div>
      ) : (
        <div className="answer-history-list">
          {sortedAnswers.map((savedAnswer) => {
            const question = questions.find(
              (item) => item.id === savedAnswer.question_id
            );

            return (
              <button
                key={savedAnswer.id}
                type="button"
                className={
                  selectedAnswerId === savedAnswer.id
                    ? "answer-history-card active-answer"
                    : "answer-history-card"
                }
                onClick={() => onSelectAnswer(savedAnswer)}
              >
                <div className="answer-history-top">
                  <span className="answer-history-score">
                    {savedAnswer.score}/10
                  </span>

                  <span className="answer-history-date">
                    {formatDate(savedAnswer.created_at)}
                  </span>
                </div>

                <p className="answer-history-question">
                  {question?.question ?? "Question not found"}
                </p>

                <p className="answer-history-preview">
                  {savedAnswer.answer}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default AnswerHistory;