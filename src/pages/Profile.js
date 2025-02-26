import { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem("token"); // Si le token est invalide
        });
    }
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Profil de {user.email}</h2>
          <p>Rôle : {user.role}</p>
        </>
      ) : (
        <h2>Veuillez vous connecter.</h2>
      )}
    </div>
  );
};

export default Profile;
