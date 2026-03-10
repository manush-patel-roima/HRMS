import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TravelService from "../../services/travel/travelService";
import DocumentTable from "../../components/DocumentTable";

const TeamTravelDetails = () => {

  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    TravelService.getTravels().then(res => {
      const found = res.data.find(t => t.travelId === Number(id));
      setTravel(found);
    })
  } , [id]);

  if (!travel) return <p>Loading...</p>;

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl text-slate-700 font-bold">Team Travels</h2>
        <button
          onClick={() => navigate("/team-travels")}
          className="cursor-pointer bg-blue-600 text-white text-md font-medium px-4 py-2 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          Back To Travels
        </button>
      </div> 

      <h2 className="text-xl font-semibold mb-4">{travel.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">
        <div className="inline text-lg font-medium mr-2">Start: </div>
        <p className="text-gray-600 text-lg inline font-medium"> {travel.startDate}</p>
        <br />
        <div className="inline text-lg font-medium mr-2">End: </div>
        <p className="text-gray-600 text-lg inline font-medium"> {travel.endDate}</p>
      </div>

      <DocumentTable travelId={id} readOnly />

    </div>
  );
};

export default TeamTravelDetails;