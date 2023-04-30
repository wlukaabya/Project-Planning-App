import React from "react";
import SignInForm from "../components/SignInForm";

const SignIn = () => {
  return (
    <div className="container mt-2">
      <h1 className="text-center bg-primary mb-3">Enter Your Login Details </h1>
      <SignInForm />
    </div>
  );
};

export default SignIn;
