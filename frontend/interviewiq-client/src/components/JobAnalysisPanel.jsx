import EmptyState from "./EmptyState";

function JobAnalysisPanel({ analysis, isAnalyzing }) {
  return (
    <section className="panel analysis-panel">
      <div className="panel-header">
        <div>
          <p className="section-label">AI role scan</p>
          <h2>Job analysis</h2>
        </div>
      </div>

      {isAnalyzing ? (
        <EmptyState
          title="Analyzing job description..."
          message="The local AI model is identifying skills, responsibilities, and likely interview topics."
        />
      ) : !analysis ? (
        <EmptyState
          title="No analysis yet"
          message="Use the Analyze job button to extract skills, responsibilities, and interview prep guidance."
        />
      ) : (
        <div className="analysis-content">
          <div className="analysis-summary">
            <h3>Summary</h3>
            <p>{analysis.summary}</p>
          </div>

          <AnalysisGroup title="Technical skills" items={analysis.technical_skills} />
          <AnalysisGroup title="Soft skills" items={analysis.soft_skills} />
          <AnalysisGroup title="Responsibilities" items={analysis.responsibilities} />
          <AnalysisGroup
            title="Likely interview topics"
            items={analysis.likely_interview_topics}
          />
          <AnalysisGroup title="Preparation advice" items={analysis.preparation_advice} />
        </div>
      )}
    </section>
  );
}

function AnalysisGroup({ title, items }) {
  return (
    <div className="analysis-group">
      <h3>{title}</h3>

      {items?.length > 0 ? (
        <div className="analysis-chip-list">
          {items.map((item, index) => (
            <span key={`${title}-${index}`} className="analysis-chip">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p>No items returned.</p>
      )}
    </div>
  );
}

export default JobAnalysisPanel;