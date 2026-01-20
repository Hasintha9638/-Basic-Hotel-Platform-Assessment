import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/hotels" className="navbar-brand-link">
            🏨 Hotel Admin
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/hotels" 
            className={`navbar-link ${isActive('/hotels') ? 'active' : ''}`}
          >
            Hotels
          </Link>
        </div>

        <div className="navbar-user-section">
          <span className="navbar-username">{user?.username}</span>
          <button onClick={handleLogout} className="navbar-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;