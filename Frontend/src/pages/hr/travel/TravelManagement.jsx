import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TravelService from "../../../services/travel/travelService";
import { showErrorToast } from "../../../utils/toastUtils";

import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const TravelManagement = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    TravelService.getTravels().then(res => setTravels(res.data));
  }, []);

  const handleDelete = async (id) => {

     
    try{
      if (!window.confirm("Delete this travel?")) return;

      setLoading(true);
      await TravelService.deleteTravel(id);

      setTravels(prev =>
        prev.filter(t => t.travelId !== id)
      );      
    }catch(err){
      showErrorToast(err.response?.data?.message || "Failed to delete travel");
    }finally{
      setLoading(false);
    }
  };

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h2 className="text-2xl text-slate-700 font-bold">All Travels</h2>
//         <button
//           onClick={() => navigate("/hr/travels/new")}
//           className="cursor-pointer bg-green-600 text-white text-lg font-medium px-4 py-2 rounded animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
//         >
//           Create Travel
//         </button>
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         {travels.map(t => (
//           <div
//             key={t.travelId}
//             className="bg-white p-4 rounded shadow cursor-pointer animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5"
//             onClick={() => navigate(`/hr/travels/${t.travelId}`)}
//           >
//             <h3 className="text-xl font-semibold mb-1">{t.title}</h3>
//             <div className="border-2 border-sky-700"></div>
//             <p className="text-lg text-gray-600 mt-1">
//               {t.startDate} → {t.endDate}
//             </p>
//             <button
//               className="mt-2 bg-red-500 text-white font-medium px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDelete(t.travelId);
//               }}
//               disabled={loading}
//             >
//               {loading ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TravelManagement;


  return (
      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl text-slate-700 font-bold">All Travels</h2>
          <Button onClick={()=> navigate('/hr/travels/new')} variant="default" size="default" className="text-lg font-medium animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5">
            Create Travel
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {travels.map(t => (

            <Card
             key={t.travelId}
             className="cursor-pointer shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 hover:-translate-x-0.5" 
             onClick={() => navigate(`/hr/travels/${t.travelId}`)}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{t.title}</CardTitle>
                <div className="border-2 border-sky-700"></div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">
                  {t.startDate} → {t.endDate}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center ">
                <Button 
                  variant="destructive" 
                  size="sm"   
                  className="font-medium cursor-pointer shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "   
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.travelId);
                  }}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
                <Button
                 onClick={(e)=> {
                  e.stopPropagation();
                  navigate(`/hr/travels/${t.travelId}/edit`)
                 }}
                 variant="default"
                 size="sm"
                 className="font-medium cursor-pointer shadow animation duration-500 ease-in-out hover:shadow-xl hover:scale-100 hover:-translate-y-0.5 "
                >
                  Update
                </Button>
              </CardFooter>

            </Card>
          ))}
        </div>
      </div>
  );
};

export default TravelManagement;