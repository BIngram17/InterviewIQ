function InterviewForm({
  formData,
  isStartingPrep,
  canStartPrep,
  onInputChange,
  onStartPrep,
  onReset,
}) {
  return (
    <form className="panel form-panel" onSubmit={onStartPrep}>
      <div className="panel-header">
        <div>
          <p className="section-label">Step 1</p>
          <h2>Create interview session</h2>
        </div>

        <button type="button" className="ghost-button" onClick={onReset}>
          Reset
        </button>
      </div>

      <label className="field">
        <span>Job title</span>
        <input
          name="job_title"
          type="text"
          value={formData.job_title}
          onChange={onInputChange}
          placeholder="Junior Software Developer"
        />
      </label>

      <label className="field">
        <span>Company name</span>
        <input
          name="company_name"
          type="text"
          value={formData.company_name}
          onChange={onInputChange}
          placeholder="Optional"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Interview type</span>
          <select
            name="interview_type"
            value={formData.interview_type}
            onChange={onInputChange}
          >
            <option value="mixed">Mixed</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="hr">HR screening</option>
            <option value="government">Government</option>
          </select>
        </label>

        <label className="field">
          <span>Difficulty</span>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={onInputChange}
          >
            <option value="entry-level">Entry-level</option>
            <option value="mid-level">Mid-level</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Job description</span>
        <textarea
          name="job_description"
          value={formData.job_description}
          onChange={onInputChange}
          placeholder="Paste the job description here..."
          rows={10}
        />
      </label>

      <button
        className="primary-button"
        type="submit"
        disabled={!canStartPrep}
      >
        {isStartingPrep ? "Starting interview prep..." : "Start interview prep"}
      </button>
    </form>
  );
}

export default InterviewForm;