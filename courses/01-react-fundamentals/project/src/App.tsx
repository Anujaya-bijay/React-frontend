import TaskApp from "./components/TaskApp";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Learn React",
    description: "Study hooks",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Build Project",
    description: "Complete app",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Practice Coding",
    description: "Solve DSA",
    priority: "Low",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    "task-app-tasks",
    INITIAL_TASKS
  );

  return (
    <ThemeProvider>
      <main>
        <h1>Challenges</h1>
        <TaskApp tasks={tasks} setTasks={setTasks} />
      </main>
    </ThemeProvider>
  );
}

export default App;