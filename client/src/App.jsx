import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserSignUp from "./routes/UserSignUp";
import EditProject from "./routes/EditProject";
import AddProject from "./routes/AddProject";
import SignIn from "./routes/SignIn";
import { UserContextProvider } from "./context/UserContext";
import Tasks from "./routes/Tasks";
import AdminSignUp from "./routes/AdminSignUp";
import HomePage from "./routes/HomePage";

function App() {
  return (
    <UserContextProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/AdminSignup" element={<AdminSignUp />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/:id/update" element={<EditProject />} />
            <Route path="/add" element={<AddProject />} />
            <Route path="/:id/tasks" element={<Tasks />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContextProvider>
  );
}

export default App;
