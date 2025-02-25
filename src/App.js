import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import DoctorCard from "./components/DoctorCard";
import "./App.css";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // 📌 Vérifie la page actuelle
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [doctors, setDoctors] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}&location=${locationQuery}`);
      const data = await response.json();
      console.log("Données reçues de l'API :", data);
      setDoctors(Array.isArray(data) && data.length > 0 ? data : []);
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins", error);
      setDoctors([]);
    }
  };

  // ✅ Vérifie si la page actuelle est `/login` ou `/auth`
  const isAuthPage = location.pathname === "/login" || location.pathname === "/auth";

  return (
    <div className="App">
      <Header /> {/* ✅ Header TOUJOURS affiché */}

      {/* ✅ Afficher la barre de recherche UNIQUEMENT si on n'est PAS sur `/login` ou `/auth` */}
      {!isAuthPage && (
        <div className="search-bar-container">
          <SearchBar
            query={query}
            setQuery={setQuery}
            location={locationQuery}
            setLocation={setLocationQuery}
            onSearch={handleSearch}
          />
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        {/* ✅ Affichage des résultats de recherche UNIQUEMENT si on n'est PAS sur `/login` */}
        {!isAuthPage && (
          <div className="doctor-results">
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => <DoctorCard key={index} doctor={doctor} />)
            ) : (
              <p className="no-results"></p>
            )}
          </div>
        )}
      </main>

      <Footer /> {/* ✅ Footer TOUJOURS affiché */}
    </div>
  );
}

export default App;
