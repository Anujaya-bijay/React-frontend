import { useState } from "react";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
    };

    onAddTask(newTask);

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Low");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;