import React from 'react';
import '../scss/Profile.scss';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    roles: string[];
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
      </div>
    </div>
  );
};

export default Profile;