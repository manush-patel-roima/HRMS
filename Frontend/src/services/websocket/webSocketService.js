import SockJS from "sockjs-client";
import Stomp from "stompjs";
import AuthService from "../auth/authService";

let stompClient = null;
let socket = null;
class WebSocketService{
    static connect(onMessageReceived) {

        const token = AuthService.getToken();
        const employeeId = localStorage.getItem("employeeId");

        const url = token ? `http://localhost:8080/ws?token=${encodeURIComponent(token)}` : "http://localhost:8080/ws";
        socket = new SockJS(url);
        stompClient = Stomp.over(socket);
        
        stompClient.debug = null;

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        stompClient.connect(headers, () => {
            
            try{
                stompClient.subscribe('/user/queue/notifications', (message) => {
                    if (message && message.body) {
                        let payload = null;
                        try { payload = JSON.parse(message.body); } catch(e){ payload = message.body; }
                        onMessageReceived(payload);
                    }
                });
            }catch(err){
                console.error('subscribe error', err);
            }

            
            if (employeeId) {
                stompClient.subscribe(`/topic/notifications/${employeeId}`, (message) => {
                    if (message && message.body) {
                        let payload = null;
                        try { payload = JSON.parse(message.body); } catch(e){ payload = message.body; }
                        onMessageReceived(payload);
                    }
                });
            }
        }, (err) => {
            console.error('WebSocket connect error', err);
        });

    };


    static disconnect () {
        if (stompClient) {
            try{
                stompClient.disconnect(() => {
                    console.log("Disconnected");
                });
            }catch(e){
                console.log(e);
            }
            stompClient = null;
        }
        if (socket) {
            try{ 
                socket.close(); 
            }catch(e){
                console.log(e);
            }
            socket = null;
        }
    };

}


export default WebSocketService;