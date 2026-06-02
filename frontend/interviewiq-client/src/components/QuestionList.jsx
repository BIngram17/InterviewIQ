import EmptyState from "./EmptyState";

function QuestionList({ questions, selectedQuestionIndex, onSelectQuestion }) {
  return (
    <section className="panel" id="questions">
      <div className="panel-header">
        <div>
          <p className="section-label">Step 2</p>
          <h2>Generated questions</h2>
        </div>

        <span className="count-pill">{questions.length} questions</span>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          title="No questions generated yet"
          message="Paste a job description and generate questions to start practicing."
        />
      ) : (
        <div className="question-list">
          {questions.map((question, index) => (
            <button
              key={`${question.category}-${index}`}
              type="button"
              className={
                selectedQuestionIndex === index
                  ? "question-card selected"
                  : "question-card"
              }
              onClick={() => onSelectQuestion(index)}
            >
              <div className="question-card-top">
                <span className="category-badge">{question.category}</span>
                <span className="question-number">Question {index + 1}</span>
              </div>

              <p className="question-text">{question.question}</p>

              <p className="why-it-matters">
                <strong>Why it matters:</strong> {question.why_it_matters}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default QuestionList;