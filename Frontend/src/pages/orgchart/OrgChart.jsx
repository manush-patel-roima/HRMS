import { useEffect, useState } from "react";
import OrgChartService from "../../services/orgchart/orgChartService";

const OrgChart = () => {

  const [data, setData] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    OrgChartService.getMyOrgChart()
      .then(res => setData(res.data));

    OrgChartService.getAllEmployees()
      .then(res => setEmployees(res.data));
  }, []);

  const loadEmployee = (employeeId) => {
    OrgChartService.getOrgChart(employeeId)
      .then(res => setData(res.data));
  };

  if (!data) return <div>Loading...</div>;

  const Avatar = ({employee, size = "w-14 h-14"}) => (
    <div className="flex flex-col items-center">
      {employee.profileImageUrl ? (
        <img 
          src="{employee.profileImageUrl}"
          alt="{employee.fullName}"
          className={`${size} rounded-full object-cover border-2 border-white shadow`}
        />
      ) : (
        <div className={`${size} rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg shadow`}>
          {employee.fullName.charAt(0).toUpperCase()}
        </div>
      )}

      <p className="mt-2 font-semibold text-sm">{employee.fullName}</p>
      <p className="text-xs text-gray-600">{employee.designation}</p>

    </div>

  );

  return (
    <>
      <select

        className="border p-2 w-full mb-2"
        onChange={e => {
          
          if(e.target.value){
            loadEmployee(parseInt(e.target.value));
          }
          
        }}
      >
        <option value="" disabled>Select Employee</option>
        {employees.map(e => (
          <option key={e.employeeId} value={e.employeeId}>
            {e.employeeName}
          </option>
        ))}
      </select>   

      
      <div className="bg-white p-6 rounded shadow flex flex-col items-center">
        
        
        {data.managerChain.length > 0 && (
          <div className="relative pb-6 flex flex-col-reverse items-center">
            
            <div className="absolute bottom-0 w-px h-6 bg-gray-300"></div>
            
            {data.managerChain.map((m, index) => (
              <div key={m.employeeId}>
                {index < data.managerChain.length - 1 && (
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-6 bg-gray-300"></div>
                    <div className="h-6"></div> 
                  </div>
                )}

                <div 
                  className="bg-sky-100 p-4 rounded-lg cursor-pointer hover:bg-gray-100 text-center w-48 shadow" 
                  onClick={() => loadEmployee(m.employeeId)}
                >
                  <p className="text-xs text-blue-700 font-medium mb-2">Manager</p>
                  <Avatar employee={m} size="w-16 h-16"/>
                </div>
              </div>
            ))}
          </div>
        )}

        
        <div className="relative p-6 rounded-lg shadow-lg text-center w-52 z-10 bg-gray-100">
          <Avatar employee={data.selectedEmployee} size="w-16 h-16"/>
        </div>

        
        {data.directReports.length > 0 && (
          <div className="relative pt-6 w-full flex flex-col items-center">
            
            <div className="absolute top-0 w-px h-6 bg-gray-300"></div>
            
            <h3 className="font-semibold mb-4 text-sm text-gray-700">Direct Reports</h3>
            
            <div className="flex gap-6 justify-center flex-wrap"> 
              {data.directReports.map(emp => (
                <div 
                  key={emp.employeeId} 
                  className="bg-sky-100 p-6 rounded-lg cursor-pointer hover:bg-gray-100 text-center w-48 shadow"
                  onClick={() => loadEmployee(emp.employeeId)}
                >
                  <Avatar employee={emp} size="w-16 h-16"/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

};

export default OrgChart;