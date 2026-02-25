import './StatCard.css';
export default function StatCard({ label, value, growth }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">👤</div>
        <span className="growth">{growth}</span>
      </div>
      <div className="card-body">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}