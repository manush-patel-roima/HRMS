import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../../services/expense/expenseService";

const MyExpenses = () => {

  const [travelGroups, setTravelGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await ExpenseService.getMyExpenses();
      setTravelGroups(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusClasses = {
    DRAFT: 'bg-gray-200 text-gray-800 shadow',
    SUBMITTED: 'bg-yellow-100 text-yellow-800 shadow',
    APPROVED: 'bg-green-100 text-green-800 shadow',
    REJECTED: 'bg-red-100 text-red-800 shadow'
  };

  return (
    <div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">My Expenses</h2>

        <button
          onClick={() => navigate("/expenses/new")}
          className="cursor-pointer bg-blue-600 font-medium text-white p-2 rounded mb-4 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          + Add Expense
        </button>

      </div>

      {travelGroups.map(travel => (
        <div key={travel.travelId} className="bg-white p-4 rounded shadow mb-6 animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold">{travel.travelTitle}</h3>
            <span className="text-xl font-semibold">
              Total: ₹{travel.totalAmount}
            </span>
          </div>

          {travel.expenses.map(exp => (
            <div
              key={exp.expenseId}
              className="border-b py-2 cursor-pointer"
              onClick={() => navigate(`/expenses/${exp.expenseId}`)}
            >
              <div className="flex justify-between">
                <span className="text-lg font-normal">{exp.category}</span>
                <span className="text-lg font-normal">₹{exp.amount}</span>
                <span className={`inline p-1 rounded ${statusClasses[exp.status]}`}>{exp.status}</span>
              </div>
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};

export default MyExpenses;