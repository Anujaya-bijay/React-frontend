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
  return (
    <section id="task-list">
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