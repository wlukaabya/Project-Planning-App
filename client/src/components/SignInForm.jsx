import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import ErrorModal from "./ErrorModal";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShowModal(true);
      setError("Please ensure all the fields are entered");
    }
    try {
      const response = await UserFinder.post("/signIn", {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        setError("Invalid email or password");
        setShowModal(true);
      }
    } catch (error) {
      setError("Invalid email or password");
      setShowModal(true);
    }
  };

  return (
    <div className="d-flex justify-content-center ">
      <div className="card w-75 bg-light">
        <div className="card-body">
          <h3 className=" text-center card-title">Login</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="InputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="InputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="InputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="InputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Sign In
              </button>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <a href="/signup" className="link-primary">
                User signup
              </a>
              <a href="/AdminSignup" className="link-primary">
                Admin signup
              </a>
            </div>
          </form>
        </div>
      </div>
      {showModal && <ErrorModal message={error} setShowModal={setShowModal} />}
    </div>
  );
};

export default SignInForm;
