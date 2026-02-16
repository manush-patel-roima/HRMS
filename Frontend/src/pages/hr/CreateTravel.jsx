import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TravelService from "../../services/travel/travelService";

const CreateTravel = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeIds, setEmployeeIds] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await TravelService.createTravel({
      title,
      startDate,
      endDate,
      employeeIds: employeeIds.split(",").map(Number)
    });
    alert("Travel created");
    navigate("/hr/travels");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <h2 className="text-xl font-bold mb-4">Create Travel</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        onChange={e => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        onChange={e => setEndDate(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Employee IDs (comma-separated)"
        onChange={e => setEmployeeIds(e.target.value)} //a dropdown needs to be implemented here to select employees instead of manual input
      />


      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default CreateTravel;