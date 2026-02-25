<<<<<<< HEAD
import Login from './pages/Login'

function App() {
  return (
    <Login />
  )
=======
import './App.css';
import Navbar from './components/navbar';
import Hero from './components/welcome';
import StatCard from './components/StatCard';

function App() {
  const stats = [
    { label: "Total Alumni", value: "12,450", growth: "+5.2%" },
    { label: "Active Mentors", value: "842", growth: "+12.4%" },
    { label: "Job Postings", value: "156", growth: "+8.1%" },
    { label: "Upcoming Events", value: "23", growth: "+3.5%" }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <main className="dashboard-content">
        <Hero />
        <div className="stats-grid">
          {stats.map((item, index) => <StatCard key={index} {...item} />)}
        </div>
        <div className="main-grid">
          <div className="activity-panel">
            <h4>Recent Activity</h4>
            <div className="empty-state">Activity coming soon...</div>
          </div>
          <div className="actions-panel">
            <h4>Quick Actions</h4>
            <div className="action-item">Find a Mentor <span>→</span></div>
            <div className="action-item">Browse Jobs <span>→</span></div>
          </div>
        </div>
      </main>
    </div>
  );
>>>>>>> dev
}
export default App;