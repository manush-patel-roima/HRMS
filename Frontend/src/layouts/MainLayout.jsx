import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 ">{children}</main>
        {/* {removed overflow-y-auto}   */}
      </div>
    </div>
  );
};

export default MainLayout;