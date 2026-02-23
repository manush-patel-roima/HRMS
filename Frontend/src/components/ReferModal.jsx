import { useState } from "react";
import JobService from "../services/jobs/jobService";
import { showWarningToast } from "../utils/toastUtils";

const ReferModal = ({ job, onClose }) => {

  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [note, setNote] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRefer = async () => {

    if (!cvFile) {
      showWarningToast("CV is required (PDF only)");
      return;
    }

    if (cvFile.type !== "application/pdf") {
      showWarningToast("Only PDF allowed");
      return;
    }

    const formData = new FormData();

    formData.append("data",
      new Blob([JSON.stringify({
        jobId: job.jobId,
        friendName,
        friendEmail,
        note
      })], { type: "application/json" })
    );

    formData.append("cvFile", cvFile);

    try {
      setLoading(true);
      await JobService.referJob(formData);
      onClose();
    } catch (err) {
      console.error('Referral error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-sky-900 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">

        <h3 className="font-semibold mb-3">Refer Friend</h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Friend Name"
          onChange={e => setFriendName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Friend Email"
          onChange={e => setFriendEmail(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Note"
          onChange={e => setNote(e.target.value)}
        />

        <input
          type="file"
          className="mb-3"
          accept="application/pdf"
          onChange={e => setCvFile(e.target.files[0])}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={loading}
            onClick={handleRefer}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReferModal;