import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameService from "../../services/games/gameService";

const MakeBookingRequest = () => {

  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadData = async () => {
      try {
        const slotRes =
          await GameService.getUpcomingSlotsBySlotId(slotId);

        setSlot(slotRes.data);
        setGameId(slotRes.data.gameId)

        const empRes =
          await GameService.getInterestedEmployees(
            slotRes.data.gameId
          );

        setEmployees(empRes.data);

      } catch (err) {
        console.error("Error loading booking page", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [slotId]);


  const toggleSelect = (id) => {

    if (!slot) return;

    const maxSelectable = slot.maxPlayers - 1; 

    if (selected.includes(id)) {
      setSelected(prev => prev.filter(x => x !== id));
    } else {
      if (selected.length >= maxSelectable) return;
      setSelected(prev => [...prev, id]);
    }
  };

  const totalSelected = selected.length + 1; 

  const isMinSatisfied =
    slot ? totalSelected >= slot.minPlayers : false;


  const submit = async () => {

    if (!isMinSatisfied) {
      alert(`Minimum ${slot.minPlayers} players required.`);
      return;
    }

    try {
      await GameService.bookSlot({
        slotId,
        participantIds: selected
      });

      alert("Booking request submitted");
      navigate("/games");

    } catch (err) {
      console.error("Booking error", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate(`/games/${gameId}/slots`)}>Back to Upcoming Slots</div>

      <h2 className="text-xl font-bold mb-4">
        Make Booking Request
      </h2>

      
      {slot && (
        <div className="border p-4 mb-4 rounded shadow">
          <p><strong>Game:</strong> {slot.gameName}</p>
          <p><strong>Date:</strong> {slot.date}</p>
          <p><strong>Time:</strong> {slot.startTime} - {slot.endTime}</p>
          <p><strong>Minimum Players:</strong> {slot.minPlayers}</p>
          <p><strong>Maximum Players:</strong> {slot.maxPlayers}</p>
          <p><strong>Selected Players:</strong> {totalSelected}</p>
        </div>
      )}

      
      <div className="border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">
          Select Other Participants
        </h3>

        {employees.map(emp => {

          const maxSelectable = slot.maxPlayers - 1;

          const disableCheckbox =
            !selected.includes(emp.employeeId) &&
            selected.length >= maxSelectable;

          return (
            <div key={emp.employeeId}>
              <input
                type="checkbox"
                disabled={disableCheckbox}
                checked={selected.includes(emp.employeeId)}
                onChange={() => toggleSelect(emp.employeeId)}
              />
              {emp.fullName}
            </div>
          );
        })}

        <button
          onClick={submit}
          disabled={!isMinSatisfied}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3 disabled:bg-gray-400"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default MakeBookingRequest;