import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../services/expense/expenseService";

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Expenses</h2>

      <button
        onClick={() => navigate("/expenses/new")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Expense
      </button>

      {travelGroups.map(travel => (
        <div key={travel.travelId} className="bg-white p-4 rounded shadow mb-6">

          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">{travel.travelTitle}</h3>
            <span className="font-bold">
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
                <span>{exp.category}</span>
                <span>₹{exp.amount}</span>
                <span>{exp.status}</span>
              </div>
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};

export default MyExpenses;