import React, { createContext, useReducer } from "react";
import { UserReducer } from "../Reducers/UserReducer";

const initialState = {
  projects: [],
  tasks: [],
  users: [],
  user: {},
  loading: false,
  error: null,
};

export const context = createContext(initialState);

const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  return (
    <context.Provider value={{ state, dispatch }}>
      {props.children}
    </context.Provider>
  );
};

export default ContextProvider;
