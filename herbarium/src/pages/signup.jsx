import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../components/firebase.jsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import NavBar from "../components/navbar.jsx";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
//Check if username exists in db when registering
  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const usernameExists = await checkUsernameExists(formData.username);
      if (usernameExists) {
        alert("Username taken. Please choose another.");
        return;
      }

      //Create a new user with Firebase auth
      const credentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = credentials.user; //returns user data

      //Creates user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.username,
        email: user.email,
      });

      handleClick();
    } catch(error) {
      if (error.code === "auth/email-already-in-use"){
        alert("Account already created with " + formData)
      } else {
        console.log(error.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (

    <div style={{ flex: 1, justifyContent:"flex-start"}}>
                <NavBar />
    <div className="main" >
      

    
      <h2 style={{color: '#DCD7C9'}}className="mainFont">Signup</h2>
      <form className="mx-auto mt-4" style={{ maxWidth: "400px",}} onSubmit={handleSignup}>
        <div className="mb-3">
          <label style={{color: '#DCD7C9'}} className="mainFont form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label style={{color: '#DCD7C9'}} className="mainFont form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label style={{color: '#DCD7C9'}} className="mainFont form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label style={{color: '#DCD7C9'}} className="mainFont form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
      <div className="text-center mt-3">
      </div>
   
    </div>
    </div>
  );
}

export default Signup;

