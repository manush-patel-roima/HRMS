import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseService from "../../services/expense/expenseService";

const ExpenseDetail = () => {

  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    ExpenseService.getHRExpenseDetail(id)
      .then(res => setExpense(res.data));
  }, [id]);

  if (!expense) return <div>Loading...</div>;

  const approve = async () => {
    await ExpenseService.approveExpense(id);
    alert("Approved successfully");
    window.location.reload();
  };

  const reject = async () => {
    if (!remark) {
      alert("Remark is mandatory");
      return;
    }

    await ExpenseService.rejectExpense(id, remark);
    alert("Rejected successfully");
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/hr/expenses")}>Back to Expenses</div>

      <h2 className="text-xl font-bold mb-4">Expense Detail</h2>
      

      <p><b>Employee:</b> {expense.employeeName}</p>
      <p><b>Travel:</b> {expense.travelTitle}</p>
      <p><b>Category:</b> {expense.category}</p>
      <p><b>Amount:</b> ₹{expense.amount}</p>
      <p><b>Status:</b> {expense.status}</p>

      
      <div className="mt-4">
        <h3 className="font-semibold">Proofs</h3>
        {expense.proofs.map((url, i) => (
          <a key={i}
             href={url}
             target="_blank"
             rel="noreferrer"
             className="block text-blue-600 underline">
            View Proof {i + 1}
          </a>
        ))}
      </div>

      
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Status Timeline</h3>
        {expense.timeline.map((t, i) => (
          <div key={i} className="text-sm">
            {t.status} by {t.changedBy} at {t.changedAt}
            {t.remark && ` — ${t.remark}`}
          </div>
        ))}
      </div>

      
      {expense.status === "SUBMITTED" && (
        <>
          <textarea
            className="border p-2 w-full mt-4"
            placeholder="Remark (required if rejecting)"
            onChange={e => setRemark(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={approve}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={reject}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default ExpenseDetail;