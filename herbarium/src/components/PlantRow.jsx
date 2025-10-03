import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../components/firebase'; 

const PlantRow = ({
  imageUrl = '',
  category = '',
  name = 'Venus Fly Trap',
  location = 'NY, NY',
  date = '3/6/2025',
  bgType = "1", 
  id// 1 = light green, 2 = dark green
}) => {
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const backgroundColor = bgType === "1" ? "#392c2f" : "#2C3930";

  let Category = category.includes(',') 
    ? category.split(',')[0].trim() // Use the first category if multiple are present
    : category.trim(); // If there's only one category, use it as is

    Category = Category.replace(/-/g, '');


    const handleDelete = async () => {
        if (!auth.currentUser) {
          alert('You must be logged in to delete items');
          return;
        }
      
        const userId = auth.currentUser.uid;
        try {
          await deleteDoc(doc(db, 'users', userId, 'uploads', id)); 
          console.log('Document successfully deleted!');
        } catch (error) {
          console.error('Error deleting document: ', error);
        }
        window.location.reload();
      };
      
      const handleImageClick = (e) => {
        e.preventDefault();
        setShowEnlargedImage(true);
      };

      return (
        <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: backgroundColor,
            color: '#DCD7C9',
            padding: '1rem',
            fontFamily: 'serif',
            fontSize: '1rem',
            gap: '2rem',
          }}
        >
          <Link
            to={`/plantview?q=${encodeURIComponent(Category)}`}
            style={{ textDecoration: 'none', display: 'flex', flex: 1, alignItems: 'center', gap: '2rem', color: '#DCD7C9' }}
          >
            <div
              onClick={handleImageClick}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'black',
                backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <div style={{ flex: 1.5 }}>{category}</div>
            <div style={{ flex: 1.5 }}>{name}</div>
            <div style={{ flex: 1 }}>{location}</div>
            <div style={{ flex: 1 }}>{date}</div>
          </Link>
    
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Delete
          </button>
        </div>

        {showEnlargedImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowEnlargedImage(false)}
          >
            <img
              src={imageUrl}
              alt={name}
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        </>
      );
    };
    
    export default PlantRow;