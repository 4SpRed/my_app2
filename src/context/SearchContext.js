import React, { createContext, useState } from "react";

export const SearchContext = createContext(); // ✅ Création du contexte

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Recherche en cours :", { query, location });
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, location, setLocation, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
