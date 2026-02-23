import React, {useState} from 'react';
import socialService from '../services/social/socialService';

export default function CreatePostModal({onCreated}){
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async ()=>{
    setLoading(true);
    try{
      const payload = { title, description };
      const res = await socialService.createPost(payload);
      onCreated && onCreated(res);
      setOpen(false);
      setTitle('');
      setDescription('');
    }catch(err){
      console.error('Error creating post:', err);
    }finally{
      setLoading(false);
    }
  }

  if(!open) return <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Create Post</button>

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Create Post</h3>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded mb-3" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-3" rows="6" />
        <div className="flex justify-end space-x-3">
          <button onClick={()=>setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={submit} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400">{loading ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
    </div>
  )
}

