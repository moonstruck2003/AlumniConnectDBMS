import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="logo-icon">AC</div>
        <div className="logo-text-group">
          <span className="logo-text">AlumniConnect</span>
          <span className="logo-subtext">University Network</span>
        </div>
      </div>
      <ul className="nav-links">
        <li className="active">Dashboard</li>
        <li>Alumni Directory</li>
        <li>Mentorship</li>
        <li>Jobs & Internships</li>
        <li>Events</li>
      </ul>
      <div className="nav-actions">
        <Link to="/login" className="nav-login-link">Already Registered? <strong>Login</strong></Link>
        <Link to="/signup" className="nav-btn">Sign up with email</Link>
      </div>
    </nav>
  );
}