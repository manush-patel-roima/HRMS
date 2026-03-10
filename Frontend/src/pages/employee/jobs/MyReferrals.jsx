import { useEffect, useState } from "react";
import JobService from "../../../services/jobs/jobService";
import { useNavigate } from "react-router-dom";

const MyReferrals = () => {

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await JobService.listMyReferrals();
      setReferrals(res.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading referrals...</p>;

  const statusClasses = {
    NEW: 'bg-gray-200 text-gray-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  };

  return (
    <div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">My Referrals</h2>
        <div className="pl-4 text-white font-medium bg-blue-600 rounded border w-30 px-1 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/jobs")}>Back to Jobs</div>
      </div>
      

      {referrals.map(r => (
        <div key={r.referralId}
             className="shadow rounded p-2 flex justify-between animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

          <div>
            <span className="text-lg font-semibold mr-4 ">Friend's Name:  </span>
            <span className="text-lg text-gray-600 font-normal">{r.friendName}</span>
            <br />
            <span className="text-lg font-semibold mr-4">Job Name:  </span>
            <span className="text-lg text-gray-600 font-normal">{r.jobName}</span>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className={`${statusClasses[r.status]} text-semibold text-md rounded p-1`}>{r.status}</span>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default MyReferrals;