import { useEffect, useState } from "react";
import GameService from "../../services/games/gameService";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);

  const load = () => {
    GameService.getMyBookings()
      .then(res => setBookings(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    await GameService.cancelBooking(id);
    load();
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