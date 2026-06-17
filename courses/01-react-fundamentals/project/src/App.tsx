import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ChallengeList from "./components/ChallengeList";
import TaskList from "./components/TaskList";
import TaskApp from "./components/TaskApp";
import TaskDetailPage from "./components/TaskDetailPage";
import FetchDemoView from "./components/FetchDemoView";

import { ThemeProvider } from "./contexts/ThemeContext";

import type { Task } from "./components/TaskList";

const STORAGE_KEY = "task-app-tasks";

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "First Task",
    description: "Description one",
    priority: "High",
    completed: false,
    category: "General",
    tags: [],
  },
  {
    id: 2,
    title: "Second Task",
    description: "Description two",
    priority: "Medium",
    completed: false,
    category: "Work",
    tags: ["office"],
  },
  {
    id: 3,
    title: "Third Task",
    description: "Description three",
    priority: "Low",
    completed: false,
    category: "Personal",
    tags: ["important"],
  },
  {
    id: 4,
    title: "Fourth Task",
    description: "Description four",
    priority: "Medium",
    completed: false,
    category: "General",
    tags: [],
  },
  {
    id: 5,
    title: "Fifth Task",
    description: "Description five",
    priority: "High",
    completed: false,
    category: "Work",
    tags: [],
  },
];

function AppContent() {
  const [tasks, setTasks] =
    useState<Task[]>(() => {
      try {
        const savedTasks =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (!savedTasks) {
          return INITIAL_TASKS;
        }

        const parsedTasks =
          JSON.parse(savedTasks);

        if (
          !Array.isArray(parsedTasks)
        ) {
          return INITIAL_TASKS;
        }

        return parsedTasks.map(
          (task) => ({
            ...task,
            category:
              task.category ||
              "General",
            tags: Array.isArray(
              task.tags
            )
              ? task.tags
              : [],
          })
        );
      } catch {
        return INITIAL_TASKS;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const handleDelete = (
    id: string | number
  ) => {
    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    );
  };

  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ChallengeList />
              }
            />

            <Route
              path="/challenge/01-static-task-display"
              element={<TaskList />}
            />

            <Route
              path="/challenge/02-dynamic-task-rendering"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm={false}
                />
              }
            />

            <Route
              path="/challenge/03-adding-new-tasks"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                />
              }
            />

            <Route
              path="/challenge/04-task-completion-toggle"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                />
              }
            />

            <Route
              path="/challenge/05-task-deletion"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/06-task-filtering"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                />
              }
            />

            <Route
              path="/challenge/08-task-editing"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/09-search-functionality"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/10-useeffect-local-storage"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/11-useeffect-debounced-search"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/12-categories-and-tags"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                  onDelete={
                    handleDelete
                  }
                />
              }
            />

            <Route
              path="/challenge/21-react-router"
              element={
                <TaskApp
                  tasks={tasks}
                  setTasks={setTasks}
                  showForm
                />
              }
            />

            <Route
              path="/challenge/21-react-router/task/:id"
              element={
                <TaskDetailPage />
              }
            />

            <Route
              path="/challenge/22-data-fetching"
              element={
                <FetchDemoView />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;