import { useEffect, useState } from "react";
import GameService from "../../services/games/gameService";
import CalendarView from "./CalendarView";

const AvailableSlots = ({ gameId }) => {

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate, gameId]);

  const loadSlots = () => {
    GameService.getSlots(gameId, selectedDate)
      .then(res => setSlots(res.data));
  };

  const book = async (slotId) => {
    try {
      await GameService.bookSlot(slotId);
      loadSlots();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Available Slots</h3>

      <CalendarView onDateSelect={setSelectedDate} />

      {slots.map(slot => (
        <div key={slot.slotId}
             className="flex justify-between border-b py-2">
          <span>{slot.startTime} - {slot.endTime}</span>
          <span>{slot.bookedCount}/{slot.maxPlayers}</span>
          <button
            disabled={slot.fullyBooked}
            onClick={() => book(slot.slotId)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400"
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableSlots;