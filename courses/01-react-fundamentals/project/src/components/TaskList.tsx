import TaskCard from "./TaskCard";

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category?: string;
  tags?: string[];
  dueDate?: string;
}

interface TaskListProps {
  tasks?: Task[];
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  countText?: string;
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void;
  editingId?: string | number | null;
  setEditingId?: (id: string | number | null) => void;
}

const defaultTasks: Task[] = [
  { id: 1, title: "Task One", description: "First task", priority: "High", completed: false },
  { id: 2, title: "Task Two", description: "Second task", priority: "Medium", completed: true },
  { id: 3, title: "Task Three", description: "Third task", priority: "Low", completed: false },
];

function TaskList({
  tasks = defaultTasks,
  onToggle,
  onDelete,
  countText,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskListProps) {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section id="task-list">
      <p id="task-count">
        {countText ?? `${completedCount} of ${tasks.length} completed`}
      </p>

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
          onUpdate={onUpdateTask ? (updates) => onUpdateTask(task.id, updates) : undefined}
          isEditing={editingId === task.id}
          onEditStart={setEditingId ? () => setEditingId(task.id) : undefined}
          onEditCancel={setEditingId ? () => setEditingId(null) : undefined}
        />
      ))}
    </section>
  );
}

export default TaskList;