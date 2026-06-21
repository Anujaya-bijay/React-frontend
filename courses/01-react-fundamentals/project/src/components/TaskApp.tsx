import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category?: string;
  tags?: string[];
}

const STORAGE_KEY = "tasks";

const TaskApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Load tasks safely
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save tasks safely
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add task
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Delete task
  const deleteTask = (id: string | number) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  // Toggle complete
  const toggleTask = (id: string | number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
  };

  // Filter + Search
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    if (filter === "active") {
      return !task.completed && matchesSearch;
    }

    if (filter === "completed") {
      return task.completed && matchesSearch;
    }

    return matchesSearch;
  });

  return (
    <div>
      <h1>Task Manager</h1>

      <TaskForm onAddTask={addTask} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        clearSearch={clearSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      <StatsPanel tasks={tasks} />

      <TaskList
        tasks={filteredTasks}
        onDelete={deleteTask}
        onToggle={toggleTask}
      />
    </div>
  );
};

export default TaskApp;