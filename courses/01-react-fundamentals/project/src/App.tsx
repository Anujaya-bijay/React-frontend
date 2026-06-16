import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  },
  {
    id: 2,
    title: "Second Task",
    description: "Description two",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Third Task",
    description: "Description three",
    priority: "Low",
    completed: false,
  },
  {
    id: 4,
    title: "Fourth Task",
    description: "Description four",
    priority: "Medium",
    completed: false,
  },
  {
    id: 5,
    title: "Fifth Task",
    description: "Description five",
    priority: "High",
    completed: false,
  },
];

function AppContent() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
     