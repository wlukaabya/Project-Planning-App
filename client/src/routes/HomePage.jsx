import React, { useContext, useEffect, useState } from "react";
//import UserPage from "../components/UserPage";
import AdminPage from "../components/AdminPage";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import UserPage from "../components/UserPage";
import { context } from "../context/context";

const HomePage = () => {
  //const { user, setUser, role, setRole } = useContext(UserContext);
  const { state, dispatch } = useContext(context);
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles, username, exp } = decoded;
        setUser({ userId, roles });
        setTokenExpiration(exp * 1000);

        const currentTime = Date.now();
        if (tokenExpiration && currentTime > tokenExpiration) {
          navigate("/");
        } else {
          setRole(roles);
        }

        dispatch({
          type: "SET_USER",
          payload: { id: userId, name: username, roles: roles },
        });
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  return user ? (
    <div>{role === "admin" ? <AdminPage /> : <UserPage />}</div>
  ) : (
    ""
  );
};

export default HomePage;
