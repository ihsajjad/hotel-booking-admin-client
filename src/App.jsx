import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./components/AuthProvider";
import UserDashboard from "./components/UserDashboard";
import HotelManagerDashboard from "./components/HotelManagerDashboard";
import { ReactNotifications } from "react-notifications-component";

function App() {
  const { logOut, userData } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut();
  };

  const isUser = userData?.role?.toLowerCase() === "user";
  const isHotelManager = userData?.role?.toLowerCase() === "hotelmanager";
  return (
    <main className="min-h-screen w-full bg-blue-50">
      {/* navbar */}
      <div className="w-full md:px-10 p-2 flex items-center justify-between bg-[var(--main-color)] sticky z-10 left-0 top-0">
        <div>
          <h3 className="text-2xl font-bold text-white">Hotel Booking</h3>
        </div>
        <button onClick={handleLogOut} className="btn md:btn-sm btn-xs">
          Log Out
        </button>
      </div>
      <ReactNotifications isMobile={true} />
      {(isUser && <UserDashboard />) ||
        (isHotelManager && <HotelManagerDashboard />)}
    </main>
  );
}

export default App;
