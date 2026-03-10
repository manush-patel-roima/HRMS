import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../../../services/jobs/jobService";

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
      <div className="flex justify-between mb-10">
        <h2 className="text-2xl text-slate-700 font-bold">Jobs Management</h2>

        <button
          onClick={() => navigate("/hr/jobs/new")}
          className="bg-green-600 text-white cursor-pointer font-medium p-2 ml-100 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          Create Job
        </button>

        <button
          onClick={() => navigate("/hr/jobs/referralslist")}
          className="bg-green-600 text-white cursor-pointer font-medium p-2 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          Referrals List
        </button>        
      </div>

      <div className="grid grid-cols-3 gap-4">
        {jobs.map(job => (
          <div key={job.jobId} className="bg-white p-4 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">

            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-md font-normal text-gray-600 mb-3">
              {job.description}
            </p>

            <button
              onClick={() => handleDeactivate(job.jobId)}
              className=" cursor-pointer bg-red-600 text-white px-3 py-1 rounded text-sm animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
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