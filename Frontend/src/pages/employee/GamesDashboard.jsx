import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameService from "../../services/games/gameService";
import MyBookings from "./MyBookings";

const GameDashboard = () => {

  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadGames = async () => {
    try {
      const res = await GameService.getGames();
      setGames(res.data);
    } catch (error) {
      console.error("Error loading games", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);


  const toggleInterest = async (gameId) => {
    try {
      await GameService.toggleInterest(gameId);
      loadGames(); 
    } catch (error) {
      console.log(error.response?.data?.message);
      console.error("Error toggling interest", error);
    }
  };

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Game Dashboard
      </h2>

      
      <div className="grid grid-cols-3 gap-6">
        {games.map(game => (
          <div
            key={game.gameId}
            className="border p-5 rounded shadow bg-white"
          >
            <h3 className="text-lg font-semibold mb-2">
              {game.gameName}
            </h3>

            <p className="mb-1">
              <strong>Interested:</strong>{" "}
              {game.interested ? "Yes" : "No"}
            </p>

            <p className="mb-3">
              <strong>Played Today:</strong>{" "}
              {game.playedCount}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => toggleInterest(game.gameId)}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Change Interest
              </button>

              <button
                disabled={!game.interested}
                onClick={() =>
                  navigate(`/games/${game.gameId}/slots`)
                }
                className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                Book Slot
              </button>
            </div>
          </div>
        ))}
      </div>

      
      <div className="mt-10">
        <MyBookings />
      </div>
    </div>
  );
};

export default GameDashboard;




