import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userProjects,
        setUserProjects,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
