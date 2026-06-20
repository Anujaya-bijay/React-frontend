import { useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<
    React.SetStateAction<Task[]>
  >;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
}: TaskAppProps) {
  const [sortOrder, setSortOrder] =
    useState<
      | "recent"
      | "high-low"
      | "low-high"
      | "alphabetical"
      | "due-date"
    >("recent");

  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  }

  function handleToggle(
    id: string | number
  ) {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    );
  }

  const sortedTasks = [...tasks];

  if (sortOrder === "high-low") {
    const order = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    sortedTasks.sort(
      (a, b) =>
        order[
          b.priority as keyof typeof order
        ] -
        order[
          a.priority as keyof typeof order
        ]
    );
  }

  if (sortOrder === "low-high") {
    const order = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    sortedTasks.sort(
      (a, b) =>
        order[
          a.priority as keyof typeof order
        ] -
        order[
          b.priority as keyof typeof order
        ]
    );
  }

  if (sortOrder === "alphabetical") {
    sortedTasks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sortOrder === "due-date") {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate)
        return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(
          a.dueDate
        ).getTime() -
        new Date(
          b.dueDate
        ).getTime()
      );
    });
  }

  return (
    <div>
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      <FilterBar
        filter="all"
        onFilterChange={() => {}}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={onDelete}
        countText={`${tasks.length} Tasks`}
      />
    </div>
  );
}