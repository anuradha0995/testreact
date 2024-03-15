import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 40.7128, // Replace with default latitude if needed
  lng: -74.0059, // Replace with default longitude if needed
};

const RestaurantFinder = () => {
  const [keyword, setKeyword] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleSearch = async () => {
    if (!keyword) return;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}&key=YOUR_API_KEY`
    );
    const data = await response.json();

    setRestaurants(data.results.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      formatted_address: restaurant.formatted_address,
      geometry: restaurant.geometry.location,
    })));
  };

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  useEffect(() => {
    // Fetch user location (optional)
    navigator.geolocation.getCurrentPosition((position) => {
      center.lat = position.coords.latitude;
      center.lng = position.coords.longitude;
    });
  }, []);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Restaurant Finder</h1>
        <input
          type="text"
          placeholder="Search for restaurants..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </nav>
      <LoadScript
        libraries={libraries}
        googleMapsApiKey="YOUR_API_KEY" // Replace with your Google Maps API key
      >
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={restaurant.geometry}
              onClick={() => handleMarkerClick(restaurant)}
            />
          ))}
          {selectedRestaurant && (
            <InfoWindow position={selectedRestaurant.geometry}>
              <div>
                <h3>{selectedRestaurant.name}</h3>
                <p>{selectedRestaurant.formatted_address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RestaurantFinder;
