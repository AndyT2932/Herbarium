import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase.jsx";
import "./login.css"
import NavBar from "../components/navbar.jsx";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      handleClick();
      console.log("Login successful");
    } catch (err) {
      console.log(err.message);
      setError("Invalid email or password. Please try again.");
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  }

  const handleClick = () => {
    navigate("/upload"); //Redirect to user collection once created?
  };

  return (
    <div style={{ flex: 1, justifyContent:"flex-start"}}>
                <NavBar />
  
    <div className="main">
    <h2 style={{color: '#DCD7C9'}}className="mainFont">Login</h2>
    <form className="mx-auto mt-4" style={{ maxWidth: "400px" }} onSubmit={handleLogin}>
        <div className="mb-3">
          <label style={{color: "#DCD7C9"}} className="mainFont from-label" htmlFor="username">Email</label>
          <input 
            type="text"  
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label style={{color: "#DCD7C9"}} className="mainFont from-label" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="text-danger text-center">{error}</p>}
        <button type="submit" className="btn btn-primary w-100" >Login</button>
      </form>
    </div>

    </div>
  );
}

export default Login;
