import { useMemo } from "react";
import type { Task } from "./TaskList";

interface StatsPanelProps {
  tasks: Task[];
}

export default function StatsPanel({
  tasks,
}: StatsPanelProps) {
  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.completed
    ).length;

    const active = tasks.filter(
      (task) => !task.completed
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) < today
    ).length;

    const completedPercentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    const categoryBreakdown =
      tasks.reduce(
        (acc, task) => {
          acc[task.category] =
            (acc[task.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    const priorityBreakdown =
      tasks.reduce(
        (acc, task) => {
          acc[task.priority] =
            (acc[task.priority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return {
      total,
      completed,
      active,
      overdue,
      completedPercentage,
      categoryBreakdown,
      priorityBreakdown,
    };
  }, [tasks]);

  return (
    <section
      id="stats-panel"
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "20px",
      }}
    >
      <h2>Task Statistics</h2>

      <p>Total Tasks: {stats.total}</p>

      <p>
        Completed: {stats.completed} (
        {stats.completedPercentage}%)
      </p>

      <p>Active: {stats.active}</p>

      <p>Overdue: {stats.overdue}</p>

      <div
        role="progressbar"
        aria-valuenow={
          stats.completedPercentage
        }
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: "100%",
          border: "1px solid #aaa",
          height: "20px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            width: `${stats.completedPercentage}%`,
            height: "100%",
            background: "green",
          }}
        />
      </div>

      <h3>By Category</h3>
      {Object.entries(
        stats.categoryBreakdown
      ).map(([category, count]) => (
        <p key={category}>
          {category}: {count}
        </p>
      ))}

      <h3>By Priority</h3>
      {Object.entries(
        stats.priorityBreakdown
      ).map(([priority, count]) => (
        <p key={priority}>
          {priority}: {count}
        </p>
      ))}
    </section>
  );
}