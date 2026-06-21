import TaskCard from "./TaskCard";
import { useTheme } from "../contexts/ThemeContext";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

interface TaskListProps {
  tasks?: Task[];
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
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

const TaskList = ({
  tasks = defaultTasks,
  onToggle,
  onDelete,
}: TaskListProps) => {
  const { theme } = useTheme();

  return (
    <section
      id="task-list"
      style={{
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        padding: "15px",
        borderRadius: "8px",
      }}
    >
      <p id="task-count">{tasks.length} Tasks</p>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          {...task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default TaskList;