import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import TravelService from "../../services/travel/travelService";
import DocumentTable from "../../components/DocumentTable";

const TravelDetails = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    TravelService.getTravels().then(res => {
      const found = res.data.find(t => t.travelId === Number(id));
      setTravel(found);
    });
  }, [id]);

  const handleUpload = async () => {
    const employeeId = localStorage.getItem("employeeId");

    if(!employeeId){
      alert("Invalid user session");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("travelId", id);
    formData.append("documentType", documentType);
    formData.append("employeeId", employeeId);

    await TravelService.uploadDocument(formData);
    alert("Document uploaded successfully");
  };

  if (!travel) return <p>Loading...</p>;

  return (
    <div>

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/travels")}>Back to Travels</div>

      <h1 className="text-3xl font-bold mb-4">Travel Details</h1>
      
      <h2 className="text-xl font-bold mb-4">{travel.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><b>Start:</b> {travel.startDate}</p>
        <p><b>End:</b> {travel.endDate}</p>
      </div>

      <DocumentTable travelId={id} />

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Upload Your Document</h3>
        <input
          type="text"
          placeholder="Document Type"
          className="border p-2 w-full mb-2"
          onChange={e => setDocumentType(e.target.value)}
        />
        <input
          type="file"
          className="mb-2"
          onChange={e => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default TravelDetails;