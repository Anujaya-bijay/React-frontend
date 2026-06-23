import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onUpdate?: (updates: { title: string; description: string; priority: string }) => void;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  linkToTaskDetail?: boolean;
}

function TaskCard({
  id,
  title,
  description,
  priority,
  completed,
  onToggle,
  onDelete,
  onUpdate,
  isEditing,
  onEditStart,
  onEditCancel,
  linkToTaskDetail,
}: TaskCardProps) {
  const handleToggle = useCallback(() => {
    onToggle?.(id);
  }, [id, onToggle]);

  const handleDelete = useCallback(() => {
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) onDelete?.(id);
  }, [id, onDelete]);

  const titleStyle = useMemo(
    () => ({ textDecoration: completed ? "line-through" : "none" }),
    [completed]
  );

  return (
    <article id="task-card" data-completed={completed ? "true" : "false"}>
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
        />
      )}
      <h2 style={titleStyle}>
        {linkToTaskDetail ? (
          <Link to={`/challenge/21-react-router/task/${id}`}>{title}</Link>
        ) : (
          title
        )}
      </h2>
      <p>{description}</p>
      <p>Priority: {priority}</p>
      <p>Status: {completed ? "Completed" : "Pending"}</p>
      {onDelete && <button onClick={handleDelete}>Delete</button>}
      {onEditStart && !isEditing && (
        <button onClick={onEditStart}>Edit</button>
      )}
      {isEditing && onUpdate && onEditCancel && (
        <EditForm
          title={title}
          description={description}
          priority={priority}
          onUpdate={onUpdate}
          onCancel={onEditCancel}
        />
      )}
    </article>
  );
}

function EditForm({
  title,
  description,
  priority,
  onUpdate,
  onCancel,
}: {
  title: string;
  description: string;
  priority: string;
  onUpdate: (updates: { title: string; description: string; priority: string }) => void;
  onCancel: () => void;
}) {
  const [editTitle, setEditTitle] = React.useState(title);
  const [editDesc, setEditDesc] = React.useState(description);
  const [editPriority, setEditPriority] = React.useState(priority);

  return (
    <div>
      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
      <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
      <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={() => onUpdate({ title: editTitle, description: editDesc, priority: editPriority })}>
        Save
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default React.memo(TaskCard);