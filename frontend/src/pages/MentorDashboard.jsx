import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import ReplyForm from "../components/ReplyForm";
import "../styles/MentorDashboard.css";

const MentorDashboard = () => {
  const { auth } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("open");
  const [loading, setLoading] = useState(false);

  if (!auth || auth.user.role !== "mentor") {
    return <Navigate to="/login" replace />;
  }

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/doubts?status=${statusFilter}`);
      setDoubts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [statusFilter]);

  const handleResolve = async (id) => {
    await api.put(`/doubts/${id}/resolve`);
    setDoubts((prev) =>
      prev.map((d) => (d._id === id ? { ...d, status: "resolved" } : d))
    );
  };

  const handleReply = async (doubtId, text, clear) => {
    await api.post(`/comments/${doubtId}`, { text });
    const { data } = await api.get(`/doubts/${doubtId}`);
    setDoubts((prev) =>
      prev.map((d) => (d._id === doubtId ? data : d))
    );
    clear();
  };

  // ✅ Helper to determine image URL
  const getImageUrl = (d) => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    if (d.fileUrl) {
      return d.fileUrl.startsWith("http") ? d.fileUrl : `${base}${d.fileUrl}`;
    }
    if (d.screenshot) {
      return `${base}${d.screenshot}`;
    }
    return null;
  };

  return (
    <div className="mentor-dashboard-page">
      <Navbar />

      <div className="mentor-dashboard-container">
        <h2>Mentor Dashboard</h2>

        <div className="filter-buttons">
          <button
            className={statusFilter === "open" ? "active" : ""}
            onClick={() => setStatusFilter("open")}
          >
            Open
          </button>
          <button
            className={statusFilter === "resolved" ? "active" : ""}
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </button>
        </div>

        {loading ? (
          <p>Loading doubts…</p>
        ) : doubts.length === 0 ? (
          <p>No doubts found.</p>
        ) : (
          <ul className="mentor-doubt-list">
            {doubts.map((d) => {
              const lastComment =
                d.comments && d.comments.length
                  ? d.comments[d.comments.length - 1]
                  : null;

              const imgSrc = getImageUrl(d);

              return (
                <li key={d._id} className="mentor-doubt-item">
                  <h3 className="doubt-title">
                    <Link to={`/doubt/${d._id}`}>{d.title}</Link>
                  </h3>

                  <p>{d.description}</p>

                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt="Doubt screenshot"
                      className="doubt-image"
                    />
                  )}

                  <p className="student-name">
                    Student: {d.student?.name || "Unknown"}
                  </p>

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

                  <div className="mentor-item-actions">
                    {d.status === "open" && (
                      <FiCheckCircle
                        className="icon resolve-icon"
                        title="Mark Resolved"
                        onClick={() => handleResolve(d._id)}
                      />
                    )}
                  </div>

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

export default MentorDashboard;
