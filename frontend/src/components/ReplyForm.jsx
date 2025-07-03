import { useState } from "react";
import "../styles/ReplyForm.css";

const ReplyForm = ({ onReplied }) => {
  const [text, setText] = useState("");

  const handleClick = () => {
    if (text.trim() === "") return;
    onReplied(text, () => setText(""));
  };

  return (
    <div className="reply-form-inline">
      <input
        type="text"
        className="reply-input"
        placeholder="Your reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        className="reply-button"
        onClick={handleClick}
      >
        Reply
      </button>
    </div>
  );
};

export default ReplyForm;
