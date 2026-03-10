import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../../services/expense/expenseService";
import { showWarningToast } from "../../../utils/toastUtils";
import Select from "react-select";

const AddExpense = () => {

  const [assignedTravels, setAssignedTravels] = useState([]);
  const [travelId, setTravelId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ExpenseService.getAssignedTravels()
      .then(res => setAssignedTravels(res.data))
      .catch(err => console.error('Error fetching travels:', err));
  }, []);

  const handleSubmit = async () => {

    if (!travelId) {
      showWarningToast("Please select a travel");
      return;
    }

    if (!amount) {
      showWarningToast("Amount required");
      return;
    }

    if (!expenseDate) {
      showWarningToast("Expense date required");
      return;
    }

    if (!category) {
      showWarningToast("Category required");
      return;
    }

    if (proofs.length === 0) {
      showWarningToast("At least one proof is required");
      return;
    }

    const formData = new FormData();
    formData.append("travelId", travelId.value);
    formData.append("category", category);
    formData.append("amount", amount.toString());
    formData.append("expenseDate", expenseDate);

    proofs.forEach(file => {
      formData.append("proofs", file);
    });

    setLoading(true);
    try {
      await ExpenseService.createDraft(formData);
      navigate("/expenses");
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">Add Expense</h2>
        <div className="text-white font-medium bg-blue-600 rounded border w-35 py-2 px-1 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/expenses")}>Back to Expenses</div>
      </div>

      <Select
        options={assignedTravels.map(travel => ({
          value: travel.travelId,
          label: travel.title
        }))}
        value={travelId}
        onChange={setTravelId}
        className="border rounded w-full mb-2"
        placeholder="Select Travel"
      />

      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Category"
        onChange={e => setCategory(e.target.value)}
      />

      <input
        type="number"
        className="border rounded p-2 w-full mb-2"
        placeholder="Amount"
        onChange={e => setAmount(parseFloat(e.target.value))}
      />

      <input
        type="date"
        className="border rounded p-2 w-full mb-2"
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
        className=" cursor-pointer bg-green-600 font-medium text-white p-2 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
      >
        Save as Draft
      </button>
    </div>
  );
};

export default AddExpense;