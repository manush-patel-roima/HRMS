import { useEffect, useState } from "react";
import GameService from "../../../services/games/gameService";
import { useNavigate } from "react-router-dom";
import { showWarningToast } from "../../../utils/toastUtils";

const GameConfig = () => {

  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    slotDurationMinutes: "",
    minPlayers: "",
    maxPlayers: "",
    startHour: "",
    endHour: ""
  });


  const loadGames = async () => {
    try {
      const res = await GameService.getGames();
      setGames(res.data);
    } catch (error) {
      console.error("Error loading games", error);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);


  const loadConfig = async (gameId) => {
    try {
      const res = await GameService.getConfig(gameId);
      setForm({
        slotDurationMinutes: res.data.slotDurationMinutes,
        minPlayers: res.data.minPlayers,
        maxPlayers: res.data.maxPlayers,
        startHour: res.data.startHour,
        endHour: res.data.endHour
      });
    } catch (error) {
      setForm({
        slotDurationMinutes: "",
        minPlayers: "",
        maxPlayers: "",
        startHour: "",
        endHour: ""
      });
      console.error('Error loading config:', error);
    }
  };

  const handleGameChange = (e) => {
    const gameId = e.target.value;
    setSelectedGame(gameId);
    if (gameId) loadConfig(gameId);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  const saveConfig = async () => {

    if (!selectedGame) {
      showWarningToast("Please select a game");
      return;
    }

    if (form.minPlayers > form.maxPlayers) {
      showWarningToast("Min players cannot be greater than Max players");
      return;
    }

    setLoading(true);

    try {
      await GameService.saveConfig({
        gameId: selectedGame,
        ...form
      });

    } catch (error) {
      console.error("Error saving config", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow h-screen">

      <div className="flex justify-between items-center">

        <h2 className="text-xl text-2xl text-slate-700 font-bold mb-6">
          Game Configuration
        </h2>

        <button
          onClick={() => navigate("/hr/slot-monitor")}
          className="bg-blue-600 font-medium text-white px-4 py-2 rounded mb-4 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          Slot Monitoring
        </button>
      </div>
      

     
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Select Game
        </label>

        <select
          value={selectedGame}
          onChange={handleGameChange}
          className="border p-2 w-full rounded"
        >
          <option value="">-- Select Game --</option>
          {games.map(game => (
            <option key={game.gameId} value={game.gameId}>
              {game.gameName}
            </option>
          ))}
        </select>
      </div>

      
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Slot Duration (Minutes)
        </label>

        <input
          type="number"
          name="slotDurationMinutes"
          value={form.slotDurationMinutes}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Minimum Players
        </label>

        <input
          type="number"
          name="minPlayers"
          value={form.minPlayers}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Maximum Players
        </label>

        <input
          type="number"
          name="maxPlayers"
          value={form.maxPlayers}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Start Hour
        </label>

        <input
          type="time"
          name="startHour"
          value={form.startHour}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      
      <div className="mb-6">
        <label className="block mb-1 font-medium">
          End Hour
        </label>

        <input
          type="time"
          name="endHour"
          value={form.endHour}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      
      <button
        onClick={saveConfig}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium w-full disabled:bg-gray-400 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5"
      >
        {loading ? "Saving..." : "Save Configuration"}
      </button>

      <p className="text-sm text-gray-500 mt-2">
        Note: Slots will be generated automatically every day at 10PM for the next day.
      </p>

    </div>
  );
};

export default GameConfig;