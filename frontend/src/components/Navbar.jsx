import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">DevHelp</div>

      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        {auth?.user?.role === "student" && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/create-doubt">Create Doubt</Link></li>
          </>
        )}
        {auth?.user?.role === "mentor" && (
          <>
            <li><Link to="/mentor-dashboard">Mentor Dashboard</Link></li>
          </>
        )}
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
