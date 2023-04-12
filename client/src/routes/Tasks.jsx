import React, { useContext, useEffect } from "react";
import TasksForm from "../components/TasksForm";
import TasksTable from "../components/TasksTable";
import NavBarAlt from "../components/NavBarAlt";
import { UserContext } from "../context/UserContext";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const Tasks = () => {
  const { user, setUser } = useContext(UserContext);
  const params = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles } = decoded;
        setUser({ userId, roles });
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  return user ? (
    <div>
      <NavBarAlt />
      <TasksForm id={params.id} />
      <TasksTable />
    </div>
  ) : null;
};

export default Tasks;
