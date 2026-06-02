function FeedbackList({ title, items }) {
  return (
    <div className="feedback-block">
      <h3>{title}</h3>
      {items?.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items returned.</p>
      )}
    </div>
  );
}

export default FeedbackList;