import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login";
import Signup from "./pages/signup";
import Upload from './pages/upload';
import About from './pages/about';
import Map from './pages/map';
import NavBar from './components/navbar';
import Herbarium from './pages/herbarium';
import PlantView from './pages/plantView';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div style={{ flex: 1 }}>
      <NavBar />

      {/* Centered Content */}
      <div className="main">
        <h1 className="mainFont" style={{ fontSize: "100px", color: "#DCD7C9", zIndex: 1 }}>
          Welcome to Herbarium
        </h1>
        <h2 className="mainFont" style={{ fontSize: "40px", color: "#DCD7C9", zIndex: 1 }}>
          Your digital botanical garden for discovering and documenting plants you encounter in your daily life
        </h2>
        
      </div>

      <img
        src="src/assets/Frame.svg"
        alt="Decorative Frame"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "auto",
          maxWidth: "300px",
          height: "auto",
          zIndex: 0,
        }}
      />
    </div>
  );
}

function App() {
  return (

    <Router>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/upload' element={<Upload/>} />
        <Route path='/about' element={<About/>} />
        <Route path="/map" element={<Map />} />
        <Route path="/herbarium" element={<Herbarium />} />
        <Route path="/plantview" element={<PlantView />} />
      </Routes>
 
    </Router>
  
  );
}

export default App;
