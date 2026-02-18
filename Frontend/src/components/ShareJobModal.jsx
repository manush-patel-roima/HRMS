import { useState } from "react";
import JobService from "../services/jobs/jobService";

const ShareJobModal = ({ job, onClose }) => {

  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmails = (list) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return list.every(email => emailRegex.test(email));
  };

  const handleShare = async () => {

    const emailList = emails.split(",").map(e => e.trim());

    if (!validateEmails(emailList)) {
      alert("Invalid email format");
      return;
    }

    try {
      setLoading(true);

      await JobService.shareJob({
        jobId: job.jobId,
        recipientEmails: emailList
      });

      alert("Job shared successfully");
      onClose();

    } catch (err) {
      alert("Failed to share job");
      console.log(err.response || err.response.message || err.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-sky-900 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">

        <h3 className="font-semibold mb-3">Share Job</h3>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter emails separated by comma"
          value={emails}
          onChange={e => setEmails(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={loading}
            onClick={handleShare}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareJobModal;