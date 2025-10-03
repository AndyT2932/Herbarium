import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ImageUpload from "../components/imageUpload";
import  NavBar  from "../components/navbar";
import PlantId from "../components/plantId";


function Upload() {
    return (
        <div style={{ flex: 1, justifyContent:"flex-start"}}>
                <NavBar />
             <div className=" main" style={{flex: 1}}>


                <div style={{
                        backgroundColor: "#3F4F44",
                        padding: "2rem",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                        textAlign: "center",
                        minWidth: "300px",
                        maxWidth: "80%",
                    
                        }}>
                    {/* <ImageUpload /> */}
                    <PlantId />
                </div>

             </div>
        </div>
      
      );
}

export default Upload;