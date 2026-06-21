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
  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure?")) {
      onDelete(id);
    }
  };

  return (
    <article id="task-card" data-completed={completed}>
      <h2
        style={{
          textDecoration: completed ? "line-through" : "none",
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