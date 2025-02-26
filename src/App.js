import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ AuthContext ajouté
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import DoctorCard from "./components/DoctorCard";
import Account from "./pages/Account";
import "./App.css";

function App() {
  return (
    <AuthProvider> {/* ✅ AuthContext englobe toute l'application */}
      <Router>
        <MainContent /> {/* ✅ Gère l'affichage dynamique */}
      </Router>
    </AuthProvider>
  );
}

function MainContent() {
  const location = useLocation();
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

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      <Header />

      {/* ✅ Affichage de la barre de recherche seulement sur certaines pages */}
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
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} /> {/* ✅ Route bien ajoutée */}
        </Routes>

        {/* ✅ Affichage des résultats de recherche */}
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

      <Footer />
    </div>
  );
}

export default App;
