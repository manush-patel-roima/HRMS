import { useEffect, useState } from "react";
import ExpenseService from "../../services/expense/expenseService";

const TeamExpenses = () => {

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    ExpenseService.getTeamExpenses()
      .then(res => setExpenses(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Team Expenses</h2>

      <div className="bg-white p-4 rounded shadow">
        {expenses.map(e => (
          <div key={e.expenseId} className="border-b py-2">
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

export default TeamExpenses;