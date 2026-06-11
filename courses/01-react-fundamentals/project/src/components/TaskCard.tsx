interface TaskCardProps {
  id?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      id="task-card"
      data-completed={completed ? "true" : "false"}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {
            onToggle(id ?? 0)
          }}
        />
      )}

      <h2
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {title}
      </h2>

      <p>{description}</p>

      <p>Priority: {priority}</p>

      {onDelete && (
        <button
          onClick={() => {
            const confirmed = window.confirm("Delete task?")

            if (confirmed) {
              onDelete(id ?? 0)
            }
          }}
        >
          Delete
        </button>
      )}
    </article>
  )
}