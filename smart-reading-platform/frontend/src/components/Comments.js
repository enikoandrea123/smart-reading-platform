import { useState, useEffect } from "react";
import './Comments.css';
import { FaTrash, FaThumbsUp, FaThumbsDown } from "react-icons/fa";


const Comments = ({ bookId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/comments/${bookId}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [bookId]);

  const handleAddComment = async () => {
  if (!newComment.trim()) {
    setError("Comment cannot be empty.");
    return;
  }

  if (liked === null) {
    setError("Please indicate whether you liked the book.");
    return;
  }

  const commentData = {
    user_id: userId,
    book_id: bookId,
    comment: newComment,
    liked: liked,
  };

  console.log("Submitting comment:", commentData);

  try {
    const response = await fetch("/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const result = await response.json();

    const newCommentItem = {
      ...result.comment,
      name: result.username,
      date: new Date().toLocaleDateString(),
      user_id: userId,
    };

    setComments((prevComments) => [newCommentItem, ...prevComments]);
    setNewComment("");
    setLiked(null);
    setError(null);

  } catch (err) {
    console.error("Error adding comment:", err);
    setError("Failed to add comment.");
  }
};

  const handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    setError("User is not authenticated.");
    return;
  }

  try {
    const response = await fetch(`/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );

  } catch (err) {
    console.error("Error deleting comment:", err);
    setError("Failed to delete comment.");
  }
};

  return (
  <div className="comments-container">
    <h3>Comments</h3>

    {comments.length === 0 ? (
      <p>No comments yet. Be the first to comment!</p>
    ) : (
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <strong>{comment.name}</strong> ({comment.date}):<br />
                        {comment.comment}
                                     <br />
            {comment.liked === true && <span><FaThumbsUp/> Liked this book</span>}
            {comment.liked === false && <span><FaThumbsDown/> Didn't like this book</span>}



            {comment.user_id === userId && (
              <div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="delete-btn"
                >
                   <FaTrash />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}

  <div className="add-comment-container">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
        className="textarea"
      />
      <div className="opinion-section">
        <label><strong>Did you like this book?</strong></label>
        <FaThumbsUp
          onClick={() => setLiked(true)}
          style={{
            cursor: 'pointer',
            marginLeft: '0.5rem',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
        <FaThumbsDown
          onClick={() => setLiked(false)}
          style={{
            cursor: 'pointer',
            marginLeft: '1rem',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>

      <button className="submit-btn" onClick={handleAddComment}>Submit</button>

      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
);
};

export default Comments;