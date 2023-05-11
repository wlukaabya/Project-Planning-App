import React, { useEffect, useState } from "react";
import UserFinder from "../apis/UserFinder";
import { useNavigate } from "react-router-dom";
import "../index.css";
import ErrorModal from "./ErrorModal";
import SucessModal from "./SuccessModal";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setMessage("Please fill in all fields");
      setStatus(false);
      setShowModal(true);
      return;
    }

    try {
      if (email.length !== 0) {
        const login = await UserFinder.post("/", {
          username,
          password,
          email,
          role: "user",
        });
        console.log(login.data);

        if (login.data.logins) {
          setMessage("User succesfully registered");
          setStatus(true);
          setEmail("");
          setPassword("");
          setUsername("");
          setStatus(true);
        } else {
          setMessage(login.data.error);
          setStatus(false);
          setShowModal(true);
        }
      }
    } catch (error) {
      setMessage("Server error occurred");
      setStatus(false);
      setShowModal(true);
    }
  };

  return (
    <div className="card w-75 bg-light p-3">
      {showModal && (
        <ErrorModal setShowModal={setShowModal} message={message} />
      )}
      {status && <SucessModal setStatus={setStatus} message={message} />}
      <span className="mb-3">
        {" "}
        Create an account or
        <a href="/" className="link-primary">
          log in
        </a>
      </span>

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
        </div>
        <div className="mb-3">
          <label htmlFor="InputUsername" className="form-label">
            Username
          </label>
          <input
            type="username"
            className="form-control"
            id="InputUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
