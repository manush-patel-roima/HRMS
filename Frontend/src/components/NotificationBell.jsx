import React, {useEffect, useState, useRef} from 'react';
import WebSocketService from '../services/websocket/webSocketService';
import axios from '../api/axiosInstance';

const NotificationItem = ({n, onClick}) => {
    const bgColor = n.isRead ? 'bg-white' : 'bg-blue-50';
    const borderColor = n.isRead ? 'border-l-transparent' : 'border-l-4 border-l-blue-500';

    return (
        <div
            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${bgColor} ${borderColor} transition-colors`}
            onClick={() => onClick(n)}
        >
            <div className={`text-sm ${n.isRead ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'}`}>
                {n.message}
            </div>
            <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            {!n.isRead && (
                <div className="text-xs text-blue-600 mt-1">Click to mark as read</div>
            )}
        </div>
    );
};

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        const fetchList = async () => {
            try{
                const res = await axios.get('/api/notifications');
                if(mountedRef.current) setNotifications(res.data);
            }catch(err){
                if(mountedRef.current) console.error('Error fetching notifications:', err);
            }
        };

        const fetchCount = async () => {
            try{
                const res = await axios.get('/api/notifications/unread-count');
                if(mountedRef.current) setUnreadCount(res.data || 0);
            }catch(err){
                if(mountedRef.current) console.error('Error fetching unread count:', err);
            }
        };

        fetchList();
        fetchCount();

        WebSocketService.connect((message) => {
            
            setNotifications(prev => [message, ...prev]);
            setUnreadCount(c => (c || 0) + 1);
        });

        return () => {
            mountedRef.current = false;
            WebSocketService.disconnect();
        };
    }, []);

    const markRead = async (n) => {
        try{
            await axios.post(`/api/notifications/${n.id}/read`);
            setNotifications(prev => prev.map(x => x.id === n.id ? {...x, isRead:true} : x));
            setUnreadCount(c => Math.max(0, (c || 0) - 1));
            if(n.linkUrl) window.location.href = n.linkUrl;
        }catch(err){
            console.error('Error marking notification as read:', err);
        }
    };

    return (
        <div className="relative">
            <button className="relative" onClick={() => setOpen(v=>!v)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">{unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200 font-semibold text-gray-900">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                        )}
                        {notifications.map(n => (
                            <NotificationItem key={n.id} n={n} onClick={markRead} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
