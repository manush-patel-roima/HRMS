import { useEffect, useState } from "react";
import GameService from "../../services/games/gameService";

const SlotMonitor = () => {

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    GameService.getSlotMonitor()
      .then(res => setSlots(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Slot Monitor
      </h2>

      {slots.map(slot => (
        <div key={slot.slotId}
             className="border p-4 mb-3 rounded shadow">

          <h3>{slot.gameName}</h3>
          <p>{slot.date}</p>
          <p>{slot.startTime} - {slot.endTime}</p>
          <p>Status: {slot.status}</p>

          <h4>Participants:</h4>
          {slot.participants.map((p,i) =>
            <div key={i}>{p}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlotMonitor;