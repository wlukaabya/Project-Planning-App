import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserSignUp from "./routes/UserSignUp";
import UserProjectsDetails from "./routes/UserProjectsDetails";
import EditProject from "./routes/EditProject";
import AddProject from "./routes/AddProject";
import SignIn from "./routes/SignIn";
import { UserContextProvider } from "./context/UserContext";
import Tasks from "./routes/Tasks";

function App() {
  return (
    <UserContextProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/home" element={<UserProjectsDetails />} />
            <Route path="/:id/update" element={<EditProject />} />
            <Route path="/:id/add" element={<AddProject />} />
            <Route path="/:id/tasks" element={<Tasks />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContextProvider>
  );
}

export default App;
