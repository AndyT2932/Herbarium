import React, { useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { db, auth } from "../components/firebase.jsx";
import { collection, query, getDocs } from "firebase/firestore";
import NavBar from "../components/navbar.jsx";
import { onAuthStateChanged } from "firebase/auth";

const containerStyle = {
  width: "100%",
  height: "100vh",
  marginTop: "3rem",
};

const center = {
  lat: 40.71153259277344,
  lng: -74.00523376464844,
};

const libraries = ["places", "marker"];

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
    libraries,
  });

  const onLoad = useCallback((map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new window.google.maps.marker.AdvancedMarkerElement({
            position: userPos,
            map,
            title: "My location",
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(collection(db, `users/${user.uid}/uploads`));
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { latitude, longitude, downloadURL } = data;

        if (latitude && longitude) {
          const position = { lat: latitude, lng: longitude };
          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: "Image Upload Location",
          });

          if (downloadURL) {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div>
                  <a href="/herbarium" style="text-decoration: none;">
                    <img src="${downloadURL}" alt="Preview" width="200" style="cursor: pointer;" />
                  </a>
                </div>
              `,
            });

            marker.addEventListener("click", () => {
              infoWindow.open(map, marker);
            });
          }
        }
      });
    });
  }, []);

  return isLoaded ? (
    <div style={{ flex: 1, justifyContent: "flex-start" }}>
      <NavBar />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        options={{ mapId: "3c34c41f2385ff38" }}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default Map;
