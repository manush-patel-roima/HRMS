import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import TravelService from "../../services/travel/travelService";

const CreateTravel = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees,setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    TravelService.getAllEmployeesExceptManagerAndHr()
     .then(res=>{
       
      const options = res.data.map(emp=>({
        value: emp.employeeId,
        label: emp.employeeName
      }));

      setEmployees(options);
     });
  },[]);

  const handleSubmit = async () => {
    try {
      if (selectedIds.length === 0) {
        alert("Please select at least one employee");
        return;
      }

      await TravelService.createTravel({
        title,
        startDate,
        endDate,
        employeeIds: selectedIds.map(emp=>emp.value)
      });

      alert("Travel created");
      navigate("/hr/travels");     
    } catch (error) {
      console.log(error.response?.data?.message)
    }
    
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg ">

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/hr/travels")}>Back to Travels</div>
      
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

      <label className="block mb-2 font-semibold">
        Select Employees
      </label>

      <Select
        isMulti
        options={employees}
        value={selectedIds}
        onChange={setSelectedIds}
        className="mb-4"     
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