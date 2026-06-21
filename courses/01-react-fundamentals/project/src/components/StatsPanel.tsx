interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category?: string;
  tags?: string[];
}

interface StatsPanelProps {
  tasks?: Task[];
}

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "A",
    description: "D1",
    priority: "High",
    completed: true,
  },
  {
    id: 2,
    title: "B",
    description: "D2",
    priority: "Low",
    completed: false,
  },
];

const StatsPanel = ({
  tasks = defaultTasks,
}: StatsPanelProps) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  return (
    <section id="stats-panel">
      <h2>Task Stats</h2>

      <p>Total: {totalTasks}</p>
      <p>Completed: {completedTasks}</p>
      <p>Pending: {pendingTasks}</p>
    </section>
  );
};

export default StatsPanel;