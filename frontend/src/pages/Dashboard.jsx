// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiMessageCircle,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ReplyForm from "../components/ReplyForm";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);

  // Fetch student's doubts (with comments)
  useEffect(() => {
    const fetchDoubts = async () => {
      if (auth?.user?.role === "student") {
        try {
          const { data } = await api.get("/doubts/mine");
          setDoubts(data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchDoubts();
  }, [auth]);

  // Delete doubt
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doubt?")) return;
    await api.delete(`/doubts/${id}`);
    setDoubts((prev) => prev.filter((d) => d._id !== id));
  };

  // Mark as resolved
  const handleResolve = async (id) => {
    await api.put(`/doubts/${id}/resolve`);
    setDoubts((prev) =>
      prev.map((d) => (d._id === id ? { ...d, status: "resolved" } : d))
    );
  };

  // Post a reply and refresh that doubt
  const handleReply = async (id, text, clear) => {
    await api.post(`/comments/${id}`, { text });
    const { data } = await api.get(`/doubts/${id}`);
    setDoubts((prev) => prev.map((d) => (d._id === id ? data : d)));
    clear();
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="container">
        <h1>Welcome, {auth.user.name}</h1>
        <p className="role-text">
          Logged in as: <strong>{auth.user.role}</strong>
        </p>

        <div className="doubt-actions">
          <button onClick={() => navigate("/create-doubt")}>
            + Create New Doubt
          </button>
        </div>

        <h2>Your Doubts</h2>

        {doubts.length === 0 ? (
          <p className="no-doubts">No doubts posted yet.</p>
        ) : (
          <ul className="doubt-list">
            {doubts.map((d) => {
              const lastComment =
                d.comments && d.comments.length
                  ? d.comments[d.comments.length - 1]
                  : null;
              return (
                <li key={d._id} className="doubt-item">
                  <div className="doubt-header">
                    <h3>{d.title}</h3>
                    <div className="doubt-actions-icons">
                      <FiTrash2
                        className="icon delete-icon"
                        onClick={() => handleDelete(d._id)}
                      />
                      <FiEdit2
                        className="icon edit-icon"
                        onClick={() => navigate(`/edit-doubt/${d._id}`)}
                      />
                      {d.status === "open" && (
                        <FiCheckCircle
                          className="icon resolve-icon"
                          title="Mark Resolved"
                          onClick={() => handleResolve(d._id)}
                        />
                      )}
                    </div>
                  </div>

                  <p className="doubt-desc">{d.description}</p>

                  {/* Latest reply */}
                  {lastComment && (
                    <div className="latest-reply">
                      <FiMessageCircle className="reply-icon" />
                      <div className="reply-text">
                        {lastComment.text}
                        <span className="reply-author">
                          — {lastComment.createdBy.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Inline reply form */}
                  {d.status === "open" && (
                    <ReplyForm
                      onReplied={(text, clear) =>
                        handleReply(d._id, text, clear)
                      }
                    />
                  )}

                  <span className={`status ${d.status}`}>{d.status}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
