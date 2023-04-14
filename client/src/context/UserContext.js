import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleTaskCancel = () => {
    setSelectedTask(null);
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
        handleTaskUpdate,
        handleTaskCancel,
        selectedTask,
        setSelectedTask,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
