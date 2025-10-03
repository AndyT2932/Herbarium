import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

function About() {
    const textStyle = {
        color: "white",
        fontSize: "1.25rem",
        lineHeight: "1.6",
        maxWidth: "1400px",
        textAlign: "center",
        marginBottom: "20px"
    };

    return (
        <div style={{ flex: 1, justifyContent:"flex-start"}}>
            <Navbar />
        <div className="main">
            <p style={textStyle}>
                New York City is home to over <strong>1,300 species of native and non-native plants</strong>, thriving across parks, green spaces, and even sidewalks. Yet, many residents pass by these incredible organisms every day without knowing their names, stories, or ecological value. Our mission is to change that.
            </p>

            <p style={textStyle}>
                As climate change continues to disrupt ecosystems, we believe it’s more important than ever to connect people with the biodiversity around them.
            </p>

            <p style={textStyle}>
                Whether you're a casual explorer, a nature enthusiast, or someone eager to understand how climate change impacts your surroundings, our app provides location-based plant insights that are easy to access and understand.
            </p>

            <p style={textStyle}>
                Through our app, users can identify local plants and explore their ecological roles in the environment. By encouraging exploration and engagement, we hope to turn awareness into advocacy, empowering communities to care for their environment and better understand the ecological challenges we face today.
            </p>

        </div>
        </div>
    );
}

export default About;