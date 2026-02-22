import React, {useEffect, useState} from 'react';
import socialService from '../services/social/socialService';
import SocialPostCard from './SocialPostCard';
import AuthService from '../services/auth/authService';
import CreatePostModal from './CreatePostModal';

export default function SocialFeed(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const currentUser = AuthService.getCurrentUser();

  const load = async ()=>{
    setLoading(true);
    try{
      const data = await socialService.feed(page,20,{});
      setPosts(data);
    }catch(err){console.error(err);}finally{setLoading(false)}
  }

  useEffect(()=>{load()},[page]);

  const onCreated = (newPost)=>{
    setPosts(prev => [newPost, ...prev]);
  }

  const onDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  const onUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Achievements & Celebrations</h2>
        <CreatePostModal onCreated={onCreated} />
      </div>

      {loading && <div>Loading...</div>}

      <div>
        {posts.map(p=> <SocialPostCard key={p.id} post={p} currentUser={currentUser} onDeleted={onDeleted} onUpdated={onUpdated} />)}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <button onClick={()=>setPage(Math.max(0,page-1))} className="px-3 py-1 border rounded">Previous</button>
        <button onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  )
}
