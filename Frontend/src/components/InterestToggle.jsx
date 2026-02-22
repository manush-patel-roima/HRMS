import { useState } from "react";
import GameService from "../services/games/gameService";

const InterestToggle = ({ gameId }) => {

  const [interested, setInterested] = useState(false);

  const toggle = async () => {
    await GameService.toggleInterest(gameId);
    setInterested(!interested);
  };

  return (
    <button
      onClick={toggle}
      className={`mb-4 px-3 py-1 rounded ${
        interested ? "bg-green-600 text-white" : "bg-gray-300"
      }`}
    >
      {interested ? "Interested ✓" : "Mark Interest"}
    </button>
  );
};

export default InterestToggle;