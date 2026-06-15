import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    }
  ) => void
  editingId?: string | number | null
  setEditingId?: (
    id: string | number | null
  ) => void
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'Description One',
    priority: 'Low',
    completed: false,
  },
]

export default function TaskList({
  tasks = defaultTasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskListProps) {
  return (
    <section id="task-list">
      <h2 id="task-count">
        {countText ?? `${tasks.length} Tasks`}
      </h2>

      <ul>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            completed={task.completed}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateTask={onUpdateTask}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </ul>
    </section>
  )
}