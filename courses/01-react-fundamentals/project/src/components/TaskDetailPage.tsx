import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks";
import type { Task } from "./TaskList";

const INITIAL_TASKS: Task[] = [];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks] = useLocalStorage<Task[]>("task-app-tasks", INITIAL_TASKS);

  const task = tasks.find((t) => String(t.id) === String(id));

  return (
    <div id="task-detail-page">
      <button
        id="task-detail-back"
        onClick={() => navigate("/challenge/21-react-router")}
      >
        Back to list
      </button>

      {task ? (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.completed ? "Completed" : "Pending"}</p>
          {task.category && <p>Category: {task.category}</p>}
          {task.dueDate && <p>Due: {task.dueDate}</p>}
          {task.tags && task.tags.length > 0 && (
            <p>Tags: {task.tags.join(", ")}</p>
          )}
        </div>
      ) : (
        <p>Task not found.</p>
      )}
    </div>
  );
}