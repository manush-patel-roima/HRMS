import { useEffect, useState } from "react";
import JobService from "../../services/jobs/jobService";

const MyReferrals = () => {

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <a href="/jobs" className="text-blue-600 underline mb-6 ">Back to Jobs</a>

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