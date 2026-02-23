import { useEffect, useState } from "react";
import GameService from "../../services/games/gameService";
import { useNavigate, useParams } from "react-router-dom";

const UpcomingSlots = () => {

  const { gameId } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [gameId]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await GameService.getUpcomingSlots(gameId);
      setSlots(res.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/games")}>Back to Games Dashboard </div>

      <h2 className="text-xl font-bold mb-4">
        Upcoming Slots
      </h2>

      {slots.map(slot => (
        <div key={slot.slotId}
             className="border p-4 mb-3 rounded shadow">

          <h3>{slot.gameName}</h3>
          <p>Date: {slot.date}</p>
          <p>Time: {slot.startTime} - {slot.endTime}</p>
          <p>Status: {slot.slotStatus}</p>

          <button
            disabled={slot.slotStatus === "CLOSED"}
            onClick={() =>
              navigate(`/booking/${slot.slotId}`)
            }
            className="bg-green-600 text-white px-3 py-1 rounded mt-2 disabled:bg-gray-400"
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingSlots;