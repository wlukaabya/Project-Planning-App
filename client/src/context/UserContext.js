import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userProjects,
        setUserProjects,
        tasks,
        setTasks,
        addTask,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
