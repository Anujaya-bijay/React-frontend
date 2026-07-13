import { useMemo } from 'react'
import { useGetPostsQuery } from '../api/apiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSortBy, setFilterUserId, type SortOrder } from '../store/slices/filtersSlice'
import type { Post } from '../api/mockServer'

function applyFiltersAndSort(posts: Post[], filterUserId: number | null, sortBy: SortOrder): Post[] {
  const filtered = filterUserId === null
    ? posts
    : posts.filter((post) => post.userId === filterUserId)

  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'newest' ? b.id - a.id : a.id - b.id
  )

  return sorted
}

function PostsWithFilters() {
  const { data: posts, isLoading, isError } = useGetPostsQuery()
  const { sortBy, filterUserId } = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const uniqueUserIds = useMemo(() => {
    if (!posts) return []
    return Array.from(new Set(posts.map((post) => post.userId))).sort((a, b) => a - b)
  }, [posts])

  const visiblePosts = useMemo(() => {
    if (!posts) return []
    return applyFiltersAndSort(posts, filterUserId, sortBy)
  }, [posts, filterUserId, sortBy])

  if (isLoading) {
    return <p>Loading posts...</p>
  }

  if (isError || !posts) {
    return <p>Failed to load posts.</p>
  }

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <label>
          Sort by:{' '}
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as SortOrder))}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>

        <label>
          Filter by user:{' '}
          <select
            value={filterUserId === null ? 'all' : filterUserId}
            onChange={(e) =>
              dispatch(
                setFilterUserId(e.target.value === 'all' ? null : Number(e.target.value))
              )
            }
          >
            <option value="all">All</option>
            {uniqueUserIds.map((userId) => (
              <option key={userId} value={userId}>
                User {userId}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visiblePosts.length === 0 ? (
        <p>No posts match the current filter.</p>
      ) : (
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong> (user {post.userId})
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PostsWithFilters