



// ✅ Vérifie si SearchContext est bien défini, sinon supprime cette ligne
// import { SearchProvider } from './SearchContext';


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SearchProvider } from "./context/SearchContext"; // ✅ Import du contexte

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SearchProvider> {/* Fournisseur du contexte */}
      <App />
    </SearchProvider>
  </React.StrictMode>
);

reportWebVitals();
