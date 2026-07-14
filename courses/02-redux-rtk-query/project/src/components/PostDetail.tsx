import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../api/apiSlice';
import ErrorDisplay from './ErrorDisplay';

interface PostDetailProps {
  postId?: number;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { postId: paramId } = useParams<{ postId?: string }>();
  const id = postId ?? (paramId ? Number(paramId) : undefined);

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPostByIdQuery(id as number, { skip: !id });

  if (!id) {
    return <div data-testid="post-detail-error">No post id provided.</div>;
  }

  if (isLoading) {
    return <div data-testid="post-detail-loading">Loading post...</div>;
  }

  if (isError) {
    return (
      <div data-testid="post-detail-error">
        <ErrorDisplay error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <article data-testid="post-detail">
      <h2>{post?.title}</h2>
      <p>{post?.body}</p>
    </article>
  );
};

export default PostDetail;