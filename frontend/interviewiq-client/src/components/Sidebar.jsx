function Sidebar({
  questionsCount,
  selectedQuestionIndex,
  score,
  isDarkMode,
  onToggleTheme,
}) {
  const selectedQuestionLabel =
    selectedQuestionIndex === null ? "None" : `Question ${selectedQuestionIndex + 1}`;

  return (
    <aside className="sidebar">
      <div className="brand stacked-brand">
        <InterviewIqLogo />

        <div className="brand-text-block">
          <p className="brand-name">
            Interview<span>IQ</span>
          </p>
          <p className="brand-subtitle">AI interview coach</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="InterviewIQ navigation">
        <a className="nav-item active" href="#top">
          <span className="nav-icon">01</span>
          Practice
        </a>
        <a className="nav-item" href="#questions">
          <span className="nav-icon">02</span>
          Questions
        </a>
        <a className="nav-item" href="#feedback">
          <span className="nav-icon">03</span>
          Feedback
        </a>
      </nav>

      <div className="sidebar-card">
        <p className="sidebar-card-label">Session stats</p>

        <div className="stat-row">
          <span>Questions</span>
          <strong>{questionsCount}</strong>
        </div>

        <div className="stat-row">
          <span>Selected</span>
          <strong>{selectedQuestionLabel}</strong>
        </div>

        <div className="stat-row">
          <span>Score</span>
          <strong>{score ? `${score}/10` : "Pending"}</strong>
        </div>
      </div>

      <button className="theme-toggle" type="button" onClick={onToggleTheme}>
        <span className="theme-toggle-icon">{isDarkMode ? "☀" : "☾"}</span>
        <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
      </button>

      <div className="sidebar-footer">
        <p>Local AI model</p>
        <strong>Ollama ready</strong>
      </div>
    </aside>
  );
}

function InterviewIqLogo() {
  return (
    <div className="interviewiq-logo" aria-hidden="true">
      <svg
        className="interviewiq-logo-svg"
        viewBox="0 0 120 120"
        role="img"
        focusable="false"
      >
        <defs>
          <linearGradient id="interviewIqGradient" x1="16" y1="20" x2="104" y2="100">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="48%" stopColor="#5b5cf6" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>

          <filter id="interviewIqGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          className="logo-shield"
          d="M60 10L102 34V82L60 110L18 82V34L60 10Z"
          fill="url(#interviewIqGradient)"
          filter="url(#interviewIqGlow)"
        />

        <path
          className="logo-cutout"
          d="M42 42L60 30L78 42V75L67 82V49L60 45L53 49V82L42 75V42Z"
        />

        <path
          className="logo-check"
          d="M53 82L66 94L94 74V91L64 110L42 90V75L53 82Z"
          fill="#07111f"
          opacity="0.98"
        />

        <path
          className="logo-inner-highlight"
          d="M60 10L102 34V82L60 110V93L86 76V43L60 28V10Z"
          fill="#0ea5e9"
          opacity="0.34"
        />
      </svg>
    </div>
  );
}

export default Sidebar;