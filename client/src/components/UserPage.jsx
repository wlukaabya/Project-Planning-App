import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const UserPage = () => {
  const {
    user,
    userProjects,
    setUserProjects,
    loggedAssignee,
    setLoggedAssignee,
  } = useContext(UserContext);
  let navigate = useNavigate();
  const [message, setMessage] = useState("");

  const getUser = async () => {
    try {
      if (!user) {
        console.log("awaiting user");
        return;
      }
      const result = await UserFinder.get(`/user/${user.userId}`);
      setLoggedAssignee(result.data.results.username);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      if (!loggedAssignee) {
        console.log("Assignee is undefined");
        return;
      }
      const projects = await UserFinder.get(`projects/${loggedAssignee}`);
      setUserProjects(projects.data.results);
    } catch (error) {
      console.log("awaiting loggedAssignee");
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    if (loggedAssignee !== undefined) {
      getProjects();
    } else {
      setUserProjects([]);
    }
  }, [loggedAssignee, setUserProjects]);

  return (
    <>
      <div>
        <NavBar />
        <div className="d-flex justify-content-between mt-3 container">
          <h3>
            <small className="muted">Welcome User</small>
          </h3>
          <h1 className="text-center text-secondary mb-3">
            User Assigned Projects
          </h1>
        </div>
      </div>

      {userProjects ? (
        <div className="container">
          <div className=" mb-2">
            <h1 className="text-info">Project List</h1>
          </div>

          <div className="row">
            {userProjects.map((project) => (
              <div className="col-lg-6 " key={project.id}>
                <div
                  className="card mb-4 bg-success"
                  onClick={() => navigate(`/${project.id}/tasks`)}
                >
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between">
                      <h3> {project.project_title} </h3>
                      <div>{project.date.split("T")[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {<div className="text-danger">{message}</div>}
        </div>
      ) : (
        <div>No projects found</div>
      )}
    </>
  );
};

export default UserPage;
