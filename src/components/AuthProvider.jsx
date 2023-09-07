import { createContext, useEffect, useState } from "react";
import app from "./../firebase/firebase.config";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  // loading users data
  useEffect(() => {
    const loadUserData = (email) => {
      setLoading(true);
      if (email) {
        fetch(`http://localhost:5000/single-user/${email}`)
          .then((res) => res.json())
          .then((data) => {
            setUserData(data);
            if (data) {
              setLoading(false);
              if (user?.email !== data?.email) {
                return logOut();
              }
            }
          });
      }
    };

    loadUserData(user?.email);
  }, [user?.email]);

  // sign in with google
  const googleProvider = new GoogleAuthProvider();
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  //   login user with email and password
  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout user
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  //   observing the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    logInUser,
    logOut,
    googleSignIn,
    userData,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
