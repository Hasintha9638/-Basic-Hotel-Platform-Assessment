import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Page not found</p>
      <Link to="/hotels" className="notfound-link">
        Go back to Hotels
      </Link>
    </div>
  );
};

export default NotFound;
