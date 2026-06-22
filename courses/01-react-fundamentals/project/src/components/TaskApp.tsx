import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: (value: Task[] | ((prev: Task[]) => Task[])) => void;
}

const DEFAULT_TASKS: Task[] = [];

function TaskApp({ tasks: externalTasks, setTasks: externalSetTasks }: TaskAppProps) {
  const [internalTasks, setInternalTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Use external state if provided, otherwise fall back to internal state
  const tasks = externalTasks ?? internalTasks;
  const setTasks = externalSetTasks ?? setInternalTasks;

  const addTask = (task: { title: string; description: string; priority: string; completed: boolean }) => {
    const newTask: Task = { id: Date.now(), ...task };
    setTasks((prev = []) => [...prev, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev = []) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev = []) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "active" && !task.completed);
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <TaskForm onAddTask={addTask} />
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        setSearch={setSearch}
        clearSearch={() => setSearch("")}
      />
      <StatsPanel tasks={tasks} />
      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}

export default TaskApp;