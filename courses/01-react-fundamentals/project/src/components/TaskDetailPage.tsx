import { useNavigate } from "react-router-dom";

export default function TaskDetailPage() {
  const navigate = useNavigate();

  return (
    <div id="task-detail-page">
      <button
        id="task-detail-back"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h2>Task Details</h2>
    </div>
  );
}