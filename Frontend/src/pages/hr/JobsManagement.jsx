import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../../services/jobs/jobService";

const JobsManagement = () => {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await JobService.listJobs();
      setJobs(res.data);
    } catch {
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (jobId) => {
    if (!window.confirm("Are you sure you want to deactivate this job?"))
      return;

    try {
      await JobService.deactivateJob(jobId);
      setJobs(prev => prev.filter(job => job.jobId !== jobId));
    } catch {
      alert("Failed to deactivate job");
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Jobs Management</h2>

        <button
          onClick={() => navigate("/hr/jobs/new")}
          className="bg-green-600 text-white px-4 py-2 ml-90 rounded"
        >
          Create Job
        </button>

        <button
          onClick={() => navigate("/hr/referralslist")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Referrals List
        </button>        
      </div>

      <div className="grid grid-cols-3 gap-4">
        {jobs.map(job => (
          <div key={job.jobId} className="bg-white p-4 rounded shadow">

            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {job.description}
            </p>

            <button
              onClick={() => handleDeactivate(job.jobId)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Deactivate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsManagement;