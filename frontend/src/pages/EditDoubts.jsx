import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "../styles/EditDoubts.css"; 

const EditDoubt = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
  });
  const navigate = useNavigate();

  // Fetch this doubt by ID
  useEffect(() => {
    const fetchDoubt = async () => {
      try {
        const { data: doubt } = await api.get(`/doubts/${id}`);
        if (doubt.status === "resolved") {
          toast.error("Cannot edit a resolved doubt");
          return navigate("/dashboard");
        }
        setForm({
          title: doubt.title,
          description: doubt.description,
          fileUrl: doubt.fileUrl || "",
        });
      } catch (err) {
        toast.error("Error fetching doubt");
        navigate("/dashboard");
      }
    };
    fetchDoubt();
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/doubts/${id}`, form);
      toast.success("Doubt updated successfully");
      navigate("/dashboard");   // ◀️ back to main dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating doubt");
    }
  };

  return (
    <div className="edit-doubt-page">
      <Navbar />
      <div className="edit-doubt-container">
        <h2>Edit Doubt</h2>
        <form onSubmit={handleSubmit} className="edit-doubt-form">
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Screenshot URL (optional)
            <input
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditDoubt;
