import { useContext, useState } from "react";
import { AuthContext } from "./components/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { googleSignIn, logInUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((res) => {
        if (res.user) {
          navigate("/");
        }
      })
      .catch((error) => console.log(error.massage));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    logInUser(email, password)
      .then((res) => {
        if (res.user) {
          navigate("/");
        }
      })
      .catch((err) => setError(err.message));
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2">
      <h3 className="text-4xl text-center text-[var(--main-color)] font-bold my-8">
        Book. Stay. Enjoy.
      </h3>
      <div className=" md:w-1/3 border-2 border-[var(--main-color)] p-5 m-2 rounded-lg shadow-2xl shadow-black">
        <h3 className="form-title">Please Login!</h3>
        <form onSubmit={handleLogin} className="flex flex-col gap-1">
          <div>
            <label className="md:text-xl">Email:</label>
            <input
              type="email"
              name="email"
              id="email-input"
              className="form-input"
            />
          </div>
          <div>
            <label className="md:text-xl">Password:</label>
            <input
              type="password"
              name="password"
              id="password-input"
              className="form-input"
            />
          </div>
          <span className="text-red-500">{error}</span>
          <input
            type="submit"
            value="Login"
            className="custom-btn-outline w-full mt-1"
          />
        </form>

        <div className="mt-5 flex items-center justify-center">
          <button className="lgin-btn" onClick={handleGoogleSignIn}>
            G
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
