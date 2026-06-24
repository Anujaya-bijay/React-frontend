import { useEffect, useState, useCallback, useMemo } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import ErrorBoundary from "./ErrorBoundary";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: (value: Task[] | ((prev: Task[]) => Task[])) => void;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
  linkToTaskDetail?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
  showStatsPanel,
  linkToTaskDetail,
}: TaskAppProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleAddTask = useCallback((task: Task) => {
    if (setTasks) setTasks((prev) => [...prev, task]);
  }, [setTasks]);

  const handleToggle = useCallback((id: string | number) => {
    if (!setTasks) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const handleUpdateTask = useCallback((
    id: string | number,
    updates: { title: string; description: string; priority: string }
  ) => {
    if (!setTasks) return;
    if (!updates.title.trim()) return;
    setTasks((prev) =>
      prev.map((task) => task.id === id ? { ...task, ...updates } : task)
    );
    setEditingId(null);
  }, [setTasks]);

  const sortedTasks = useMemo(() => {
    const statusFiltered =
      filter === "all" ? tasks
      : filter === "active" ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

    return statusFiltered.filter((task) => {
      const s = debouncedSearch.toLowerCase();
      return (
        task.title.toLowerCase().includes(s) ||
        task.description.toLowerCase().includes(s)
      );
    });
  }, [tasks, filter, debouncedSearch]);

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {showStatsPanel && <StatsPanel tasks={tasks} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          setSearch={setSearch}
        />
      )}

      <ErrorBoundary>
        {sortedTasks.length === 0 ? (
          <div id="filter-empty-message">No tasks found</div>
        ) : (
          <TaskList
            tasks={sortedTasks}
            onToggle={handleToggle}
            onDelete={onDelete}
            onUpdateTask={handleUpdateTask}
            editingId={editingId}
            setEditingId={setEditingId}
            linkToTaskDetail={linkToTaskDetail}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}