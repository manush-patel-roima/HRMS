import { useEffect, useState } from "react";
import TravelService from "../services/travel/travelService";

const DocumentTable = ({ travelId }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [travelId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await TravelService.getTravelDocuments(travelId);
      setDocs(res.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Documents</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>File</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Uploaded By</th>
            <th>For Whom</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(d => (
            <tr key={d.documentId}>
              <td>
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {d.fileName}
                </a>
              </td>
              <td>{d.documentType}</td>
              <td>{d.ownerType}</td>
              <td>{d.uploadedBy}</td>
              <td>{d.selectedEmployee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;