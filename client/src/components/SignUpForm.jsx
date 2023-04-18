import React, { useEffect, useState } from "react";
import UserFinder from "../apis/UserFinder";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (email.length !== 0) {
        const login = await UserFinder.post("/", {
          username,
          password,
          email,
        });
        console.log(login.data);

        if (login.data.logins) {
          setMessage("User succesfully registered");
          setStatus(true);
          setEmail("");
          setPassword("");
          setUsername("");
        } else {
          setMessage(login.data.error);
          setStatus(false);
        }
      }
    } catch (error) {
      setStatus(false);
    }
  };

  return (
    <div className="card w-75 bg-light p-3">
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
      <div className={`${status ? "text-success" : "text-danger"}`}>
        {message}
      </div>
    </div>
  );
};

export default SignUpForm;
