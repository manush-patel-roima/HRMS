import { useEffect, useState } from "react";
import TravelService from "../../services/travel/travelService";
import { useNavigate } from "react-router-dom";

const TeamTravels = () => {
  const [travels, setTravels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    TravelService.getTravels().then(res => setTravels(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Team Travels</h2>
      <div className="grid grid-cols-3 gap-4">
        {travels.map(t => (
          <div key={t.travelId} className="bg-white p-4 rounded shadow cursor-pointer" onClick={()=>navigate(`/team-travels/${t.travelId}`)}>
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-gray-500">
              {t.startDate} → {t.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTravels;