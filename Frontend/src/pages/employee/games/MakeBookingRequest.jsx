import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameService from "../../../services/games/gameService";
import { showWarningToast } from "../../../utils/toastUtils";
import Select from "react-select";

const MakeBookingRequest = () => {

  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


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


  const handleSelectChange = (selectedOptions) => {

    if (!slot) return;

    const maxSelectable = slot.maxPlayers - 1; 

    if(selectedOptions.length > maxSelectable ) return;

    setSelected(selectedOptions);
  };

  const totalSelected = selected.length + 1; 

  const isMinSatisfied =
    slot ? totalSelected >= slot.minPlayers : false;


  const submit = async () => {

    if (!isMinSatisfied) {
      showWarningToast(`Minimum ${slot.minPlayers} players required.`);
      return;
    }

    setSubmitting(true);
    try {
      const participantIds = selected.map(option => option.value);
      await GameService.bookSlot({
        slotId,
        participantIds
      });

      navigate("/games");

    } catch (err) {
      console.error("Booking error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">
          Make Booking Request
        </h2>
        <div className="text-white font-medium bg-blue-600 rounded border w-50 pl-3 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate(`/games/${gameId}/slots`)}>Back to Upcoming Slots </div>
      </div>

      
      {slot && (
        <div className="border p-4 mb-4 rounded shadow max-w-2xl">

          <span className="text-lg font-semibold mr-2">Game:</span>
          <span className="text-gray-600 font-medium">{slot.gameName}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Date:</span> 
          <span className="text-gray-600 font-medium">{slot.date}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Time: </span>
          <span className="text-gray-600 font-medium">{slot.startTime} - {slot.endTime}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Minimum Players:</span>
          <span className="text-gray-600 font-medium">{slot.minPlayers}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Maximum Players:</span>
          <span className="text-gray-600 font-medium"> {slot.maxPlayers}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Selected Players: </span>
          <span className="text-gray-600 font-medium">{totalSelected}</span>
        </div>
      )}

      
      <div className="border p-4 rounded shadow max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">
          Select Other Participants
        </h3>
        
        <Select
          isMulti
          options={employees.map(emp => ({
            value: emp.employeeId,
            label: emp.fullName
          }))}
          value={selected}
          onChange={handleSelectChange}
          className="mb-4"
          placeholder="Select Other Participants"     
        />              

        <button
          onClick={submit}
          disabled={!isMinSatisfied}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3 disabled:bg-gray-400 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default MakeBookingRequest;