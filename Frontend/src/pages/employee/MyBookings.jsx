import { useEffect, useState } from "react";
import GameService from "../../services/games/gameService";

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
      <h2 className="text-lg font-bold mb-3">
        My Bookings
      </h2>

      {bookings.map(b => (
        <div key={b.bookingGroupId}
             className="border p-4 mb-3 rounded shadow">

          <h3>{b.gameName}</h3>
          <p>{b.date} | {b.startTime} - {b.endTime}</p>
          <p>Status: {b.status}</p>

          <p>Participants:</p>
          {b.participants.map((p,i) =>
            <div key={i}>{p}</div>
          )}

          <button
            onClick={() => cancel(b.bookingGroupId)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;