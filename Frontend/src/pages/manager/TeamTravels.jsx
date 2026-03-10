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
      <h2 className="text-2xl text-slate-700 font-bold mb-4">Team Travels</h2>
      <div className="grid grid-cols-3 gap-4">
        {travels.map(t => (
          <div key={t.travelId} className="bg-white p-4 rounded shadow cursor-pointer rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate(`/team-travels/${t.travelId}`)}>
            <h3 className="text-lg font-semibold mb-1">{t.title}</h3>
            <div className="border-2 border-sky-700"></div>
            <p className="text-lg text-gray-600 mt-1">
              {t.startDate} → {t.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTravels;