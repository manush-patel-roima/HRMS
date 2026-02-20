import { useEffect, useState } from "react";
import JobService from "../../services/jobs/jobService";
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
    } catch {
      alert("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading referrals...</p>;

  return (
    <div>

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/jobs")}>Back to Jobs</div>

      <h2 className="text-xl font-bold mb-4">My Referrals</h2>

      {referrals.map(r => (
        <div key={r.referralId}
             className="border-b py-2 flex justify-between">

          <div>
            <p>Friend's Name:  {r.friendName}</p>
            <p>Job Id:  {r.jobId}</p>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className={r.status === 'REVIEWED' ? 'text-green-500 text-semibold text-md' : 'text-red-500 text-semibold text-md'}>{r.status}</span>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default MyReferrals;