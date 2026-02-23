import axios from '../../api/axiosInstance';
import { showSuccessToast } from '../../utils/toastUtils';

const API_BASE = '/api/social';

const feed = (page = 0, size = 20, filters = {}) => {
  const params = { page, size, ...filters };
  return axios.get(`${API_BASE}/feed`, { params }).then(r => r.data);
}

const createPost = (payload) => {
  return axios.post(`${API_BASE}/posts`, payload).then(r => {
    showSuccessToast('Post created successfully!');
    return r.data;
  });
}

const getPost = (id) => axios.get(`${API_BASE}/posts/${id}`).then(r => r.data);

const addComment = (postId, text) => {
  return axios.post(`${API_BASE}/posts/${postId}/comments`, { text }).then(r => {
    showSuccessToast('Comment added successfully!');
    return r.data;
  });
}

const toggleLike = (postId) => {
  return axios.post(`${API_BASE}/posts/${postId}/like`).then(r => {
    showSuccessToast('Like toggled successfully!');
    return r.data;
  });
}

const editPost = (postId, payload) => {
  return axios.put(`${API_BASE}/posts/${postId}`, payload).then(r => {
    showSuccessToast('Post updated successfully!');
    return r.data;
  });
}

const deletePost = (postId) => {
  return axios.delete(`${API_BASE}/posts/${postId}`).then(r => {
    showSuccessToast('Post deleted successfully!');
    return r.data;
  });
}

const deleteComment = (commentId) => {
  return axios.delete(`${API_BASE}/comments/${commentId}`).then(r => {
    showSuccessToast('Comment deleted successfully!');
    return r.data;
  });
}

const editComment = (commentId, text) => {
  return axios.put(`${API_BASE}/comments/${commentId}`, { text }).then(r => {
    showSuccessToast('Comment updated successfully!');
    return r.data;
  });
}

export default {
  feed,
  createPost,
  getPost,
  addComment,
  toggleLike,
  editPost,
  deletePost,
  deleteComment,
  editComment
};
