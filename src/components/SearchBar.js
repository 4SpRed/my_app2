
import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";
const SearchBar = ({ query, setQuery, location, setLocation, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const suggestionBoxRef = useRef(null);
  const locationBoxRef = useRef(null);
  const listRef = useRef(null);
  const locationInputRef = useRef(null);
  // Fetch doctor suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    fetch(`http://localhost:5000/autocomplete?query=${query}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch(() => setSuggestions([]));
  }, [query]);
  // Fetch location suggestions
  useEffect(() => {
    if (location.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    fetch(`http://localhost:5000/autocomplete-location?query=${location}`)
      .then((res) => res.json())
      .then((data) => setLocationSuggestions(data))
      .catch(() => setLocationSuggestions([]));
  }, [location]);
  // Scroll into view when navigating with arrows
  const scrollIntoView = (index, listRef) => {
    if (listRef.current) {
      const selectedItem = listRef.current.children[index];
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  };
  // Handle keyboard navigation and selection
  const handleKeyDown = (e, isLocation = false) => {
    const list = isLocation ? locationSuggestions : suggestions;
    const selectedIdx = isLocation ? selectedLocationIndex : selectedIndex;
    const setSelectedIdx = isLocation ? setSelectedLocationIndex : setSelectedIndex;
    const setValue = isLocation ? setLocation : setQuery;
    const clearSuggestions = isLocation ? setLocationSuggestions : setSuggestions;
    if (list.length > 0) {
      if (e.key === "ArrowDown") {
        setSelectedIdx((prev) => {
          const newIndex = prev < list.length - 1 ? prev + 1 : prev;
          scrollIntoView(newIndex, isLocation ? locationBoxRef : listRef);
          return newIndex;
        });
      } else if (e.key === "ArrowUp") {
        setSelectedIdx((prev) => {
          const newIndex = prev > 0 ? prev - 1 : 0;
          scrollIntoView(newIndex, isLocation ? locationBoxRef : listRef);
          return newIndex;
        });
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (selectedIdx >= 0) {
          setValue(list[selectedIdx].Nom || list[selectedIdx]);
          setSelectedIdx(-1);
          // ✅ Ajout d'un setTimeout pour forcer la fermeture après une sélection
          setTimeout(() => {
            clearSuggestions([]);
          }, 50);
          // ✅ Passer au champ suivant après sélection
          if (!isLocation) {
            setTimeout(() => locationInputRef.current.focus(), 100);
          }
        }
      }
    }
  };
  // Handle click selection
  const handleSelect = (value, isLocation = false) => {
    if (isLocation) {
      setLocation(value);
      setSelectedLocationIndex(-1);
      setTimeout(() => setLocationSuggestions([]), 50); // ✅ Fermeture immédiate des suggestions
    } else {
      setQuery(value);
      setSelectedIndex(-1);
      setTimeout(() => setSuggestions([]), 50); // ✅ Fermeture immédiate des suggestions
      setTimeout(() => locationInputRef.current.focus(), 100); // ✅ Passage au champ "Où ?"
    }
  };
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target) &&
        locationBoxRef.current && !locationBoxRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setLocationSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="search-bar-section">
      <h2 className="search-title">Trouvez votre médecin en un clic</h2>
      <div className="search-container">
        {/* Champ de recherche principal */}
        <div className="search-input-container" ref={suggestionBoxRef}>
          <input
            type="text"
            className="search-input query-input"
            placeholder="Nom, spécialité, établissement..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, false)}
          />
          {/* Affichage des suggestions de médecins */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list" ref={listRef}>
              {suggestions.map((doctor, index) => (
                <li
                  key={index}
                  className={index === selectedIndex ? "selected" : ""}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(doctor.Nom, false)}
                >
                  <img
                    src={doctor.Photo ? doctor.Photo : "/assets/utilisateur.png"}
                    alt={doctor.Nom}
                    className="doctor-avatar"
                  />
                  <div className="doctor-info">
                    <strong>{doctor.Prénom} {doctor.Nom}</strong>
                    <span className="doctor-speciality">{doctor.Spécialité}</span>
                    <span className="doctor-location">{doctor.Wilaya}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Champ de recherche pour la localisation */}
        <div className="search-input-container" ref={locationBoxRef}>
          <input
            type="text"
            className="search-input location-input"
            placeholder="Où ?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, true)}
            ref={locationInputRef}
          />
          {/* Affichage des suggestions de localisations */}
          {locationSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {locationSuggestions.map((loc, index) => (
                <li
                  key={index}
                  className={index === selectedLocationIndex ? "selected" : ""}
                  onMouseEnter={() => setSelectedLocationIndex(index)}
                  onClick={() => handleSelect(loc, true)}
                >
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Bouton de recherche */}
        <button className="search-button" onClick={onSearch}>Rechercher</button>
      </div>
    </div>
  );
};
export default SearchBar;