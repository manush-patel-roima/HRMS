import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../services/expense/expenseService";

const ExpenseApprovals = () => {

  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const fetchExpenses = () => {
    ExpenseService.filterExpenses(filters)
      .then(res => setExpenses(res.data));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expense Approvals</h2>

      
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-4 gap-2">

        <input
          placeholder="Employee ID"
          className="border p-2"
          onChange={e => setFilters({ ...filters, employeeId: e.target.value })}
        />

        <input
          placeholder="Status"
          className="border p-2"
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        />

        <input
          type="date"
          className="border p-2"
          onChange={e => setFilters({ ...filters, from: e.target.value })}
        />

        <input
          type="date"
          className="border p-2"
          onChange={e => setFilters({ ...filters, to: e.target.value })}
        />

        <button
          onClick={fetchExpenses}
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-4"
        >
          Apply Filters
        </button>

      </div>

      
      <div className="bg-white p-4 rounded shadow">
        {expenses.map(e => (
          <div
            key={e.expenseId}
            className="border-b py-2 cursor-pointer"
            onClick={() => navigate(`/hr/expenses/${e.expenseId}`)}
          >
            <div className="flex justify-between">
              <span>{e.category}</span>
              <span>₹{e.amount}</span>
              <span>{e.status}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExpenseApprovals;