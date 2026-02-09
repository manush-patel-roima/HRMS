import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
        path="/login" 
        element={<Login />} 
        />
        
        <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <h1>HRMS Dashboard</h1>
          </ProtectedRoute>
        } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;