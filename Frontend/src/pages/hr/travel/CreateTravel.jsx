import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import TravelService from "../../../services/travel/travelService";

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

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-bold mb-4 text-slate-700">Create Travel</h1>

        <div className="text-white font-medium bg-blue-600 rounded border w-30 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/hr/travels")}>Back to Travels</div>

      </div>

      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="border rounded p-2 w-full mb-2"
        onChange={e => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="border rounded p-2 w-full mb-2"
        onChange={e => setEndDate(e.target.value)}
      />

      <Select
        isMulti
        options={employees}
        value={selectedIds}
        onChange={setSelectedIds}
        className="mb-4 border rounded w-full"  
        placeholder="Select Employees"   
      />


      <button
        onClick={handleSubmit}
        className=" cursor-pointer bg-blue-600 text-white px-4 py-2 font-medium rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5"
      >
        Save
      </button>
    </div>
  );
};

export default CreateTravel;