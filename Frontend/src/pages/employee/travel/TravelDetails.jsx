import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import TravelService from "../../../services/travel/travelService";
import DocumentTable from "../../../components/DocumentTable";

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

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-bold mb-4 text-slate-700">Travel Details</h1>

        <div className="text-white font-medium bg-blue-600 rounded border w-30 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/travels")}>Back to Travels</div>

      </div>
      
      <h2 className="text-xl font-semibold mb-4">{travel.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">
        <div className="inline text-lg font-medium mr-2">Start: </div>
        <p className="text-gray-600 text-lg inline font-medium"> {travel.startDate}</p>
        <br />
        <div className="inline text-lg font-medium mr-2">End: </div>
        <p className="text-gray-600 text-lg inline font-medium"> {travel.endDate}</p>
      </div>

      <DocumentTable travelId={id} />

      <div className="mt-6 bg-white p-4 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">
        <h3 className="text-lg font-medium mb-2">Upload Your Document</h3>
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
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default TravelDetails;