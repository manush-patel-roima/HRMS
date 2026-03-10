import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastProvider } from "./context/ToastContext";


function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right" 
        autoClose={1000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick={true} 
        rtl={false} 
        pauseOnFocusLoss={true} 
        draggable={true} 
        pauseOnHover={true} 
        theme="light" 
        limit={3} 
      />
    </ToastProvider>
  );
}

export default App;




