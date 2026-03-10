import { useEffect, useState } from "react";
import JobService from "../../../services/jobs/jobService";
import ShareJobModal from "../../../components/ShareJobModal";
import ReferModal from "../../../components/ReferModal";
import { useNavigate } from "react-router-dom";

const JobListings = () => {

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await JobService.listJobs();
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl text-slate-700 font-bold mb-4">Active Job Listings</h2>
        <button
          onClick={() => navigate("/jobs/myreferrals")}
          className="bg-green-600 text-white font-medium px-4 py-2 cursor-pointer rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          My Referrals
        </button>            
      </div>
      

      <div className="grid grid-cols-3 gap-4 ">
        {jobs.map(job => (
          <div key={job.jobId}
               className="bg-white p-4 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-md font-normal text-gray-600 mb-3">
              {job.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedJob(job);
                  setShowShare(true);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer text-sm animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
              >
                Share
              </button>

              <button
                onClick={() => {
                  setSelectedJob(job);
                  setShowRefer(true);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer text-sm animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
              >
                Refer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showShare && (
        <ShareJobModal
          job={selectedJob}
          onClose={() => setShowShare(false)}
        />
      )}

      {showRefer && (
        <ReferModal
          job={selectedJob}
          onClose={() => setShowRefer(false)}
        />
      )}
    </div>
  );
};

export default JobListings;