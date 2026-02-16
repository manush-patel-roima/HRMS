import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpenseService from "../../services/expense/expenseService";

const ExpenseDetails = () => {

  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    ExpenseService.getExpenseDetail(id)
      .then(res => setExpense(res.data));
  }, [id]);

  if (!expense) return <div>Loading...</div>;

  const handleSubmit = async () => {
    await ExpenseService.submitExpense(id);
    alert("Expense submitted successfully");
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">

      <a href="/expenses" className="text-blue-600 underline mb-6 ">Back to Expenses</a>

      <h2 className="text-xl font-bold mb-4">Expense Details</h2>

      <p><b>Travel:</b> {expense.travelTitle}</p>
      <p><b>Category:</b> {expense.category}</p>
      <p><b>Amount:</b> ₹{expense.amount}</p>
      <p><b>Date:</b> {expense.expenseDate}</p>
      <p><b>Status:</b> {expense.status}</p>

      
      <div className="mt-4">
        <h3 className="font-semibold">Proofs</h3>
        {expense.proofs.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer"
             className="block text-blue-600 underline">
            View Proof {i + 1}
          </a>
        ))}
      </div>

      
      {expense.status === "DRAFT" && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
        >
          Submit Expense
        </button>
      )}

      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Status Timeline</h3>
        <ul className="text-sm">
          {expense.timeline.map((t, i) => (
            <li key={i}>
              {t.status} by {t.changedBy} at {t.changedAt}
              {t.remark && ` — ${t.remark}`}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ExpenseDetails;