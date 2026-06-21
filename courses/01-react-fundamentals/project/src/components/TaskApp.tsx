import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import {
  ThemeProvider,
  useTheme,
} from "../contexts/ThemeContext";
import useLocalStorage from "../hooks/useLocalStorage";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "First task description",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Second task description",
    priority: "Medium",
    completed: true,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Third task description",
    priority: "Low",
    completed: false,
  },
];

const TaskAppContent = () => {
  const { theme, toggleTheme } = useTheme();

  const [tasks, setTasks] =
    useLocalStorage<Task[]>(
      "task-app-tasks",
      defaultTasks
    );

  const [filter, setFilter] =
    useState("all");
  const [search, setSearch] =
    useState("");

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      task,
    ]);
  };

  const deleteTask = (
    id: string | number
  ) => {
    setTasks((prevTasks) =>
      prevTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  const toggleTask = (
    id: string | number
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  const filteredTasks =
    tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        task.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      if (filter === "active") {
        return (
          !task.completed &&
          matchesSearch
        );
      }

      if (filter === "completed") {
        return (
          task.completed &&
          matchesSearch
        );
      }

      return matchesSearch;
    });

  return (
    <div
      data-theme={theme}
      style={{
        backgroundColor:
          theme === "dark"
            ? "#111"
            : "#fff",
        color:
          theme === "dark"
            ? "#fff"
            : "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1>Task Manager</h1>

      <button
        id="theme-toggle"
        onClick={toggleTheme}
      >
        Switch to{" "}
        {theme === "light"
          ? "Dark"
          : "Light"}{" "}
        Mode
      </button>

      <TaskForm
        onAddTask={addTask}
      />

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

const TaskApp = () => {
  return (
    <ThemeProvider>
      <TaskAppContent />
    </ThemeProvider>
  );
};

export default TaskApp;