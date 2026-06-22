import { useState } from "react";
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

interface TaskAppProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskApp = ({ tasks, setTasks }: TaskAppProps) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const toggleTask = (id: string | number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: string | number) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "active" && !task.completed);

    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase());

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

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default TaskApp;