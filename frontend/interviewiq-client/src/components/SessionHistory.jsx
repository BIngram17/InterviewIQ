function SessionHistory({
  sessions,
  currentSessionId,
  isLoadingSessions,
  onLoadSession,
  onDeleteSession,
}) {
  return (
    <section className="panel session-history-panel">
      <div className="panel-header">
        <div>
          <p className="section-label">Saved work</p>
          <h2>Saved sessions</h2>
        </div>

        <span className="count-pill">{sessions.length} saved</span>
      </div>

      {isLoadingSessions ? (
        <div className="session-empty">
          <p>Loading saved sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="session-empty">
          <p>No saved sessions yet. Generate questions to create your first saved session.</p>
        </div>
      ) : (
        <div className="session-list">
          {sessions.map((session) => (
            <article
              key={session.id}
              className={
                currentSessionId === session.id
                  ? "session-card active-session"
                  : "session-card"
              }
            >
              <div className="session-card-main">
                <div>
                  <h3>{session.job_title}</h3>
                  <p>
                    {session.company_name || "No company"} · {session.interview_type} ·{" "}
                    {session.difficulty}
                  </p>
                </div>

                <span className="session-score">
                  {session.latest_score ? `${session.latest_score}/10` : "No score"}
                </span>
              </div>

              <div className="session-meta">
                <span>{session.question_count} questions</span>
                <span>{session.answer_count} answers</span>
                <span>{formatDate(session.created_at)}</span>
              </div>

              <div className="session-actions">
                <button
                  type="button"
                  className="small-action-button"
                  onClick={() => onLoadSession(session.id)}
                >
                  Load
                </button>

                <button
                  type="button"
                  className="small-action-button danger-action"
                  onClick={() => onDeleteSession(session.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
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
    year: "numeric",
  }).format(new Date(value));
}

export default SessionHistory;