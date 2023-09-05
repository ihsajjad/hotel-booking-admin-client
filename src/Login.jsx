import { useContext } from "react";
import { AuthContext } from "./components/AuthProvider";

const Login = () => {
  const { googleSignIn, user } = useContext(AuthContext);
  console.log(user);
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((res) => console.log(res))
      .catch((error) => console.log(error.massage));
  };
  return (
    <div className="login-container">
      <div className="form-container">
        <h3>Please Login!</h3>
        <form>
          <div>
            <label htmlFor="email-input">Email:</label>
            <input type="email" name="email" id="email-input" />
          </div>
          <div>
            <label htmlFor="">Password:</label>
            <input type="password" name="password" id="password-input" />
          </div>
          <input type="submit" value="Login" />
        </form>

        <div className="social-login">
          <button onClick={handleGoogleSignIn}>G</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
