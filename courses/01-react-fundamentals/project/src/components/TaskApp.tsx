import type { Dispatch, SetStateAction } from 'react'
import TaskList, { type Task } from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp(props: TaskAppProps) {
  const tasks = props.tasks ?? []

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  const taskCountText =
    `${completedCount} of ${tasks.length} completed`

  function handleToggle(id: string | number) {
    if (props.setTasks) {
      props.setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        )
      )
    }
  }

  function handleAddTask(newTask: Task) {
    if (props.setTasks) {
      props.setTasks((prevTasks) => [
        ...prevTasks,
        newTask,
      ])
    }
  }

  return (
    <main>
      {props.showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        countText={taskCountText}
        onToggle={handleToggle}
        onDelete={props.onDelete}
      />
    </main>
  )
}