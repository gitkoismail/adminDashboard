import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  return (
    <main className="pages profile-page">
      <h2>User Profile Details</h2>

      <section className="profile-card">
        <img
          className="profile-avatar"
          src={user.avatar || "https://i.pravatar.cc/300"}
          alt={`${user.name || "User"} profile`}
        />

        <div className="profile-info">
          <h3>Personal Information</h3>

          <p>
            <strong>Name:</strong>
            <span>{user.name || "Unknown User"}</span>
          </p>

          <p>
            <strong>Email:</strong>
            <span>{user.email || "No email"}</span>
          </p>

          <p>
            <strong>ID:</strong>
            <span>{user.id || "No ID"}</span>
          </p>

          <p className="profile-helper">
            This profile is managed by the system
          </p>
        </div>
      </section>
    </main>
  );
};

export default Profile;