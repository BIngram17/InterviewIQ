function ScoreBadge({ score }) {
  const scoreLabel = score >= 8 ? "Strong" : score >= 6 ? "Needs polish" : "Needs work";

  return (
    <div className="score-badge">
      <strong>{score}/10</strong>
      <span>{scoreLabel}</span>
    </div>
  );
}

export default ScoreBadge;