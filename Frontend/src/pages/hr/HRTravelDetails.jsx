import { useParams } from "react-router-dom";
import DocumentTable from "../../components/DocumentTable";
import { useState, useEffect } from "react";
import TravelService from "../../services/travel/travelService";
import axiosInstance from "../../api/axiosInstance";

const HRTravelDetails = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    TravelService.getTravels().then(res => {
      const found = res.data.find(t => t.travelId === Number(id));
      setTravel(found);
    });

    axiosInstance.get(`/api/travels/${id}`)
      .then(res => {
        setEmployees(res.data.assignedEmployees || []);
      });

  }, [id]);

  const handleUpload = async () => {

    if(!selectedEmployeeId){
      alert("Please select employee");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("travelId", id);
    formData.append("documentType", documentType);
    formData.append("employeeId", parseInt(selectedEmployeeId));

    await TravelService.uploadDocument(formData);
    alert("Document uploaded successfully");
  };

  if(!travel){
    return <p>Loading...</p>
  }


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Travel Details</h1>

      <h2 className="text-xl font-bold mb-4">{travel.title}</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><b>Start:</b> {travel.startDate}</p>
        <p><b>End:</b> {travel.endDate}</p>
      </div>

      <DocumentTable travelId={id} />

      <div className="mt-6 bg-white p-4 rounded shadow">

        <h3 className="font-semibold mb-2">Upload Document For Employee</h3>

        <select
          className="border p-2 w-full mb-2"
          value={selectedEmployeeId}
          onChange={e=>setSelectedEmployeeId(e.target.value)}
        > 
  
          <option value="" disabled selected>Select Employee</option>

          {employees.map(emp => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.fullName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Document Type"
          className="border p-2 w-full mb-2"
          onChange={e => setDocumentType(e.target.value)}
        />
        <input
          type="file"
          className="border rounded-sm px-4 py-2 mb-2 mr-3"
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

export default HRTravelDetails;