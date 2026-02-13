import SockJS from "sockjs-client";
import Stomp from "stompjs";
import AuthService from "../auth/authService";

let stompClient = null;

class WebSocketService{
    static connect(onMessageReceived) {

        const employeeId = localStorage.getItem("employeeId");

        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = Stomp.over(socket);

        stompClient.connect({},()=>{
            stompClient.subscribe(
                `/topic/notifications/${employeeId}`,
                (message)=>{
                    onMessageReceived(JSON.parse(message.body));
                }
            );
        });

    };



    static disconnect () {
        if(stompClient){
            stompClient.disconnect();
        }
    };

}


export default WebSocketService;