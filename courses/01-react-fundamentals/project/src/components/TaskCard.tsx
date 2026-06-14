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
      data-completed={completed}
      style={{
        backgroundColor: completed ? "#e5ffe5" : "white",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id!)}
        />
      )}

      <h2
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {description}
      </p>

      <p>Priority: {priority}</p>

      {onDelete && (
        <button
         onClick={() => {
           const confirmed = window.confirm("Are you sure?")

           if (confirmed && onDelete) {
             onDelete(id!)
           }
      }}
    > 
     Delete
  </button>
)}
</article>
)
}