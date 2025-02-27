import React from 'react';
import './SignupPage.css'; // Assuming you have a CSS file for styling

const SignupPage: React.FC = () => {
  return (
    <div className="signup-page">
      <h1>Create an Account</h1>
      <div className="signup-options">
        <button className="google-signin-button">Sign up with Google</button>
        <button className="email-signin-button">Sign up with Email</button>
      </div>
    </div>
  );
};

export default SignupPage; 