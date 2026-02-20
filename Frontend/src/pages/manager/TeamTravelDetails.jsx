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

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/team-travels")}>Back to Team Travels</div>

      <h1 className="text-3xl font-bold mb-4"> Team Travel Details</h1>  

      <h2 className="text-xl font-bold mb-4">{travel.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><b>Start:</b> {travel.startDate}</p>
        <p><b>End:</b> {travel.endDate}</p>
      </div>

      <DocumentTable travelId={id} readOnly />

    </div>
  );
};

export default TeamTravelDetails;