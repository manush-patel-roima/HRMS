import { useEffect, useState } from "react";
import GameService from "../../../services/games/gameService";
import { useNavigate } from "react-router-dom";

const SlotMonitor = () => {

  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GameService.getSlotMonitor()
      .then(res => setSlots(res.data));
  }, []);

  return (
    <div>

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-bold mb-4 text-slate-700">Slot Monitor</h1>

        <div className="text-white font-medium bg-blue-600 rounded border w-30 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/hr/games-config")}>Back to Travels</div>

      </div>

      {slots.map(slot => (
        <div key={slot.slotId}
             className="border p-4 mb-3 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

          <span className="text-lg font-semibold mr-2">Game:</span>
          <span className="font-medium text-gray-600">{slot.gameName}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Date and Time:</span>
          <span className=" text-gray-600 font-medium">{slot.date} | {slot.startTime} - {slot.endTime}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Slot Status: </span>
          <span className="font-medium text-gray-600">{slot.slotStatus}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Booking Status: </span>
          <span className="font-medium text-gray-600">{slot.status}</span>
          <br />

          <span className="text-lg font-semibold">Participants:</span>
          <br />
          {slot.participants.map((p,i) =>
            <div key={i} className="text-gray-600 font-medium">{p}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlotMonitor;