import React, { useContext, useEffect, useState } from "react";
//import UserPage from "../components/UserPage";
import AdminPage from "../components/AdminPage";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import UserPage from "../components/UserPage";

const HomePage = () => {
  const { user, setUser, role, setRole } = useContext(UserContext);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles, exp } = decoded;
        setUser({ userId, roles });
        setTokenExpiration(exp * 1000);
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  const getUser = async (id) => {
    const currentTime = Date.now();
    if (tokenExpiration && currentTime > tokenExpiration) {
      navigate("/");
    } else {
      try {
        const response = await UserFinder.get(`/user/${id}`);
        setRole(response.data.results.role);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (user) {
      getUser(user.userId);
    }
  }, [user]);

  return user ? (
    <div>{role === "admin" ? <AdminPage /> : <UserPage />}</div>
  ) : (
    ""
  );
};

export default HomePage;
