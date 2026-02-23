import axiosInstance from "../../api/axiosInstance";
import { showSuccessToast } from "../../utils/toastUtils";

class GameService {

  static getGames = () => {
    return axiosInstance.get("/api/games/games");
  }

  static toggleInterest = (gameId) => {
    return axiosInstance.post(`/api/games/interest/${gameId}`).then(res => {
      showSuccessToast('Interest updated successfully!');
      return res;
    });
  }

  static getUpcomingSlots = (gameId) => {
    return axiosInstance.get(`/api/games/upcoming-slots/${gameId}`);
  }

  static bookSlot = (data) => {
    return axiosInstance.post("/api/games/book", data).then(res => {
      showSuccessToast('Booking request submitted successfully!');
      return res;
    });
  }

  static getMyBookings = () => {
    return axiosInstance.get("/api/games/my-bookings");
  }

  static cancelBooking = (bookingGroupId) => {
    return axiosInstance.post(`/api/games/cancel/${bookingGroupId}`).then(res => {
      showSuccessToast('Booking cancelled successfully!');
      return res;
    });
  }

  static saveConfig = (data) => {
    return axiosInstance.post("/api/games/config", data).then(res => {
      showSuccessToast('Game configuration saved successfully!');
      return res;
    });
  }

  static getConfig = (gameId) => {
    return axiosInstance.get(`/api/games/config/${gameId}`);
  }

  static getSlotMonitor = () => {
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