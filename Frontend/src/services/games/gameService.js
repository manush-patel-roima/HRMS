import axiosInstance from "../../api/axiosInstance";

class GameService{

  static getGames = () => {
    return axiosInstance.get("/api/games/games");
  }

  static toggleInterest = (gameId) => {
    return axiosInstance.post(`/api/games/interest/${gameId}`);
  }

  static getUpcomingSlots = (gameId) =>{
    return axiosInstance.get(`/api/games/upcoming-slots/${gameId}`);
  }  

  static bookSlot = (data) => {
    return axiosInstance.post("/api/games/book", data);
  }
  static getMyBookings = () =>{
    return axiosInstance.get("/api/games/my-bookings");
  }
  static cancelBooking = (bookingGroupId) =>{
    return axiosInstance.post(`/api/games/cancel/${bookingGroupId}`);
  }

  static saveConfig = (data) => {
    return axiosInstance.post("/api/games/config",data);
  }

  static getConfig = (gameId) => {
    return axiosInstance.get(`/api/games/config/${gameId}`);
  }
  
  static getSlotMonitor = () =>{
    return axiosInstance.get("/api/games/monitor");
  }

  static getInterestedEmployees = (gameId) => {
    return axiosInstance.get(`/api/games/${gameId}/interested-employees`);
  };

  static getUpcomingSlotsBySlotId = (slotId) => {
    return axiosInstance.get(`/api/games/slot/${slotId}`);
  };
}

export default GameService;