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
    <div className="bg-white p-4 rounded shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">
      <h3 className="text-lg font-medium mb-2">Documents</h3>
      <table className="w-full border-1">
        <thead>
          <tr className="border-b">
            <th className="border-r">File</th>
            <th className="border-r">Type</th>
            <th className="border-r">Owner</th>
            <th className="border-r">Uploaded By</th>
            <th className="border-r">For Whom</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(d => (
            <tr key={d.documentId}>
              <td className="pl-2 border-r">
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {d.fileName}
                </a>
              </td>
              <td className="pl-2 border-r">{d.documentType}</td>
              <td className="pl-2 border-r">{d.ownerType}</td>
              <td className="pl-2 border-r">{d.uploadedBy}</td>
              <td className="pl-2 border-r">{d.selectedEmployee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;