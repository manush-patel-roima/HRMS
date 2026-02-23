import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../../services/jobs/jobService";
import { showWarningToast } from "../../utils/toastUtils";

const CreateJob = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [reviewers, setReviewers] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmails = (list) => {
    const regex = /\S+@\S+\.\S+/;
    return list.every(email => regex.test(email));
  };

  const handleSubmit = async () => {

    if (!title || !description) {
      showWarningToast("Title and Description are required");
      return;
    }

    const reviewerList = reviewers
      ? reviewers.split(",").map(r => r.trim())
      : [];

    if (reviewerList.length && !validateEmails(reviewerList)) {
      showWarningToast("Invalid reviewer email format");
      return;
    }

    const formData = new FormData();

    formData.append("data",
      new Blob([JSON.stringify({
        title,
        description,
        hrContactEmail: hrEmail,
        reviewerEmails: reviewerList
      })], { type: "application/json" })
    );

    if (jdFile) {
      if (jdFile.type !== "application/pdf") {
        showWarningToast("Only PDF JD allowed");
        return;
      }
      formData.append("jdFile", jdFile);
    }

    try {
      setLoading(true);
      await JobService.createJob(formData);
      navigate("/hr/jobs");
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">

      <div className="text-blue-600 underline mb-6" onClick={()=>navigate("/hr/jobs")}>Back to Jobs</div>

      <h2 className="text-xl font-bold mb-4">Create Job</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="HR Email"
        onChange={e => setHrEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Reviewer Emails (comma-separated)"
        onChange={e => setReviewers(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        className="mb-4"
        onChange={e => setJdFile(e.target.files[0])}
      />

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default CreateJob;