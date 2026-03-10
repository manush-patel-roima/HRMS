import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseService from "../../../services/expense/expenseService";

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

  const statusClasses = {
    DRAFT: 'bg-gray-200 text-gray-800 shadow',
    SUBMITTED: 'bg-yellow-100 text-yellow-800 shadow',
    APPROVED: 'bg-green-100 text-green-800 shadow',
    REJECTED: 'bg-red-100 text-red-800 shadow'
  };

  return (
    <div>
      <h2 className="text-2xl text-slate-700 font-bold mb-4">Expense Approvals</h2>

      
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-4 gap-2">

        <input
          placeholder="Employee Name"
          className="border rounded p-2"
          onChange={e => setFilters({ ...filters, employeeName: e.target.value || null})}
        />

        <input
          placeholder="Status"
          className="border rounded p-2"
          onChange={e => setFilters({ ...filters, status: e.target.value || null })}
        />

        <input
          type="date"
          className="border rounded p-2"
          onChange={e => setFilters({ ...filters, from: e.target.value || null })}
        />

        <input
          type="date"
          className="border rounded p-2"
          onChange={e => setFilters({ ...filters, to: e.target.value || null })}
        />

        <button
          onClick={fetchExpenses}
          className="cursor-pointer bg-blue-600 text-white font-medium px-4 py-2 rounded col-span-4"
        >
          Apply Filters
        </button>

      </div>

      
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between text-xl font-semibold mb-4">
          <span>Travel</span>
          <span>Employee</span>
          <span>Category</span>
          <span>Amount</span>
          <span>Expense Date</span>
          <span>Status</span>
        </div>
        {expenses.map(e => (
          <div key={e.expenseId} 
               className="border-b py-2 cursor-pointer" 
               onClick={() => navigate(`/hr/expenses/${e.expenseId}`)}
          >
            <div className="flex justify-between text-lg font-normal ">
              <span>{e.travelName}</span>
              <span>{e.employeeName}</span>
              <span>{e.category}</span>
              <span>₹{e.amount}</span>
              <span>{e.expenseDate}</span>
              <span className={`p-1 rounded ${statusClasses[e.status]}`}>{e.status}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExpenseApprovals;