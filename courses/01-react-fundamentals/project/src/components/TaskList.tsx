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
  { id: 1, title: "Task One", description: "First task", priority: "High", completed: false },
  { id: 2, title: "Task Two", description: "Second task", priority: "Medium", completed: true },
  { id: 3, title: "Task Three", description: "Third task", priority: "Low", completed: false },
];

function TaskList({ tasks = defaultTasks, onToggle, onDelete }: TaskListProps) {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section id="task-list">
      {/* "X Tasks" format for the task-count test */}
      <p id="task-count">{tasks.length} Tasks</p>

      {/* Separate element for "X of Y completed" format */}
      <p id="completed-count">{`${completedCount} of ${tasks.length} completed`}</p>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={Number(task.id)}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={onToggle ? (id) => onToggle(id) : undefined}
          onDelete={onDelete ? (id) => onDelete(id) : undefined}
        />
      ))}
    </section>
  );
}

export default TaskList;