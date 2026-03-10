import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/common/Dashboard";

import MyTravels from "../pages/employee/travel/MyTravels";
import TravelDetails from "../pages/employee/travel/TravelDetails";

import TeamTravels from "../pages/manager/TeamTravels";
import TeamTravelDetails from "../pages/manager/TeamTravelDetails";

import TravelManagement from "../pages/hr/travel/TravelManagement";
import CreateTravel from "../pages/hr/travel/CreateTravel";
import HRTravelDetails from "../pages/hr/travel/HRTravelDetails";
import EditTravel from "../pages/hr/travel/EditTravel";

import AddExpense from "../pages/employee/expense/AddExpense";
import ExpenseDetails from "../pages/employee/expense/ExpenseDetails";
import MyExpenses from "../pages/employee/expense/MyExpenses";

import TeamExpenses from "../pages/manager/TeamExpenses";

import ExpenseApprovals from "../pages/hr/expense/ExpenseApprovals";
import ExpenseDetail from "../pages/hr/expense/ExpenseDetail"

import OrgChart from "../pages/orgchart/OrgChart";

import JobListings from "../pages/employee/jobs/JobListings";
import MyReferrals from "../pages/employee/jobs/MyReferrals";

import JobsManagement from "../pages/hr/jobs/JobsManagement";
import CreateJob from "../pages/hr/jobs/CreateJob";
import ReferralsList from "../pages/hr/jobs/ReferralsList";

import ConfigManagement from "../pages/hr/systemconfig/ConfigManagement";

import GamesDashboard from "../pages/employee/games/GamesDashboard";
import UpcomingSlots from "../pages/employee/games/UpcomingSlots";
import MakeBookingRequest from "../pages/employee/games/MakeBookingRequest";
import MyBookings from "../pages/employee/games/MyBookings";

import GameConfig from "../pages/hr/games/GameConfig";
import SlotMonitor from "../pages/hr/games/SlotMonitor";

import MainLayout from "../layouts/MainLayout";
import AuthService from "../services/auth/authService";
import SocialFeed from "../components/SocialFeed";



const RootRedirectHandler = () => {

  const isLoggedIn = AuthService.isAuthenticated();
  if(!isLoggedIn){
    return <Navigate to="/login" replace />
  }

  return <MainLayout></MainLayout>
};


const routes = [
  {
    path: "/",
    element:  <RootRedirectHandler/>,
    children: [
      {index: true, element: <Navigate to="/dashboard" replace />},

      //Dashboard Route
      
      {path: "dashboard", element: <Dashboard/>},

      // Travel Routes

      {
        path: "travels",
        children: [
          {index: true, element: <MyTravels/>},
          {path: ":id", element: <TravelDetails/>},
        ]
      },

      {
        path: "team-travels",
        children: [
          {index: true, element: <TeamTravels/>},
          {path: ":id", element: <TeamTravelDetails/>}
        ]
      },

      {
        path: "hr/travels",
        children: [
          {index: true, element: <TravelManagement/>},
          {path: "new", element: <CreateTravel/>},
          {path: ":id", element: <HRTravelDetails/>},
          {path: ":id/edit", element: <EditTravel/>}
        ]
      },


      // Expense routes

      {
        path: "expenses",
        children: [
          {index: true, element: <MyExpenses/>},
          {path: "new", element: <AddExpense/>},
          {path: ":id", element: <ExpenseDetails/>},
        ]
      },

      {
        path: "team-expenses", element: <TeamExpenses/>
      },

      {
        path: "hr/expenses",
        children: [
          {index: true, element: <ExpenseApprovals/>},
          {path: ":id", element: <ExpenseDetail/>},
        ]
      },


      // Org Chart Route

      {
        path: "org-chart", element: <OrgChart/>
      },


      // Job Routes

      {
        path: "jobs",
        children: [
          {index: true, element: <JobListings/>},
          {path: "myreferrals", element: <MyReferrals/>}
        ]
      },

      {
        path: "hr/jobs",
        children: [
          {index: true, element: <JobsManagement/>},
          {path: "new", element: <CreateJob/>},
          {path: "referralslist", element: <ReferralsList/>}
        ]
      },


      // System Config Route

      {
        path: "hr/config", element: <ConfigManagement/>
      },


      // Game Routes

      {
        path: "games", element: <GamesDashboard/>
      },

      {
        path: "games/:gameId/slots", element: <UpcomingSlots/>
      },

      {
        path: "booking/:slotId", element: <MakeBookingRequest/>
      },

      {
        path: "my-bookings", element: <MyBookings/>
      },

      {
        path: "hr/games-config", element: <GameConfig/>
      },

      {
        path: "hr/slot-monitor", element: <SlotMonitor/>
      },


      // Social Achievements and Celebrations Route

      {
        path: "social", element: <SocialFeed/>
      }

    ] 
  },

  // Login Route
  
  {
    path: "/login",
    element: <Login/>
  }

]

const router = createBrowserRouter(routes);

export default router;