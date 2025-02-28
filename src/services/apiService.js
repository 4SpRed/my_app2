const apiService = {
    getDocuments: async (userId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/documents/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
  
        if (!response.ok) throw new Error("Erreur lors de la récupération des documents");
  
        return await response.json();
      } catch (error) {
        console.error("❌ Erreur API :", error);
        return [];
      }
    }
  };
  
  export default apiService;
  