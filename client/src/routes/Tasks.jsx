import React, { useContext, useEffect, useState } from "react";
import TasksForm from "../components/TasksForm";
import TasksTable from "../components/TasksTable";
import NavBarAlt from "../components/NavBarAlt";

import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { context } from "../context/context";
import UserFinder from "../apis/UserFinder";

const Tasks = () => {
  const { state, dispatch } = useContext(context);

  const [tokenExpiration, setTokenExpiration] = useState(null);
  const params = useParams();

  const navigate = useNavigate();

  const getTasks = async () => {
    try {
      dispatch({
        type: "LOAD_DATA",
        data: true,
      });
      if (state.loading === true) {
        const tasks = await UserFinder.get(`${params.id}/tasks`);
        dispatch({
          type: "LOAD_TASKS",
          data: tasks.data.tasks,
        });
        dispatch({
          type: "LOAD_DATA",
          data: false,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "LOAD_DATA",
        data: false,
      });
    }
  };

  useEffect(() => {
    if (state.tasks.length === 0) {
      getTasks();
    }
  }, [state.tasks, state.loading]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles, exp } = decoded;

        setTokenExpiration(exp * 1000);
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles, username, exp } = decoded;

        dispatch({
          type: "SET_USER",
          payload: { id: userId, name: username, roles: roles },
        });

        setTokenExpiration(exp * 1000);

        const currentTime = Date.now();
        if (tokenExpiration && currentTime > tokenExpiration) {
          navigate("/");
        } else {
        }
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  return (
    <div>
      {tokenExpiration && Date.now() > tokenExpiration ? (
        <p>session expired</p>
      ) : state ? (
        <div>
          <NavBarAlt />
          <TasksForm id={params.id} role={state.user.roles} />
          <TasksTable />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Tasks;
