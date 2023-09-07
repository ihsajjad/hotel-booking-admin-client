import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const PrivetRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <button className="btn w-fit h-fit bg-[var(--main-color)] text-white">
          <span className="loading loading-spinner"></span>
          loading..
        </button>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivetRouter;
