import { useEffect, useState } from "react";
import TravelService from "../../services/travel/travelService";
import TravelCard from "../../components/TravelCard";

const MyTravels = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    setLoading(true);
    try {
      const res = await TravelService.getTravels();
      setTravels(res.data);
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }
  };

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