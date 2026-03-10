import { useEffect, useState } from "react";
import GameService from "../../../services/games/gameService";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await GameService.getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    try {
      await GameService.cancelBooking(id);
      load();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-slate-700 font-bold mb-3">
        My Bookings
      </h2>

      {bookings.map(b => (
        <div key={b.bookingGroupId}
             className=" p-4 mb-3 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

          <span className="text-lg font-semibold mr-2">Game:</span>
          <span className="font-medium text-gray-600">{b.gameName}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Date and Time:</span>
          <span className=" text-gray-600 font-medium">{b.date} | {b.startTime} - {b.endTime}</span>
          <br />
          <span className="text-lg font-semibold mr-2">Slot Status: </span>
          <span className="font-medium text-gray-600">{b.slotStatus}</span>
          <br />          
          <span className="text-lg font-semibold mr-2">Booking Status: </span>
          <span className="font-medium text-gray-600">{b.status}</span>
          <br />

          <span className="text-lg font-semibold">Participants:</span>
          <br />
          {b.participants.map((p,i) =>
            <div key={i} className="text-gray-600 font-medium">{p}</div>
          )}

          <button
            onClick={() => cancel(b.bookingGroupId)}
            className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer mt-2 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;