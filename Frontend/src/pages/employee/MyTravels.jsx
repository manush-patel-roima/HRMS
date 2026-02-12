import { useEffect, useState } from "react";
import TravelService from "../../services/travel/travelService";
import TravelCard from "../../components/TravelCard";

const MyTravels = () => {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    TravelService.getTravels().then(res => setTravels(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Travels</h2>
      <div className="grid grid-cols-3 gap-4">
        {travels.map(t => (
          <TravelCard key={t.travelId} travel={t} />
        ))}
      </div>
    </div>
  );
};

export default MyTravels;