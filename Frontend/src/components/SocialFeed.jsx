import React, {useEffect, useState} from 'react';
import socialService from '../services/social/socialService';
import SocialPostCard from './SocialPostCard';
import AuthService from '../services/auth/authService';
import CreatePostModal from './CreatePostModal';

export default function SocialFeed(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState({
    authorId: '',
    tag: '',
    fromDate: '',
    toDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);

  const currentUser = AuthService.getCurrentUser();

  const load = async ()=>{
    setLoading(true);
    try{
      const filterParams = {};
      if(filters.authorId) filterParams.authorId = parseInt(filters.authorId);
      if(filters.tag) filterParams.tag = filters.tag;
      if(filters.fromDate) filterParams.fromDate = filters.fromDate;
      if(filters.toDate) filterParams.toDate = filters.toDate;

      const data = await socialService.feed(page, 20, filterParams);
      setPosts(data);
    }catch(err){console.error(err);}finally{setLoading(false)}
  }

  useEffect(()=>{load()},[page, filters]);

  const onCreated = (newPost)=>{
    setPage(0);
    setPosts(prev => [newPost, ...prev]);
  }

  const onDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  const onUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({...prev, [field]: value}));
    setPage(0);
  }

  const resetFilters = () => {
    setFilters({
      authorId: '',
      tag: '',
      fromDate: '',
      toDate: ''
    });
    setPage(0);
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Achievements & Celebrations</h2>
        <CreatePostModal onCreated={onCreated} />
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span className="mr-2">🔍</span>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Active</span>}
        </button>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Tag</label>
              <input
                type="text"
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                placeholder="Enter tag name..."
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">From Date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">To Date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Author ID</label>
              <input
                type="number"
                value={filters.authorId}
                onChange={(e) => handleFilterChange('authorId', e.target.value)}
                placeholder="Enter author employee ID..."
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading posts...</p>
          </div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No posts found. {hasActiveFilters ? 'Try adjusting your filters.' : 'Be the first to create one!'}</p>
        </div>
      )}

      <div>
        {posts.map(p=> <SocialPostCard key={p.id} post={p} currentUser={currentUser} onDeleted={onDeleted} onUpdated={onUpdated} />)}
      </div>

      {posts.length > 0 && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={()=>setPage(Math.max(0,page-1))}
            disabled={page === 0 || loading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-gray-600">Page {page + 1}</span>
          <button
            onClick={()=>setPage(page+1)}
            disabled={posts.length < 20 || loading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
