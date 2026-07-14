import React from 'react';
import { useGetUsersQuery } from '../store/usersApi'; // adjust path/name to match your setup
import ErrorDisplay from './ErrorDisplay';

const UsersList: React.FC = () => {
  const { data: users, isLoading, isError, error, refetch } = useGetUsersQuery();

  if (isLoading) {
    return <div data-testid="users-loading">Loading users...</div>;
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <ul data-testid="users-list">
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UsersList;