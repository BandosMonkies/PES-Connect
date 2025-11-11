import { Link, useNavigate } from "react-router-dom"
import { getAuth, clearAuth } from '../utils/auth';
import Button from './Button';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token } = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          🎓 PES Connect
        </Link>
        <div className="nav-links">
          <Link className="nav-link" to='/'>
            Home
          </Link>
          {!token ? (
            <>
              <Link className="nav-link" to='/register'>
                Register
              </Link>
              <Link className="nav-link" to='/login'>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to='/dashboard'>
                Dashboard
              </Link>
              <span className="nav-user-info">
                👋 Hi, {user?.name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
