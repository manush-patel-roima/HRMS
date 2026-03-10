import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import TravelService from "../../../services/travel/travelService";

const EditTravel = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {

    TravelService.travelDetails(id)
      .then(res => {

        setTitle(res.data.title);
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);

        const assigned = res.data.assignedEmployees.map(emp => ({
          value: emp.employeeId,
          label: emp.fullName
        }));

        setSelectedEmployees(assigned);
      });

    TravelService.getAllEmployeesExceptManagerAndHr()
      .then(res => {

        const options = res.data.map(emp => ({
          value: emp.employeeId,
          label: emp.employeeName
        }));

        setEmployeeOptions(options);
      });

  }, [id]);

  const handleSubmit = async () => {

    try {
      await TravelService.updateTravel(id, {
        title,
        startDate,
        endDate,
        employeeIds: selectedEmployees.map(e => e.value)
      });

      alert("Travel updated successfully");
      navigate("/hr/travels");      
    } catch (error) {
      console.log(error.response?.data?.message);
    }

  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg ">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Edit Travel</h2>
        <button className="text-white font-medium bg-blue-600 rounded border w-30 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/hr/travels")}>Back to Travels</button>
      </div>

      <input
        className="border p-2 w-full mb-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />

      <Select
        isMulti
        options={employeeOptions}
        value={selectedEmployees}
        onChange={setSelectedEmployees}  
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Update
      </button>

    </div>
  );
};

export default EditTravel;