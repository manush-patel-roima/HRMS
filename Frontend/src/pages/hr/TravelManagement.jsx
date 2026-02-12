import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TravelService from "../../services/travel/travelService";

const TravelManagement = () => {
  const [travels, setTravels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    TravelService.getTravels().then(res => setTravels(res.data));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">All Travels</h2>
        <button
          onClick={() => navigate("/hr/travels/new")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create Travel
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {travels.map(t => (
          <div
            key={t.travelId}
            className="bg-white p-4 rounded shadow cursor-pointer"
            onClick={() => navigate(`/hr/travels/${t.travelId}`)}
          >
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

export default TravelManagement;