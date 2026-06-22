interface Task {
  completed: boolean;
}

interface StatsPanelProps {
  tasks?: Task[];
}

function StatsPanel({ tasks = [] }: StatsPanelProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  return (
    <section data-testid="stats-panel" id="stats-panel">
      <p>{`Total: ${total}`}</p>
      <p>{`Completed: ${completed}`}</p>
    </section>
  );
}

export default StatsPanel;