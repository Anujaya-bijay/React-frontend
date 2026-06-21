import { useTheme } from "../contexts/ThemeContext";

interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

const TaskCard = ({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
}: TaskCardProps) => {
  const { theme } = useTheme();

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure?")) {
      onDelete(id);
    }
  };

  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        backgroundColor:
          theme === "dark" ? "#333" : "#f9f9f9",
        color: theme === "dark" ? "#fff" : "#000",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          textDecoration: completed
            ? "line-through"
            : "none",
        }}
      >
        {title}
      </h2>

      <p>{description}</p>
      <p>Priority: {priority}</p>

      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      )}

      {onDelete && (
        <button onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  );
};

export default TaskCard;