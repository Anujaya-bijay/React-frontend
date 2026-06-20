import TaskCard from "./TaskCard";

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category: string;
  tags: string[];
  dueDate?: string;
}

interface TaskListProps {
  tasks?: Task[];
  countText?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) => void;
  editingId?: string | number | null;
  setEditingId?: (
    id: string | number | null
  ) => void;
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "Description One",
    priority: "Low",
    completed: false,
    category: "General",
    tags: ["sample"],
    dueDate: "2026-06-25",
  },
  {
    id: 2,
    title: "Task Two",
    description: "Description Two",
    priority: "Medium",
    completed: true,
    category: "Work",
    tags: ["office"],
    dueDate: "2026-06-22",
  },
  {
    id: 3,
    title: "Task Three",
    description: "Description Three",
    priority: "High",
    completed: false,
    category: "Personal",
    tags: ["important"],
    dueDate: "2026-06-18",
  },
];

export default function TaskList({
  tasks = defaultTasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskListProps) {
  return (
    <section id="task-list">
      <h2 id="task-count">
        {countText ??
          `${tasks.length} Tasks`}
      </h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category}
          tags={task.tags}
          dueDate={task.dueDate}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      ))}
    </section>
  );
}