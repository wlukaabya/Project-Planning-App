import React, { useContext, useEffect, useState } from "react";
import TasksForm from "../components/TasksForm";
import TasksTable from "../components/TasksTable";
import NavBarAlt from "../components/NavBarAlt";
import { UserContext } from "../context/UserContext";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const Tasks = () => {
  const { user, setUser, role } = useContext(UserContext);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const params = useParams();

  const navigate = useNavigate();
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

  return (
    <div>
      {tokenExpiration && Date.now() > tokenExpiration ? (
        <p>session expired</p>
      ) : user ? (
        <div>
          <NavBarAlt />
          <TasksForm id={params.id} role={role} />
          <TasksTable />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Tasks;
