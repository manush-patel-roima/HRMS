// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import MainLayout from "./layouts/MainLayout";
// import Dashboard from "./pages/common/Dashboard";
// import MyTravels from "./pages/employee/MyTravels";
// import TravelDetails from "./pages/employee/TravelDetails";
// import TeamTravels from "./pages/manager/TeamTravels";
// import TravelManagement from "./pages/hr/TravelManagement";
// import CreateTravel from "./pages/hr/CreateTravel";
// import HRTravelDetails from "./pages/hr/HRTravelDetails";
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
        
//         <Route path="/" element={<ProtectedRoute/>}>
//           <Route element={<MainLayout/>}>
            
//               <Route index element={<Dashboard />} />

//               {/* EMPLOYEE */}
//               <Route path="travels" element={<MyTravels />} />
//               <Route path="travels/:id" element={<TravelDetails />} />

//               {/* MANAGER */}
//               <Route path="team-travels" element={<TeamTravels />} />

//               {/* HR */}
//               <Route path="hr/travels" element={<TravelManagement />} />
//               <Route path="hr/travels/new" element={<CreateTravel />} />
//               <Route path="hr/travels/:id" element={<HRTravelDetails />} />
            
//           </Route>
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/common/Dashboard";

import MyTravels from "./pages/employee/MyTravels";
import TravelDetails from "./pages/employee/TravelDetails";

import TeamTravels from "./pages/manager/TeamTravels";
import TeamTravelDetails from "./pages/manager/TeamTravelDetails";

import TravelManagement from "./pages/hr/TravelManagement";
import CreateTravel from "./pages/hr/CreateTravel";
import HRTravelDetails from "./pages/hr/HRTravelDetails";

import AddExpense from "./pages/employee/AddExpense";
import ExpenseDetails from "./pages/employee/ExpenseDetails";
import MyExpenses from "./pages/employee/MyExpenses";

import TeamExpenses from "./pages/manager/TeamExpenses";

import ExpenseApprovals from "./pages/hr/ExpenseApprovals";
import ExpenseDetail from "./pages/hr/ExpenseDetail"

import OrgChart from "./pages/orgchart/OrgChart";

import JobListings from "./pages/employee/JobListings";
import MyReferrals from "./pages/employee/MyReferrals";

import JobsManagement from "./pages/hr/JobsManagement";
import CreateJob from "./pages/hr/CreateJob";
import ReferralsList from "./pages/hr/ReferralsList";

import ConfigManagement from "./pages/hr/ConfigManagement";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthService from "./services/auth/authService";



function App() {

  const isLoggedIn = AuthService.isAuthenticated();

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* {Travel Routes} */}

        <Route
          path="/travels"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyTravels />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/travels/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TravelDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/team-travels"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TeamTravels/>
              </MainLayout>
            </ProtectedRoute>
          }/>

        <Route
          path="/team-travels/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TeamTravelDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />          

        <Route
          path="/hr/travels"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TravelManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/travels/new"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateTravel />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/travels/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HRTravelDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* {Expense Routes} */}

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyExpenses />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/new"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddExpense />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpenseDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-expenses"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TeamExpenses />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/expenses"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpenseApprovals />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/expenses/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpenseDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* {OrgChart Routes} */}

        <Route
          path="/org-chart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrgChart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* {Jobs Routes} */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JobListings/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/myreferrals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyReferrals/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/jobs/new"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateJob/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/jobs"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JobsManagement/>
              </MainLayout>
            </ProtectedRoute>
          }
        />                

        <Route
          path="/hr/referralslist"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReferralsList/>
              </MainLayout>
            </ProtectedRoute>
          }
        />    

        {/* {System Config Route} */}   

        <Route
          path="/hr/config"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ConfigManagement/>
              </MainLayout>
            </ProtectedRoute>
          }
        />          

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;