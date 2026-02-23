import React, {useState} from 'react';
import socialService from '../services/social/socialService';

export default function CreatePostModal({onCreated}){
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async ()=>{
    if(!title.trim()) return;
    setLoading(true);
    try{
      const payload = {
        title,
        description,
        tags: tags ? tags : null
      };
      const res = await socialService.createPost(payload);
      onCreated && onCreated(res);
      setOpen(false);
      setTitle('');
      setDescription('');
      setTags('');
    }catch(err){
      console.error('Error creating post:', err);
    }finally{
      setLoading(false);
    }
  }

  if(!open) return <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"> Create Post</button>

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:border-blue-600"
          disabled={loading}
        />
        <textarea
          value={description}
          onChange={e=>setDescription(e.target.value)}
          placeholder="Share your achievement or thought..."
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:border-blue-600"
          rows="6"
          disabled={loading}
        />
        <input
          value={tags}
          onChange={e=>setTags(e.target.value)}
          placeholder="Tags (comma separated, optional)"
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:border-blue-600"
          disabled={loading}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={()=>{setOpen(false); setTitle(''); setDescription(''); setTags('');}}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

