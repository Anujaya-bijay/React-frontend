import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import TaskList, { type Task } from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'

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

  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all')

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length

  const filteredTasks =
    filter === 'active'
      ? tasks.filter((task) => !task.completed)
      : filter === 'completed'
        ? tasks.filter((task) => task.completed)
        : tasks

  const taskCountText = props.showFilterBar
    ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
    : `${completedCount} of ${tasks.length} completed`

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

      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
        />
      )}

      {filteredTasks.length === 0 && props.showFilterBar ? (
        <p id="filter-empty-message">
          No tasks match this filter
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          countText={taskCountText}
          onToggle={handleToggle}
          onDelete={props.onDelete}
        />
      )}
    </main>
  )
}