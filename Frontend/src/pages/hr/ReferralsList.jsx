import { useEffect, useState } from "react";
import JobService from "../../services/jobs/jobService";
import { useNavigate } from "react-router-dom";

const ReferralsList = () => {

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await JobService.listAllReferrals();
      setReferrals(res.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await JobService.updateReferralStatus(id, { status });
      fetchReferrals();
    } catch (error) {
      console.error('Error updating referral status:', error);
    }
  };

  if (loading) return <p>Loading referrals...</p>;

  return (
    <div>

      <div className="text-blue-600 underline mb-6 cursor-pointer" onClick={()=>navigate("/hr/jobs")}>Back to Jobs</div>

      <h2 className="text-xl font-bold mb-4">All Referrals</h2>

      <div className="bg-white p-4 rounded shadow">

        {referrals.map(r => (
          <div key={r.referralId}
               className="border-b py-2 flex justify-between items-center">

            <div>
              <p className="font-semibold">Friend's Name: {r.friendName}</p>
              <p className="text-sm text-gray-500">Job Name: {r.jobName}</p>
              <p className="text-sm text-gray-500">Referred By: {r.referrer}</p>
            </div>

            <div className="flex gap-2 items-center">
              <span>{r.status}</span>

              {r.status === "NEW" && (
                <button
                  onClick={() => updateStatus(r.referralId, "IN_REVIEW")}
                  className="border-2 border-blue bg-blue-200 font-semibold rounded px-2 py-1 text-blue-600 text-sm"
                >
                  Start Review
                </button>
              )}

              {r.status === "IN_REVIEW" && (
                <>
                  <button
                    onClick={() => updateStatus(r.referralId, "REVIEWED")}
                    className="border-2 border-green bg-green-200 font-semibold rounded px-2 py-1 text-green-600 text-sm"
                  >
                    Mark Reviewed
                  </button>

                  <button
                    onClick={() => updateStatus(r.referralId, "REJECTED")}
                    className="border-2 border-red bg-red-200 font-semibold rounded px-2 py-1 text-red-600 text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default ReferralsList;