import TaskList from './TaskList'

interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
}

interface TaskAppProps {
  tasks: Task[]
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>
  showForm?: boolean
  countFormat?: string
}

export default function TaskApp({
  tasks,
  countFormat = 'tasks',
}: TaskAppProps) {
  const countText =
    countFormat === 'tasks'
      ? `${tasks.length} Tasks`
      : `${tasks.length}`

  return (
    <div id="task-app">
      <p id="task-count">{countText}</p>

      <TaskList
        tasks={tasks}
        countText={countText}
      />
    </div>
  )
}