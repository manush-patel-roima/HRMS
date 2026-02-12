import { useNavigate } from "react-router-dom";

const TravelCard = ({ travel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/travels/${travel.travelId}`)}
      className="bg-white p-4 rounded shadow cursor-pointer"
    >
      <h3 className="font-semibold">{travel.title}</h3>
      <p className="text-sm text-gray-500">
        {travel.startDate} → {travel.endDate}
      </p>
    </div>
  );
};

export default TravelCard;