import { useEffect, useState } from "react";
import GameService from "../../../services/games/gameService";
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
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">
          Upcoming Slots
        </h2>
        <div className="text-white font-medium bg-blue-600 rounded border w-50 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/games")}>Back to Games Dashboard </div>
      </div>


      {slots.map(slot => (
        <div key={slot.slotId}
             className=" p-4 mb-3 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

          <span className="text-lg font-semibold mr-2">Game:</span>
          <span className="text-gray-600 font-medium">{slot.gameName}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Date: </span>
          <span className="text-gray-600 font-medium">{slot.date}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Time: </span>
          <span className="text-gray-600 font-medium">{slot.startTime} - {slot.endTime}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Status: </span>
          <span className="text-gray-600 font-medium">{slot.slotStatus}</span>
          <br />

          <button
            disabled={slot.slotStatus === "CLOSED"}
            onClick={() =>
              navigate(`/booking/${slot.slotId}`)
            }
            className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer mt-2 disabled:bg-gray-400 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingSlots;