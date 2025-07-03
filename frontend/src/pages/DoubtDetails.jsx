// src/pages/DoubtDetail.jsx
import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ReplyForm from "../components/ReplyForm";
import { FiCheckCircle, FiMessageCircle, FiUpload } from "react-icons/fi";
import "../styles/DoubtDetails.css";

const DoubtDetail = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  if (!auth) return <Navigate to="/login" replace />;

  useEffect(() => {
    api
      .get(`/doubts/${id}`)
      .then((res) => setDoubt(res.data))
      .catch((err) => console.error("Failed to fetch doubt:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const markResolved = () =>
    api.put(`/doubts/${id}/resolve`).then(() =>
      setDoubt((d) => ({ ...d, status: "resolved" }))
    );

  const postReply = (text, clear) =>
    api.post(`/comments/${id}`, { text }).then(() =>
      api.get(`/doubts/${id}`).then((res) => {
        setDoubt(res.data);
        clear();
      })
    );

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("screenshot", file);

    await api.put(`/doubts/${id}/screenshot`, formData);
    const { data } = await api.get(`/doubts/${id}`);
    setDoubt(data);
    setFile(null);
  };

  if (loading) return <p>Loading…</p>;
  if (!doubt) return <p>Doubt not found.</p>;

  const isOwner = auth.user.id === doubt.student;

  const imageUrl = doubt.fileUrl
    ? doubt.fileUrl.startsWith("http")
      ? doubt.fileUrl
      : `${api.defaults.baseURL.replace(/\/api$/, "")}${doubt.fileUrl}`
    : null;

  return (
    <div className="doubt-detail-page">
      <Navbar />
      <div className="doubt-detail-container">
        <h1>{doubt.title}</h1>
        <p className="doubt-desc">{doubt.description}</p>

        {/* ✅ Screenshot if available */}
        {imageUrl && (
          <div className="image-section">
            <img
              src={imageUrl}
              alt="Doubt Screenshot"
              className="doubt-detail-image"
              style={{ maxWidth: "100%", margin: "1rem 0", borderRadius: "8px" }}
            />

            {/* ✅ Download button visible to mentors or owner */}
            {(auth.user.role === "mentor" || isOwner) && (
              <a
                href={imageUrl}
                download
                className="download-btn"
                style={{
                  display: "inline-block",
                  marginBottom: "1rem",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                Download Image
              </a>
            )}
          </div>
        )}

        {/* ✅ Screenshot Upload */}
        {isOwner && doubt.status === "open" && (
          <form onSubmit={handleUpload} className="upload-form">
            <label className="upload-label">
              <FiUpload /> Change Screenshot
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="upload-input"
              />
            </label>
            {file && (
              <button type="submit" className="upload-btn">
                Upload
              </button>
            )}
          </form>
        )}

        {/* ✅ Status line */}
        <div className="status-line">
          Status: <strong>{doubt.status}</strong>
          {auth.user.role === "mentor" && doubt.status === "open" && (
            <FiCheckCircle
              className="resolve-icon"
              onClick={markResolved}
              title="Mark Resolved"
            />
          )}
        </div>

        {/* ✅ Replies */}
        <section className="comments-section">
          <h2>Replies</h2>
          {doubt.comments.length === 0 ? (
            <p>No replies yet.</p>
          ) : (
            doubt.comments.map((c) => (
              <div key={c._id} className="comment-item">
                <FiMessageCircle className="comment-icon" />
                <div>
                  <p>{c.text}</p>
                  <small>— {c.createdBy.name}</small>
                </div>
              </div>
            ))
          )}
        </section>

        {/* ✅ Reply form */}
        {doubt.status === "open" && <ReplyForm onReplied={postReply} />}
      </div>
    </div>
  );
};

export default DoubtDetail;
