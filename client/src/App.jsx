import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import Chat from "./pages/Chat";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import About from "./pages/About";


function App() {
  return (
    <Router>
      <nav style={{ padding: "0.5rem", background: "#dbeafe", borderBottom: "1px solid #bbb" }}>
        <Link to="/" style={{ margin: "0 1rem" }}>Home</Link>
        <Link to="/forum" style={{ margin: "0 1rem" }}>Forum</Link>
        <Link to="/chat" style={{ margin: "0 1rem" }}>Chat</Link>
        <Link to="/marketplace" style={{ margin: "0 1rem" }}>Marketplace</Link>
        <Link to="/profile" style={{ margin: "0 1rem" }}>Profile</Link>
        <Link to="/login" style={{ margin: "0 1rem" }}>Login</Link>
        <Link to="/register" style={{ margin: "0 1rem" }}>Register</Link>
        <Link to="/about" style={{ margin: "0 1rem" }}>About</Link>
        <Link to="/feedback" style={{ margin: "0 1rem" }}>Feedback</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
