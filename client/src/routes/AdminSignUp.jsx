import React from "react";
import AdminSignUpForm from "../components/AdminSignUpForm";

const AdminSignUp = () => {
  return (
    <div>
      <div className="container mt-2">
        <h2>Please Enter Your Admin Details</h2>
        <AdminSignUpForm />
      </div>
    </div>
  );
};

export default AdminSignUp;
