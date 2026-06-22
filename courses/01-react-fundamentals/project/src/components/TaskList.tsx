import TaskCard from "./TaskCard";

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
    description: "First task",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Second task",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Third task",
    priority: "Low",
    completed: true,
  },
];

const TaskList = ({
  tasks = defaultTasks,
  onToggle,
  onDelete,
}: TaskListProps) => {
  const completedCount = tasks.filter(
    (t) => t.completed
  ).length;

  return (
    <section id="task-list">
      <p id="task-count">
        {completedCount} of {tasks.length} completed
      </p>

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