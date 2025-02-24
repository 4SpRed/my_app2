import React from "react";
import "./SearchBar.css";

const SearchBar = ({ query, setQuery, location, setLocation, onSearch }) => {
// Détecter la touche Entrée et exécuter la recherche
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };
  return (
    <div className="search-bar-section">
      <h2 className="search-title">Trouvez votre médecin en un clic</h2>
      <div className="search-container">
      <input
        type="text"
        placeholder="Nom, spécialité, établissement, ..."
        className="search-input query-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // Ajout ici
        />
        <input
        type="text"
        placeholder="Où ?"
        className="search-input location-input"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyPress} // Ajout ici
        />

        
        <button className="search-button" onClick={onSearch}>Rechercher</button>
      </div>
    </div>
  );
};

const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch();  // Exécute la fonction de recherche
    }
  };
  

export default SearchBar;


  