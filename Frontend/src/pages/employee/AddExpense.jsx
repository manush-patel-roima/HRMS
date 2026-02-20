import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../services/expense/expenseService";

const AddExpense = () => {

  const [assignedTravels,setAssignedTravels] = useState([]);
  const [travelId, setTravelId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [proofs, setProofs] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    ExpenseService.getAssignedTravels()
      .then(res=>setAssignedTravels(res.data));
  },[]);

  const handleSubmit = async () => {

    if(!travelId){
      alert("Please select a travel");
      return;
    }

    if(!amount){
      alert("Amount required");
      return;
    }

    if(!expenseDate){
      alert("Expense date required");
      return;
    }

    if(!category){
      alert("Category required");
      return;
    }

    if (proofs.length === 0) {
      alert("At least one proof is required");
      return;
    }

    const formData = new FormData();
    formData.append("travelId", travelId);
    formData.append("category", category);
    formData.append("amount", amount.toString());
    formData.append("expenseDate", expenseDate);

    proofs.forEach(file => {
      formData.append("proofs", file);
    });

    try{
        await ExpenseService.createDraft(formData);
        alert("Draft created successfully");
        navigate("/expenses");
    } catch(error){
        console.log(error.response.data || error.response.data.message || error.message);
        alert("Failed to save draft");
    }
    
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/expenses")}>Back to Expenses</div>

      <h2 className="text-xl font-bold mb-4">Add Expense</h2>
      
      <select
        value={travelId}
        className="border p-2 w-full mb-2"
        onChange={e => setTravelId(e.target.value)}
      >
        <option value="">Select Travel</option>
        {assignedTravels.map(travel => (
          <option key={travel.travelId} value={travel.travelId}>
            {travel.title}
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Category"
        onChange={e => setCategory(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Amount"
        onChange={e => setAmount(parseFloat(e.target.value))}
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        onChange={e => setExpenseDate(e.target.value)}
      />

      <input
        type="file"
        multiple
        className="mb-4"
        onChange={e => setProofs(Array.from(e.target.files))}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save as Draft
      </button>
    </div>
  );
};

export default AddExpense;