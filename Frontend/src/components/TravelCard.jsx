import { useNavigate } from "react-router-dom";

const TravelCard = ({ travel }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/travels/${travel.travelId}`)}
      className="bg-white p-4 rounded-md shadow cursor-pointer animation duration-500 easy-in-out transform hover:shadow-lg hover:scale-100 hover:-translate-y-0.5 hover:translate-x-0.5"
    >
      <h3 className="text-xl font-semibold mb-1 ">{travel.title}</h3>
      <div className="border-2 border-sky-700"></div>
      <p className="text-lg text-gray-600 mt-1">
        {travel.startDate} → {travel.endDate}
      </p>
    </div>
  );
};

export default TravelCard;