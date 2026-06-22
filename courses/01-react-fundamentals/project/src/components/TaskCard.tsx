import { useTheme } from "../contexts/ThemeContext";

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function TaskCard({ id, title, description, priority, completed, onToggle, onDelete }: TaskCardProps) {
  const { theme } = useTheme();

  function handleDelete() {
    if (onDelete && window.confirm("Delete this task?")) {
      onDelete(id);
    }
  }

  return (
    <article id="task-card" className={theme} data-completed={completed}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle?.(id)}
      />
      <h2 style={{ textDecoration: completed ? "line-through" : "none" }}>
        {title}
      </h2>
      <p>{description}</p>
      <p>Priority: {priority}</p>
      {onDelete && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </article>
  );
}

export default TaskCard;