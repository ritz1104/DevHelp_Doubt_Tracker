import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/CreateDoubt.css";

const CreateDoubt = () => {
  const [form, setForm] = useState({ title: "", description: "", fileUrl: "" });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);

  // Either attach a file OR a URL, not both
  if (file) {
    formData.append("screenshot", file);
  } else if (form.fileUrl) {
    formData.append("fileUrl", form.fileUrl);
  }

  try {
    await api.post("/doubts", formData);
    toast.success("Doubt posted successfully!");
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.response?.data?.msg || "Error posting doubt");
  }
};



  return (
    <div className="create-doubt-container">
      <h2>Post a New Doubt</h2>
      <form onSubmit={handleSubmit} autoComplete="off" className="create-doubt-form">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="input-field"
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <input
          name="fileUrl"
          placeholder="Or paste image URL"
          value={form.fileUrl}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default CreateDoubt;
