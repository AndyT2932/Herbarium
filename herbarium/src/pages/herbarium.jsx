import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../components/firebase'; 
import NavBar from '../components/navbar';
import PlantRow from '../components/PlantRow';

const Herbarium = () => {
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUploads(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchUploads = async (uid) => {
    try {
      const uploadsRef = collection(db, `users/${uid}/uploads`);
      const snapshot = await getDocs(uploadsRef);

      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const uploadData = docSnap.data();

          // Try to get associated plantInfo
          const plantInfoRef = collection(db, `users/${uid}/uploads/${docSnap.id}/plantInfo`);
          const plantInfoSnap = await getDocs(plantInfoRef);
          const plantData = plantInfoSnap.docs[0]?.data() || {};
          console.log("names", plantData.commonNames)


          return {
            id: docSnap.id,
            imageUrl: uploadData.downloadURL || '',
            scientificName: plantData.scientificName || 'Unknown',
            commonNames: plantData.commonNames?.join(', ') || 'Unknown',
            location: `${uploadData.latitude?.toFixed(2) || 'N/A'}, ${uploadData.longitude?.toFixed(2) || 'N/A'}`,
            date: uploadData.timestamp?.toDate().toLocaleDateString() || 'Unknown',
          };
        })
      );

      setUploads(data);
    } catch (err) {
      console.error('Error fetching uploads:', err);
    }
  };

  return (
    <div style={{ flex: 1, justifyContent: 'flex-start' }}>
      <NavBar />
      <div className="main" style={{ flex: 1 }}>
        <div
          style={{
            flex: 1,
            width: '100%',
            padding: 50,
            margin: 50,
            backgroundColor: '#3F4F44',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#A27B5C',
              color: '#DCD7C9',
              padding: '1rem',
              fontFamily: 'serif',
              fontSize: '1rem',
              gap: '2rem',
            }}
          >
            <div style={{ flex: 0.3 }}>Image</div>
            <div style={{ flex: 1.3 }}>Common Names</div>
            <div style={{ flex: 1.4 }}>Scientific Name</div>
            <div style={{ flex: 1}}>Location</div>
            <div style={{ flex: 1, paddingRight: 90 }}>Date</div>
          </div>

          {uploads.map((upload, index) => (
            <PlantRow
              key={upload.id}
              imageUrl={upload.imageUrl}
              name={upload.scientificName}
              category={upload.commonNames}
              location={upload.location}
              date={upload.date}
              id={upload.id}
              bgType={index % 2 === 0 ? '2' : '1'}

            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Herbarium;
