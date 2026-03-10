import { useEffect, useState } from "react";
import JobService from "../../../services/jobs/jobService";
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

  const statusClasses = {
  NEW: 'bg-gray-200 text-gray-800 shadow',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800 shadow',
  REVIEWED: 'bg-green-100 text-green-800 shadow',
  REJECTED: 'bg-red-100 text-red-800 shadow'
  };

  return (
    <div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">All Referrals</h2>
        <div className="text-white font-medium bg-blue-600 rounded border w-30 pl-3 py-2 mb-6 cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" onClick={()=>navigate("/hr/jobs")}>Back to Jobs</div>
      </div>

      <div className=" p-4 flex flex-col gap-2">

        {referrals.map(r => (
          <div key={r.referralId}
               className="shadow rounded p-2 flex justify-between items-center animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

            <div>
              <span className="text-lg font-semibold mr-4">Friend's Name:  </span>
              <span className="text-lg font-normal text-gray-600" >{r.friendName}</span>
              <br />
              <span className="text-lg font-semibold mr-4">Job Name:  </span>
              <span className="text-lg font-normal text-gray-600">{r.jobName}</span>
              <br />
              <span className="text-lg font-semibold mr-4">Referred By:  </span>
              <span className="text-lg font-normal text-gray-600">{r.referrer}</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className={`p-1 rounded ${statusClasses[r.status]}`}>{r.status}</span>

              {r.status === "NEW" && (
                <button
                  onClick={() => updateStatus(r.referralId, "IN_REVIEW")}
                  className=" border border-blue bg-blue-200 font-semibold rounded px-2 py-1 text-blue-800 text-sm"
                >
                  START REVIEW
                </button>
              )}

              {r.status === "IN_REVIEW" && (
                <>
                  <button
                    onClick={() => updateStatus(r.referralId, "REVIEWED")}
                    className=" border cursor-pointer border-green bg-green-200 font-semibold rounded px-2 py-1 text-green-800 text-sm"
                  >
                    MARK REVIEWED
                  </button>

                  <button
                    onClick={() => updateStatus(r.referralId, "REJECTED")}
                    className=" border cursor-pointer border-red bg-red-200 font-semibold rounded px-2 py-1 text-red-800 text-sm"
                  >
                    REJECT
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