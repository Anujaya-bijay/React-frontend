import TaskCard from "./TaskCard"

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "First hardcoded task",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Second hardcoded task",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Third hardcoded task",
    priority: "Low",
    completed: false,
  },
]

export default function TaskList(props: TaskListProps) {
  const taskList = props.tasks ?? HARDCODED_TASKS
  const countText = props.countText

  return (
    <>
      {countText && <div id="task-count">{countText}</div>}

      <section id="task-list">
        {taskList.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            completed={task.completed}
            onToggle={props.onToggle}
            onDelete={props.onDelete}
            id={task.id}
          />
        ))}
      </section>
    </>
  )
}