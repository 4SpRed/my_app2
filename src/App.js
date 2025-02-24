import React, { useState } from 'react';
import './App.css';
import SearchBar from "./components/SearchBar";
import DoctorCard from "./components/DoctorCard";

function App() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [doctors, setDoctors] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}&location=${location}`);
      const data = await response.json();

      console.log("Données reçues de l'API :", data);

      if (Array.isArray(data) && data.length > 0) {
        setDoctors(data);
      } else {
        setDoctors([]); 
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins", error);
    }
  };

  return (
    <div className="App">
      <SearchBar 
        query={query}
        setQuery={setQuery}
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />

      {/* Affichage des fiches médecins en grille */}
      <div className="doctor-results">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => <DoctorCard key={index} doctor={doctor} />)
        ) : (
          <p className="no-results"></p>
        )}
      </div>

   
    </div>
  );
}

export default App;
