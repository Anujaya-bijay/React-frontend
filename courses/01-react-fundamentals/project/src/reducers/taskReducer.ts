export const SET_TASKS = "SET_TASKS";
export const ADD_TASK = "ADD_TASK";
export const TOGGLE_TASK = "TOGGLE_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";

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

type TaskAction =
  | { type: typeof SET_TASKS; payload: Task[] }
  | { type: typeof ADD_TASK; payload: Task }
  | { type: typeof TOGGLE_TASK; payload: string | number }
  | { type: typeof DELETE_TASK; payload: string | number }
  | { type: typeof UPDATE_TASK; payload: { id: string | number; updates: Partial<Task> } };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case SET_TASKS:
      return action.payload;
    case ADD_TASK:
      return [...state, action.payload];
    case TOGGLE_TASK:
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload);
    case UPDATE_TASK:
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      );
    default:
      return state;
  }
}