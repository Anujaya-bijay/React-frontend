import { useState } from 'react';
import { useAddPostMutation } from '../api/apiSlice';

const AddPostForm = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState(false);

  const [addPost, { isLoading, isError }] = useAddPostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await addPost({
        userId: Number(userId),
        title,
        body,
      }).unwrap();

      setTitle('');
      setBody('');
      setUserId('');
      setSuccess(true);
    } catch {
      // isError handles the UI state
    }
  };

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      <button data-testid="add-post-submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Add Post'}
      </button>

      {success && <div>Post added successfully!</div>}
      {isError && <div>Failed to add post.</div>}
    </form>
  );
};

export default AddPostForm;