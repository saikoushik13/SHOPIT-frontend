import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();

  // Shared fields for every user.
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  // Fields specific to email sign-up.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();

  // Handler for Email/Password signup.
  const emailSignupHandler = async () => {
    if (!name || !dob || !gender) {
      toast.error("Name, Date of Birth and Gender are required.");
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name, photoURL: "" });
      const payload = {
        name,
        email: user.email!,
        photo: " ",
        gender,
        role: "user",
        dob,
        _id: user.uid,
      };
      console.log(payload);

      const res = await login(payload);
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
      toast.error("Email Signup Failed");
    }
  };

  // Handler for Google signup.
  const googleSignupHandler = async () => {
    if (!name || !dob || !gender) {
      toast.error("Name, Date of Birth and Gender are required.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      // Update display name if needed.
      if (!user.displayName || user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }
      const payload = {
        name,
        email: user.email!,
        photo: user.photoURL || " ",
        gender,
        role: "user",
        dob,
        _id: user.uid,
      };
      console.log(payload);

      const res = await login(payload);
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
      toast.error("Google Signup Failed");
    }
  };

  return (
    <div className="signup">
      <main>
        <h1>Sign Up</h1>
        
        {/* Shared Fields */}
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <hr />

        {/* Email Signup */}
        <h2>Sign Up with Email</h2>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email"
            value={email}
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={emailSignupHandler} className="btn">Sign Up with Email</button>

        <div className="divider">OR</div>

        {/* Google Signup */}
        <button onClick={googleSignupHandler} className="btn google">Sign Up with Google</button>

        {/* Login Link */}
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;
