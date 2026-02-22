import axios from '../../api/axiosInstance';

const API_BASE = '/api/social';

const feed = (page=0,size=20, filters={}) => {
  const params = { page, size, ...filters };
  return axios.get(`${API_BASE}/feed`, { params }).then(r=>r.data);
}

const createPost = (payload) => {
  return axios.post(`${API_BASE}/posts`, payload).then(r=>r.data);
}

const getPost = (id) => axios.get(`${API_BASE}/posts/${id}`).then(r=>r.data);

const addComment = (postId, text) => axios.post(`${API_BASE}/posts/${postId}/comments`, { text }).then(r=>r.data);

const toggleLike = (postId) => axios.post(`${API_BASE}/posts/${postId}/like`).then(r=>r.data);

const editPost = (postId, payload) => axios.put(`${API_BASE}/posts/${postId}`, payload).then(r=>r.data);

const deletePost = (postId) => axios.delete(`${API_BASE}/posts/${postId}`).then(r=>r.data);

const deleteComment = (commentId) => axios.delete(`${API_BASE}/comments/${commentId}`).then(r=>r.data);

export default {
  feed,
  createPost,
  getPost,
  addComment,
  toggleLike,
  editPost,
  deletePost,
  deleteComment
};
