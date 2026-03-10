import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseService from "../../../services/expense/expenseService";

const ExpenseDetails = () => {

  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const navigate = useNavigate();

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

  const statusClasses = {
    DRAFT: 'bg-gray-200 text-gray-800 shadow',
    SUBMITTED: 'bg-yellow-100 text-yellow-800 shadow',
    APPROVED: 'bg-green-100 text-green-800 shadow',
    REJECTED: 'bg-red-100 text-red-800 shadow'
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">Expense Details</h2>
        <div className="text-white font-medium bg-blue-600 rounded border w-40 pl-4 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/expenses")}>Back to Expenses</div>
      </div>

      <div className="inline text-lg font-medium mr-2">Travel: </div>
      <p className="text-gray-600 text-lg inline font-normal"> {expense.travelTitle}</p>
      <br />
      <div className="inline text-lg font-medium mr-2">Category: </div>
      <p className="text-gray-600 text-lg inline font-normal"> {expense.category}</p>
      <br />
      <div className="inline text-lg font-medium mr-2">Amount: </div>
      <p className="text-gray-600 text-lg inline font-normal"> ₹{expense.amount}</p>
      <br />
      <div className="inline text-lg font-medium mr-2">Date: </div>
      <p className="text-gray-600 text-lg inline font-normal"> {expense.expenseDate}</p>
      <br />
      <div className="inline text-lg font-medium mr-2">Status: </div>
      <p className={`inline p-1 rounded ${statusClasses[expense.status]}`}> {expense.status}</p>

      
      <div className="mt-4">
        <h3 className="text-lg font-medium">Proofs:</h3>
        {expense.proofs.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer"
             className=" text-blue-600 hover:underline">
            View Proof {i + 1}
          </a>
        ))}
      </div>

      
      {expense.status === "DRAFT" && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          Submit Expense
        </button>
      )}

      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Status Timeline:</h3>
        <ul className="text-sm list-disc list-inside">
          {expense.timeline.map((t, i) => (
            <li key={i}>
              <span className="text-lg text-gray-600 mr-4">{t.status}</span>
              <span className="text-base mr-4">by</span>
              <span className="text-lg text-gray-600 mr-4">{t.changedBy}</span> 
              <span className="text-base mr-4">at</span> 
              <span className="text-lg text-gray-600 mr-4">{t.changedAt}</span>
              <span className="text-base ">{t.remark && `Remark: ${t.remark}`}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ExpenseDetails;