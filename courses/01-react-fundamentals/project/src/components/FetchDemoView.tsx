import { useEffect, useState } from 'react'

interface Todo {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState('')

  useEffect(() => {
    fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=5'
    )
      .then((res) => res.json())
      .then((data) => {
        setTodos(data)
        setLoading(false)
      })
      .catch(() => {
        setError(
          'Failed to fetch data'
        )
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return (
      <p id="fetch-error">
        {error}
      </p>
    )
  }

  return (
    <ul id="fetch-list">
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title}
        </li>
      ))}
    </ul>
  )
}