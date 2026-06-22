import { useTheme } from "../contexts/ThemeContext";

interface TaskCardProps {
  id?: string | number;
  title: string;
  description: string;
  priority: string;
  completed?: boolean;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

const TaskCard = ({
  id,
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
}: TaskCardProps) => {
  const { theme } = useTheme();

  const handleDelete = () => {
    if (onDelete && id !== undefined) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmed) {
        onDelete(id);
      }
    }
  };

  return (
    <article
      id="task-card"
      data-completed={completed}
      className={theme}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => id !== undefined && onToggle?.(id)}
      />

      <h2
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {title}
      </h2>

      <p>{description}</p>
      <p>Priority: {priority}</p>

      {onDelete && id !== undefined && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </article>
  );
};

export default TaskCard;