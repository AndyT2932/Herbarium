import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Container, Stack } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import NavBar from '../components/navbar';

const API_KEY = 'sk-E5fA6818358d8140410236'; // Replace this with your actual key

const PlantView = () => {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get ?q=plantname from the URL
  const queryParams = new URLSearchParams(location.search);
  const plantName = queryParams.get('q');

  useEffect(() => {
    const fetchPlantInfo = async () => {
      try {
        const response = await fetch(
          `https://perenual.com/api/species-list?key=${API_KEY}&q=${plantName}`
        );
        const data = await response.json();
        setPlant(data.data?.[0]); // First match
      } catch (error) {
        console.error('Error fetching plant info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (plantName) fetchPlantInfo();
  }, [plantName]);

  if (loading) return<div style={{ flex: 1, alignItems: "center", justifyContent: 'center'}}><p className='mainFont' style={{color: "#DCD7C9"}}>Loading plant info...</p></div>;
  if (!plant) return <div style={{ flex: 1, alignSelf:"flex-start"}}><NavBar /> <div style={{ flex: 1, alignItems: "center", justifyContent: 'center', alignSelf: "center", marginTop: 400}}> <p className='mainFont' style={{color: "#DCD7C9"}}>No data found for "{plantName}"</p></div></div>;

  return (
    <div style={{ flex: 1, justifyContent: 'flex-start' }}>
      <NavBar />
      <div className="main">
        <Container>
          <Row>
            <Col xl={4} md={4}>
              <Stack className="align-items-center text-center">
                <Image
                  src={plant.default_image?.original_url}
                  roundedCircle
                  fluid
                  style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                />
                <h2 className="mainFont" style={{color: "#DCD7C9"}}>{plant.common_name || 'No Common Name'}</h2>
                <h5 className="mainFont" style={{color: "#DCD7C9"}}><em>{plant.scientific_name}</em></h5>
              </Stack>
            </Col>
            <Col xl={8} md={8} style={{ backgroundColor: '#3F4F44', color: '#fff', padding: '2rem' }}>
              <Stack gap={3}>
                <div>
                  <h3 className='mainFont' >Plant Care</h3>
                  <p><strong>Watering:</strong> {plant.watering || 'N/A'}</p>
                  <p><strong>Sunlight:</strong> {plant.sunlight?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                <h3 className='mainFont'> Environmental Info</h3>
                  <p><strong>Cycle:</strong> {plant.cycle || 'N/A'}</p>
                  <p><strong>Type:</strong> {plant.type || 'N/A'}</p>
                </div>
                <div>
                <h3 className='mainFont'>Misc Info</h3>
                  <p><strong>Other Names:</strong> {plant.other_name?.join(', ') || 'N/A'}</p>
                  <p><strong>Edible:</strong> {plant.edible ? 'Yes' : 'No'}</p>
                  <p><strong>Invasive:</strong> {plant.invasive ? 'Yes' : 'No'}</p>
                </div>
              </Stack>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default PlantView;
