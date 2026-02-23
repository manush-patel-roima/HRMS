import React, {useState} from 'react';
import socialService from '../services/social/socialService';

export default function SocialPostCard({post, currentUser, onDeleted, onUpdated}){
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likes, setLikes] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDescription, setEditDescription] = useState(post.description);
  const [editTags, setEditTags] = useState(post.tags || '');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const toggleLike = async ()=>{
    try{
      await socialService.toggleLike(post.id);
      setLiked(!liked);
      setLikes(liked? likes-1 : likes+1);
    }catch(err){
      console.error('Error toggling like:', err);
    }
  }

  const submitComment = async ()=>{
    if(!commentText.trim()) return;
    try{
      const res = await socialService.addComment(post.id, commentText);
      post.comments = post.comments || [];
      post.comments.push(res);
      post.commentCount = post.commentCount + 1;
      setCommentText('');
      setShowComments(true);
    }catch(err){
      console.error('Error adding comment:', err);
    }
  }

  const handleEdit = async () => {
    if(!editTitle.trim()) {
      return;
    }
    try {
      setIsLoading(true);
      const updatedPost = await socialService.editPost(post.id, {
        title: editTitle,
        description: editDescription,
        tags: editTags
      });
      post.title = editTitle;
      post.description = editDescription;
      post.tags = editTags;
      setShowEditModal(false);
      if(onUpdated) onUpdated(updatedPost);
    } catch(err) {
      console.error('Error editing post:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if(!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      setIsLoading(true);
      await socialService.deletePost(post.id);
      if(onDeleted) onDeleted(post.id);
    } catch(err) {
      console.error('Error deleting post:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      setIsLoading(true);
      await socialService.deleteComment(commentId);
      post.comments = post.comments.filter(c => c.id !== commentId);
      post.commentCount = post.commentCount - 1;
    } catch(err) {
      console.error('Error deleting comment:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditCommentStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  }

  const handleEditCommentSave = async (commentId) => {
    if(!editCommentText.trim()) return;
    try {
      setIsLoading(true);
      const updated = await socialService.editComment(commentId, editCommentText);
      post.comments = post.comments.map(c => c.id === commentId ? {...c, text: editCommentText} : c);
      setEditingCommentId(null);
      setEditCommentText('');
    } catch(err) {
      console.error('Error editing comment:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  }

  const isOwner = currentUser && currentUser.employeeId === post.authorId;
  const isHr = currentUser && currentUser.roleName === 'HR';

  return (
    <div className={`bg-white rounded-lg shadow p-4 mb-4 ${post.isSystemGenerated? 'border-l-4 border-yellow-400' : 'border-l-4 border-blue-400'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-600">
            {post.authorName}
            {post.isSystemGenerated && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">🎉 System Generated</span>}
          </div>
          <div className="text-lg font-semibold">{post.title}</div>
          <div className="text-sm text-gray-700 mt-2">{post.description}</div>
          {post.tags && <div className="text-xs text-gray-500 mt-2">Tags: {post.tags}</div>}
        </div>
        <div className="text-right ml-4">
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
          {(isOwner || isHr) && <div className="mt-2 text-sm space-x-2">
            <button onClick={handleDelete} disabled={isLoading} className="text-red-500 hover:text-red-700 disabled:opacity-50 font-semibold">Delete</button>
            {isOwner && <button onClick={() => setShowEditModal(true)} disabled={isLoading} className="text-blue-600 hover:text-blue-800 disabled:opacity-50 font-semibold">Edit</button>}
          </div>}
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-4">
        <button onClick={toggleLike} disabled={isLoading} className={`text-sm font-semibold ${liked? 'text-blue-600' : 'text-gray-600'} disabled:opacity-50`}>
           Like ({likes})
        </button>
        <button onClick={()=>setShowComments(!showComments)} disabled={isLoading} className="text-sm text-gray-600 disabled:opacity-50 font-semibold">
           Comments ({post.commentCount})
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map(c=> {
                const canDeleteComment = currentUser && (currentUser.employeeId === c.commenterId || currentUser.roleName === 'HR');
                const canEditComment = currentUser && currentUser.employeeId === c.commenterId;
                const isEditingThis = editingCommentId === c.id;

                return (
                  <div key={c.id} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{c.commenterName}</div>
                        {isEditingThis ? (
                          <div className="mt-2">
                            <textarea
                              value={editCommentText}
                              onChange={e=>setEditCommentText(e.target.value)}
                              className="w-full border rounded p-2 text-sm"
                              disabled={isLoading}
                              rows="2"
                            />
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleEditCommentSave(c.id)}
                                disabled={isLoading}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleEditCommentCancel}
                                disabled={isLoading}
                                className="px-2 py-1 border rounded text-xs hover:bg-gray-200 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700 mt-1">{c.text}</div>
                        )}
                      </div>
                      {!isEditingThis && (canDeleteComment || canEditComment) && (
                        <div className="ml-2 text-xs space-x-1">
                          {canEditComment && (
                            <button
                              onClick={() => handleEditCommentStart(c)}
                              disabled={isLoading}
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              Edit
                            </button>
                          )}
                          {canDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              disabled={isLoading}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex space-x-2 pt-3 border-t">
            <input
              value={commentText}
              onChange={e=>setCommentText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 border rounded p-2 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={submitComment}
              disabled={isLoading || !commentText.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
            <input
              value={editTitle}
              onChange={e=>setEditTitle(e.target.value)}
              placeholder="Title"
              className="w-full border p-2 rounded mb-3"
              disabled={isLoading}
            />
            <textarea
              value={editDescription}
              onChange={e=>setEditDescription(e.target.value)}
              placeholder="Description"
              className="w-full border p-2 rounded mb-3 h-20"
              disabled={isLoading}
            />
            <input
              value={editTags}
              onChange={e=>setEditTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full border p-2 rounded mb-3"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={()=>setShowEditModal(false)}
                disabled={isLoading}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >Cancel</button>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
              >{isLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
