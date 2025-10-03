import React, { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { storage, db, auth } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {collection, addDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { Stack } from "react-bootstrap";
import { Form } from "react-bootstrap";
import exifr from 'exifr';
import axios from 'axios'; // axios was just imported, run "npm i" to start a dev server

// I might hide this, but for now, it's just a test
const api_key = ""


const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [organs, setOrgans] = useState([]);
  const [project, setProject] = useState("all");
  const [includeRelatedImages, setIncludeRelatedImages] = useState(false);
  const [noReject, setNoReject] = useState(false);
  const [nbResults, setNbResults] = useState(10);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [lastUpload, setLastUpload] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  

  const handleFileChange = (e) => {
    if (e.target.files) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/heic", "image/heif"];
      const invalidFiles = Array.from(e.target.files).filter(file => !validImageTypes.includes(file.type));

      if (invalidFiles.length > 0) {
        alert("Invalid file type(s) detected. Please upload only image files (JPEG, PNG, GIF, HEIC, HEIF).");
        return;
      }

      setImages(Array.from(e.target.files));
      Array.from(e.target.files).forEach(file => extractLocation(file));
      setLastUpload(e.target.files[0].name);
    }
  };

  const handleOrgansChange = (e) => {
    setOrgans(e.target.value.split(","));
  };

  const metadata = {
    customMetadata: {
      "latitude": location.latitude,
      "longitude": location.longitude,
    }
  };

  const handleUpload = async () => {
    if (!user) {
      alert("You must be logged in to upload an image");
      return;
    }
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    if (organs.length !== images.length) {
      alert("The number of organs must match the number of images.");
      return;
    }

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
      formData.append('organs', organs[index] || 'auto');
    });

    try {
      const response = await axios.post(`https://my-api.plantnet.org/v2/identify/${project}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          'include-related-images': includeRelatedImages,
          'no-reject': noReject,
          'nb-results': nbResults,
          'api-key': api_key, // Use the hardcoded API key
        },
      });

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }

    images.forEach(image => {
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
          console.log(downloadURL);

          try {
            await addDoc(collection(db, `users/${user.uid}/uploads`),
              {
                downloadURL: url,
                imageName: image.name,
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: new Date(),
              });
              console.log("Image info uploaded to db")
          } catch (error) {
            console.log(error.message);
          }
        }
      );
    });
  };



  return (
    <Stack gap={5}>
        <div style={{ border: " 3px dotted grey", borderRadius: "12px", padding: "100px", }}>

          <Form.Group controlId="formFile"  >
            <Form.Control type="file" multiple onChange={handleFileChange} className="bg-secondary border-secondary btn-secondary"/>
          </Form.Group>

        </div>
        <input
          type="text"
          placeholder="Organs (comma-separated, e.g., leaf,flower)"
          onChange={handleOrgansChange}
        />
        <input
          type="text"
          placeholder="Project (default: all)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          type="checkbox"
          checked={includeRelatedImages}
          onChange={(e) => setIncludeRelatedImages(e.target.checked)}
        /> Include Related Images
        <input
          type="checkbox"
          checked={noReject}
          onChange={(e) => setNoReject(e.target.checked)}
        /> No Reject
        <input
          type="number"
          placeholder="Number of Results (default: 10)"
          value={nbResults}
          onChange={(e) => setNbResults(Number(e.target.value))}
        />
        <Button variant="success" onClick={handleUpload}>Upload</Button>
        <p>Upload Progress: {progress}%</p>
    </Stack>
  );
};

export default ImageUpload;
