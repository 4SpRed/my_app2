// src/components/DocumentManager.js
import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const DocumentManager = ({ userId }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await apiService.getDocuments(userId);
      setDocuments(data);
    };
    fetchDocuments();
  }, [userId]);

  return (
    <div className="document-manager">
      <h2>Mes Documents</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentManager;
