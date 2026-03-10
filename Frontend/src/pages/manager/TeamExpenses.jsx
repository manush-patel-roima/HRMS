import { useEffect, useState } from "react";
import ExpenseService from "../../services/expense/expenseService";

const TeamExpenses = () => {

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    ExpenseService.getTeamExpenses()
      .then(res => setExpenses(res.data));
  }, []);

  const statusClasses = {
    DRAFT: 'bg-gray-200 text-gray-800 shadow',
    SUBMITTED: 'bg-yellow-100 text-yellow-800 shadow',
    APPROVED: 'bg-green-100 text-green-800 shadow',
    REJECTED: 'bg-red-100 text-red-800 shadow'
  };

  return (
    <div>
      <h2 className="text-2xl text-slate-700 font-bold mb-4">Team Expenses</h2>

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
          <div key={e.expenseId} className="border-b py-2">
            <div className="flex justify-between text-lg font-normal">
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

export default TeamExpenses;