import { useState } from 'react';
import './App.css';

function Toast({ message, show }) {
  if (!show) return null;
  return <div className="toast">{message}</div>;
}

function SideTable({ history, open, onClose }) {
  if (!open) return null;
  return (
    <div className="side-table-overlay" onClick={onClose}>
      <div className="side-table" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>History</h2>
        {history.length === 0 ? (
          <p>No ideas checked yet.</p>
        ) : (
          <ul>
            {history.map((item, idx) => (
              <li key={idx} className="history-item">
                <strong>Idea:</strong> {item.idea}<br/>
                <strong>Verdict:</strong> {item.result.verdict}<br/>
                <strong>Suggestion:</strong> {item.result.suggestion}
                <ul>
                  {item.result.explanation.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
                <hr/>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sideOpen, setSideOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('https://gpt-idea-validator.onrender.com/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      const data = await res.json();
      setResult(data);
      setHistory(prev => [{ idea, result: data }, ...prev]);
      setIdea(''); // Reset the box
      setToast(true); // Show toast
      setTimeout(() => setToast(false), 2000);
    } catch (err) {
      setResult({ verdict: '', explanation: [], suggestion: 'Error connecting to server.' });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <Toast message="What's your next brilliant idea?" show={toast} />
      <button className="history-btn" onClick={() => setSideOpen(true)}>
        Show History
      </button>
      <SideTable history={history} open={sideOpen} onClose={() => setSideOpen(false)} />
      <h1>AI Startup Mentor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value)}
          placeholder="Your startup idea…"
          rows={5}
          required
        />
        <button type="submit" disabled={loading || !idea.trim()}>
          {loading ? 'Evaluating…' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="result">
          <h2>Verdict: <span>{result.verdict}</span></h2>
          <h3>Explanation:</h3>
          <ul>
            {result.explanation.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          <h3>Suggestion:</h3>
          <p>{result.suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
