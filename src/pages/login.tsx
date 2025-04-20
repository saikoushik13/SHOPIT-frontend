import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();

  // State for email/password login form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();

  // Handler for signing in with Google.
  const googleLoginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      console.log({
        name: user.displayName || "",
        email: user.email!,
        photo: user.photoURL || null,
        gender: "", // Not captured on login.
        role: "user",
        dob: "", // Not captured on login.
        _id: user.uid,
      });

      const res = await login({
        name: user.displayName || "",
        email: user.email!,
        photo: user.photoURL || "",
        gender: "",
        role: "user",
        dob: "",
        _id: user.uid,
      });

      if ("data" in res) {
        toast.success(res.data.message);
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user!));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Google Sign In Failed");
      console.error(error);
    }
  };

  // Handler for signing in with email and password.
  const emailLoginHandler = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      console.log({
        name: user.displayName || "",
        email: user.email!,
        photo: user.photoURL || null, // Likely null with email auth.
        gender: "", // Not captured on login.
        role: "user",
        dob: "", // Not captured on login.
        _id: user.uid,
      });

      const res = await login({
        name: user.displayName || "",
        email: user.email!,
        photo: user.photoURL || "",
        gender: "",
        role: "user",
        dob: "",
        _id: user.uid,
      });

      if ("data" in res) {
        toast.success(res.data.message);
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user!));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Email Sign In Failed");
      console.error(error);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>



        {/* Email/Password Sign In */}
        <div>
          <label>Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div>
          <button onClick={emailLoginHandler}>Login with Email</button>
        </div>
        <hr style={{ margin: "2rem 0" }} />

        <div>
          <button onClick={googleLoginHandler} style={{ display: "flex", alignItems: "center" }}>
            {/* Assuming you still want to use the Google icon */}
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
        <div className="signup-prompt">
           <p className="login-link">
                    Don't have an account? <Link to="/signup">Signup</Link>
            </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
