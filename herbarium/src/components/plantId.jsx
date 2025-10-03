import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { storage, db, auth } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  setDoc
} from "firebase/firestore";
import { Button, Stack, Form } from "react-bootstrap";
import exifr from "exifr";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [lastUpload, setLastUpload] = useState("");
  const [user, setUser] = useState(null);
  const [identification, setIdentification] = useState(null);

  const PLANTNET_API_KEY = ""; // Replace this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const validImageTypes = ["image/jpeg", "image/png"];
      const file = e.target.files[0];

      if (!validImageTypes.includes(file.type)) {
        alert("Invalid file type. We need to identify your plant through an image. Please upload an image file (JPEG, PNG).");
        return;
      }

      setImage(file);
      extractLocation(file);
      setLastUpload(file.name);
    }
  };

  const metadata = {
    customMetadata: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
  };

  const handleUpload = () => {
    if (!user) {
      alert("You must be logged in to upload an image");
      return;
    }
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);

        try {
          // Add upload data to Firestore and capture the doc reference
          const docRef = await addDoc(collection(db, `users/${user.uid}/uploads`), {
            downloadURL: url,
            imageName: image.name,
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date(),
          });

          console.log("Image info uploaded to db:", docRef.id);

          // Identify plant and store result under that upload document
          await identifyPlant(image, docRef.id);
        } catch (error) {
          console.error("Firestore error:", error.message);
        }
      }
    );
  };

  const fetchMetadata = () => {
    const imageRef = ref(storage, `images/${lastUpload}`);
    getMetadata(imageRef)
      .then((metadata) => {
        console.log("Metadata:", metadata);
      })
      .catch((error) => {
        console.error("Error getting metadata:", error);
      });
  };

  async function extractLocation(file) {
    try {
      const metadata = await exifr.parse(file);
      const { latitude, longitude } = metadata;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      setLocation({ latitude, longitude });
    } catch (error) {
      console.error("Error extracting EXIF data:", error);
    }
  }

  const identifyPlant = async (file, uploadDocId) => {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("organs", "leaf");

    try {
      const res = await axios.post(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const bestResult = res.data.results?.[0];
      if (bestResult) {
        const plantInfo = {
          scientificName: bestResult.species.scientificNameWithoutAuthor,
          commonNames: bestResult.species.commonNames || [],
          score: parseFloat((bestResult.score * 100).toFixed(2)),
        };

        setIdentification(plantInfo);

        // Save to Firestore under the same upload document
        const infoRef = doc(db, `users/${user.uid}/uploads/${uploadDocId}/plantInfo/main`);
        await setDoc(infoRef, plantInfo);

        console.log("Plant identification info saved to Firestore.");
      } else {
        setIdentification(null);
      }
    } catch (err) {
      console.error("PlantNet API error:", err);
    }
  };

  return (
    <Stack gap={5}>
      <div
        style={{
          border: "3px dotted grey",
          borderRadius: "12px",
          padding: "100px",
        }}
      >
        <Form.Group controlId="formFile">
          <Form.Control
            type="file"
            onChange={handleFileChange}
            className="bg-secondary border-secondary btn-secondary"
          />
        </Form.Group>
      </div>

      <Button variant="success" onClick={handleUpload}>
        Upload
      </Button>
      {/* <Button variant="info" onClick={fetchMetadata}>
        Get Metadata
      </Button> */}
      <p className="mainFont" style={{color: "#DCD7C9"}}> Upload Progress: {progress}%</p>

      {identification && (
        <div>
          <h4 className="mainFont" style={{color: "#DCD7C9"}}>Identification Result</h4>
          <p className="mainFont" style={{color: "#DCD7C9"}}>
            <strong>Scientific Name:</strong> {identification.scientificName}
          </p>
          <p className="mainFont" style={{color: "#DCD7C9"}}>
            <strong className="mainFont" style={{color: "#DCD7C9"}}>Common Names:</strong>{" "}
            {identification.commonNames?.join(", ")}
          </p>
          <p className="mainFont" style={{color: "#DCD7C9"}} >
            <strong className="mainFont" style={{color: "#DCD7C9"}}>Confidence:</strong> {identification.score}%
          </p>
        </div>
      )}
    </Stack>
  );
};

export default ImageUpload;
